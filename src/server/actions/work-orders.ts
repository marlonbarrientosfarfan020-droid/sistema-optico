"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { workOrderSchema, WorkOrderFormData } from "@/lib/validations/work-order";
import { OrderStatus } from "@/types";

export async function getWorkOrders(status?: OrderStatus, patientId?: string) {
  try {
    const where: any = {};
    if (status) where.status = status;
    if (patientId) where.patientId = patientId;

    return await prisma.workOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        patient: true,
        prescription: true,
        frameProduct: true,
        lensProduct: true,
        labTechnician: true,
        history: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener órdenes de trabajo:", error);
    return [];
  }
}

export async function getWorkOrderById(id: string) {
  try {
    return await prisma.workOrder.findUnique({
      where: { id },
      include: {
        patient: true,
        prescription: {
          include: {
            optometrist: true,
          },
        },
        frameProduct: true,
        lensProduct: true,
        sale: {
          include: {
            payments: true,
          },
        },
        labTechnician: true,
        history: {
          orderBy: { createdAt: "desc" },
          include: { changedBy: true },
        },
      },
    });
  } catch (error) {
    console.error(`Error al obtener orden de trabajo ${id}:`, error);
    return null;
  }
}

export async function createWorkOrder(data: WorkOrderFormData) {
  try {
    const validated = workOrderSchema.parse(data);

    // Format: OT-YYYY-XXXX
    const count = await prisma.workOrder.count();
    const currentYear = new Date().getFullYear();
    const orderNumber = `OT-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    const workOrder = await prisma.workOrder.create({
      data: {
        orderNumber,
        patientId: validated.patientId,
        saleId: validated.saleId || null,
        prescriptionId: validated.prescriptionId || null,
        branchId: validated.branchId || null,
        labTechnicianId: validated.labTechnicianId || null,
        externalLabName: validated.externalLabName || null,
        status: validated.status || "PENDING",

        frameSource: validated.frameSource,
        frameProductId: validated.frameProductId || null,
        customFrameDetails: validated.customFrameDetails || null,

        lensProductId: validated.lensProductId || null,
        customLensDetails: validated.customLensDetails || null,
        treatments: validated.treatments ?? [],
        bevelType: validated.bevelType,

        promisedDate: validated.promisedDate ? new Date(validated.promisedDate) : null,
        instructions: validated.instructions || null,
        qualityCheckPassed: validated.qualityCheckPassed,
        qualityNotes: validated.qualityNotes || null,

        history: {
          create: {
            fromStatus: "PENDING",
            toStatus: validated.status || "PENDING",
            notes: "Orden de trabajo creada e ingresada a taller",
          },
        },
      },
    });

    revalidatePath("/laboratorio");
    revalidatePath(`/pacientes/${validated.patientId}`);
    return { success: true, data: workOrder };
  } catch (error: any) {
    console.error("Error al crear orden de trabajo:", error);
    return {
      success: false,
      error: error.message || "No se pudo generar la orden de trabajo.",
    };
  }
}

export async function updateWorkOrderStatus(
  workOrderId: string,
  newStatus: OrderStatus,
  notes?: string,
  userId?: string
) {
  try {
    const current = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
    });

    if (!current) {
      return { success: false, error: "Orden de trabajo no encontrada." };
    }

    const updated = await prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        status: newStatus,
        completionDate: newStatus === "LAB_COMPLETED" ? new Date() : undefined,
        deliveryDate: newStatus === "DELIVERED" ? new Date() : undefined,
        history: {
          create: {
            fromStatus: current.status,
            toStatus: newStatus,
            notes: notes || `Estado cambiado a ${newStatus}`,
            changedById: userId || null,
          },
        },
      },
    });

    revalidatePath("/laboratorio");
    revalidatePath(`/laboratorio/${workOrderId}`);
    return { success: true, data: updated };
  } catch (error: any) {
    console.error(`Error al actualizar estado de orden ${workOrderId}:`, error);
    return {
      success: false,
      error: error.message || "No se pudo actualizar el estado de la orden.",
    };
  }
}

export async function trackWorkOrder(query: string) {
  try {
    const q = query.trim();
    if (!q) return null;

    return await prisma.workOrder.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: q, mode: "insensitive" } },
          { patient: { documentId: { equals: q } } },
        ],
      },
      include: {
        patient: true,
        frameProduct: true,
        history: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Error al rastrear orden:", error);
    return null;
  }
}

