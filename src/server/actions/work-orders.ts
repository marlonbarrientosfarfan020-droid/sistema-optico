"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { workOrderSchema, WorkOrderFormData } from "@/lib/validations/work-order";
import { OrderStatus, BevelType, FrameSource, LensType, LensMaterial } from "@/types";

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
    revalidatePath("/");
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

export interface DirectWorkOrderInput {
  patientId: string;
  odSphere?: number | null;
  odCylinder?: number | null;
  odAxis?: number | null;
  odAddition?: number | null;
  npdFarOD?: number | null;
  pupilHeightOD?: number | null;

  osSphere?: number | null;
  osCylinder?: number | null;
  osAxis?: number | null;
  osAddition?: number | null;
  npdFarOS?: number | null;
  pupilHeightOS?: number | null;

  lensType?: string;
  lensMaterial?: string;
  treatments?: string[];
  bevelType?: BevelType;

  frameSource?: FrameSource;
  frameProductId?: string | null;
  customFrameDetails?: string | null;

  promisedDate?: string | null;
  instructions?: string | null;
}

export async function createDirectWorkOrder(input: DirectWorkOrderInput) {
  try {
    if (!input.patientId) {
      return { success: false, error: "Seleccione un paciente para la orden de taller." };
    }

    const currentYear = new Date().getFullYear();

    // 1. Create prescription if any diopter or lens data is entered
    let prescriptionId: string | null = null;
    const hasDiopters =
      input.odSphere !== undefined ||
      input.odCylinder !== undefined ||
      input.osSphere !== undefined ||
      input.osCylinder !== undefined ||
      input.lensType;

    if (hasDiopters) {
      const rxCount = await prisma.prescription.count();
      const code = `REC-${currentYear}-${String(rxCount + 1).padStart(4, "0")}`;

      const rx = await prisma.prescription.create({
        data: {
          code,
          patientId: input.patientId,
          odSphere: input.odSphere ?? null,
          odCylinder: input.odCylinder ?? null,
          odAxis: input.odAxis ? Math.round(input.odAxis) : null,
          odAddition: input.odAddition ?? null,
          npdFarOD: input.npdFarOD ?? null,
          pupilHeightOD: input.pupilHeightOD ?? null,

          osSphere: input.osSphere ?? null,
          osCylinder: input.osCylinder ?? null,
          osAxis: input.osAxis ? Math.round(input.osAxis) : null,
          osAddition: input.osAddition ?? null,
          npdFarOS: input.npdFarOS ?? null,
          pupilHeightOS: input.pupilHeightOS ?? null,

          lensType: (input.lensType as LensType) || "MONOFOCAL",
          lensMaterial: (input.lensMaterial as LensMaterial) || "ORGANIC_CR39",
          treatments: input.treatments || [],
          notes: input.instructions || "Receta generada directamente para taller",
        },
      });
      prescriptionId = rx.id;
    }

    // 2. Generate consecutive OT Number: OT-YYYY-XXXX
    const count = await prisma.workOrder.count();
    const orderNumber = `OT-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    const customLensDetails = `${input.lensType || "Monofocal"} ${input.lensMaterial || "Orgánico CR-39"}${
      input.treatments && input.treatments.length > 0 ? ` (${input.treatments.join(", ")})` : ""
    }`;

    const workOrder = await prisma.workOrder.create({
      data: {
        orderNumber,
        patientId: input.patientId,
        prescriptionId,
        status: "PENDING",
        frameSource: input.frameSource || "STORE_INVENTORY",
        frameProductId: input.frameProductId || null,
        customFrameDetails: input.customFrameDetails || null,
        customLensDetails,
        treatments: input.treatments || [],
        bevelType: input.bevelType || "CLASSIC_BEVEL",
        promisedDate: input.promisedDate ? new Date(input.promisedDate) : null,
        instructions: input.instructions || null,

        history: {
          create: {
            fromStatus: "PENDING",
            toStatus: "PENDING",
            notes: "Orden de taller creada manualmente con graduación técnica",
          },
        },
      },
      include: {
        patient: true,
        prescription: true,
        frameProduct: true,
      },
    });

    revalidatePath("/laboratorio");
    revalidatePath("/");
    revalidatePath("/catalogo");
    return { success: true, data: workOrder };
  } catch (error: any) {
    console.error("Error al crear orden de taller directa:", error);
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
        completionDate: newStatus === "LAB_COMPLETED" || newStatus === "READY_FOR_PICKUP" ? new Date() : undefined,
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
      include: {
        patient: true,
        prescription: true,
        frameProduct: true,
      },
    });

    revalidatePath("/laboratorio");
    revalidatePath("/");
    revalidatePath(`/laboratorio/${workOrderId}`);
    revalidatePath("/catalogo");
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
