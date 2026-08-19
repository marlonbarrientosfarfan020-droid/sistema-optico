"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saleSchema, SaleFormData, paymentSchema, PaymentFormData } from "@/lib/validations/sale";
import { round2 } from "@/lib/utils";

export async function getSales(patientId?: string) {
  try {
    const where = patientId ? { patientId } : {};
    return await prisma.sale.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        patient: true,
        user: true,
        items: { include: { product: true } },
        payments: true,
        workOrders: true,
      },
    });
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    return [];
  }
}

export async function getPendingBalances() {
  try {
    return await prisma.sale.findMany({
      where: {
        balanceDue: { gt: 0 },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        patient: true,
        payments: true,
        workOrders: true,
      },
    });
  } catch (error) {
    console.error("Error al obtener cuentas por cobrar / saldos pendientes:", error);
    return [];
  }
}

export async function createSale(data: SaleFormData) {
  try {
    const validated = saleSchema.parse(data);

    // Calculate total and balance with safe 2-decimal rounding
    const totalAmount = round2(validated.totalAmount);
    const initialPaymentAmount = validated.initialPayment ? round2(validated.initialPayment.amount) : 0;
    const balanceDue = round2(Math.max(0, totalAmount - initialPaymentAmount));
    const saleStatus = balanceDue <= 0 ? "COMPLETED" : "PARTIAL";

    // Format: VTA-YYYY-XXXX
    const count = await prisma.sale.count();
    const currentYear = new Date().getFullYear();
    const saleNumber = `VTA-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    const sale = await prisma.sale.create({
      data: {
        saleNumber,
        patientId: validated.patientId,
        branchId: validated.branchId || null,
        prescriptionId: validated.prescriptionId || null,
        status: saleStatus,
        subtotal: round2(validated.subtotal),
        discount: round2(validated.discount),
        tax: round2(validated.tax),
        totalAmount,
        paidAmount: initialPaymentAmount,
        balanceDue,
        notes: validated.notes || null,

        // Create items
        items: {
          create: validated.items.map((item) => ({
            productId: item.productId || null,
            description: item.description,
            quantity: item.quantity,
            unitPrice: round2(item.unitPrice),
            discount: round2(item.discount),
            total: round2(item.total),
          })),
        },

        // Create initial payment / deposit if provided
        payments: validated.initialPayment
          ? {
            create: {
              amount: initialPaymentAmount,
              paymentMethod: validated.initialPayment.paymentMethod,
              paymentType:
                balanceDue > 0 ? "ADVANCE_DEPOSIT" : "FULL_PAYMENT",
              referenceNumber: validated.initialPayment.referenceNumber || null,
              notes:
                validated.initialPayment.notes ||
                (balanceDue > 0 ? "Seña / Anticipo inicial" : "Pago total al contado"),
            },
          }
          : undefined,
      },
      include: {
        items: true,
        payments: true,
      },
    });

    // Reduce inventory stock for products in sale items
    for (const item of validated.items) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            inventoryMovements: {
              create: {
                type: "SALE",
                quantity: -item.quantity,
                previousStock: 0,
                newStock: 0,
                reason: `Venta ${saleNumber}`,
                referenceId: sale.id,
              },
            },
          },
        }).catch((err: any) => console.warn(`Stock decrement skipped for ${item.productId}:`, err));
      }
    }

    revalidatePath("/pos");
    revalidatePath("/ventas");
    revalidatePath("/caja");
    revalidatePath(`/pacientes/${validated.patientId}`);
    return { success: true, data: sale };
  } catch (error: any) {
    console.error("Error al registrar venta:", error);
    return {
      success: false,
      error: error.message || "No se pudo procesar la venta en el POS.",
    };
  }
}

export async function recordBalancePayment(
  saleId: string,
  paymentData: PaymentFormData,
  receivedById?: string
) {
  try {
    const validated = paymentSchema.parse(paymentData);

    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      return { success: false, error: "Venta no encontrada." };
    }

    if (sale.balanceDue <= 0) {
      return { success: false, error: "Esta venta ya no tiene saldo pendiente." };
    }

    const payAmount = round2(validated.amount);
    const newPaidAmount = round2(sale.paidAmount + payAmount);
    const newBalanceDue = round2(Math.max(0, sale.totalAmount - newPaidAmount));
    const newStatus = newBalanceDue <= 0 ? "COMPLETED" : "PARTIAL";

    const payment = await prisma.payment.create({
      data: {
        saleId,
        amount: payAmount,
        paymentMethod: validated.paymentMethod,
        paymentType: newBalanceDue <= 0 ? "BALANCE_SETTLEMENT" : "ADVANCE_DEPOSIT",
        referenceNumber: validated.referenceNumber || null,
        notes: validated.notes || "Abono / Cancelación de saldo",
        receivedById: receivedById || null,
      },
    });

    const updatedSale = await prisma.sale.update({
      where: { id: saleId },
      data: {
        paidAmount: newPaidAmount,
        balanceDue: newBalanceDue,
        status: newStatus,
      },
      include: {
        payments: true,
      },
    });

    revalidatePath("/ventas");
    revalidatePath("/pos");
    revalidatePath("/caja");
    return { success: true, data: { sale: updatedSale, payment } };
  } catch (error: any) {
    console.error("Error al registrar pago de saldo:", error);
    return {
      success: false,
      error: error.message || "No se pudo registrar el abono al saldo.",
    };
  }
}
