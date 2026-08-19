"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type PaymentWithSale = {
  id: string;
  amount: any;
  paymentMethod: string;
  createdAt: Date;
  sale: {
    id: string;
    totalAmount: any;
    paidAmount: any;
    balanceAmount: any;
    status: string;
    patient?: {
      id: string;
      firstName: string;
      lastName: string;
      documentId?: string;
    } | null;
  };
};

export interface TodayCashSummary {
  payments: PaymentWithSale[];
  cashIncome: number;
  cardIncome: number;
  digitalIncome: number;
  transferIncome: number;
  otherIncome: number;
  totalIncome: number;
}

export async function getCurrentCashSession() {
  try {
    return await prisma.cashRegisterSession.findFirst({
      where: { status: "OPEN" },
      orderBy: { openedAt: "desc" },
      include: {
        user: true,
        branch: true,
      },
    });
  } catch (error) {
    console.error("Error al obtener sesión de caja actual:", error);
    return null;
  }
}

export async function getTodayCashSummary(): Promise<TodayCashSummary> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const payments = await prisma.payment.findMany({
      where: {
        createdAt: { gte: today },
      },
      include: {
        sale: {
          include: { patient: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const cashIncome = payments
      .filter((p: any) => p.paymentMethod === "CASH")
      .reduce((sum: number, p: any) => sum + Number(p.amount ?? 0), 0);

    const cardIncome = payments
      .filter((p: any) => p.paymentMethod === "CREDIT_CARD" || p.paymentMethod === "DEBIT_CARD")
      .reduce((sum: number, p: any) => sum + Number(p.amount ?? 0), 0);

    const digitalIncome = payments
      .filter((p: any) => p.paymentMethod === "YAPE_PLIN")
      .reduce((sum: number, p: any) => sum + Number(p.amount ?? 0), 0);

    const transferIncome = payments
      .filter((p: any) => p.paymentMethod === "BANK_TRANSFER")
      .reduce((sum: number, p: any) => sum + Number(p.amount ?? 0), 0);

    const otherIncome = payments
      .filter((p: any) => p.paymentMethod === "OTHER")
      .reduce((sum: number, p: any) => sum + Number(p.amount ?? 0), 0);

    const totalIncome = payments.reduce(
      (sum: number, p: any) => sum + Number(p.amount ?? 0),
      0
    );

    return {
      payments: payments as unknown as PaymentWithSale[],
      cashIncome,
      cardIncome,
      digitalIncome,
      transferIncome,
      otherIncome,
      totalIncome,
    };
  } catch (error) {
    console.error("Error al calcular resumen de caja:", error);
    return {
      payments: [],
      cashIncome: 0,
      cardIncome: 0,
      digitalIncome: 0,
      transferIncome: 0,
      otherIncome: 0,
      totalIncome: 0,
    };
  }
}

export async function openCashSession(data: {
  openingAmount: number;
  userId?: string;
  branchId?: string;
  notes?: string;
}) {
  try {
    const existing = await prisma.cashRegisterSession.findFirst({
      where: { status: "OPEN" },
    });

    if (existing) {
      return { success: false, error: "Ya existe una sesión de caja abierta actualmente." };
    }

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Administrador Óptica",
          email: "admin@opticacore.com",
          passwordHash: "admin123",
          role: "ADMIN",
        },
      });
    }

    const session = await prisma.cashRegisterSession.create({
      data: {
        userId: data.userId || user.id,
        branchId: data.branchId || null,
        openingAmount: data.openingAmount,
        notes: data.notes || "Apertura de turno de caja",
        status: "OPEN",
      },
    });

    revalidatePath("/caja");
    return { success: true, data: session };
  } catch (error: any) {
    console.error("Error al abrir caja:", error);
    return { success: false, error: error.message || "No se pudo abrir la caja." };
  }
}

export async function closeCashSession(data: {
  sessionId: string;
  actualClosingAmount: number;
  expectedClosingAmount: number;
  notes?: string;
}) {
  try {
    const session = await prisma.cashRegisterSession.update({
      where: { id: data.sessionId },
      data: {
        status: "CLOSED",
        closingAmount: data.actualClosingAmount,
        actualClosingAmount: data.actualClosingAmount,
        expectedClosingAmount: data.expectedClosingAmount,
        closedAt: new Date(),
        notes: data.notes || null,
      },
    });

    revalidatePath("/caja");
    return { success: true, data: session };
  } catch (error: any) {
    console.error("Error al cerrar caja:", error);
    return { success: false, error: error.message || "No se pudo cerrar la caja." };
  }
}