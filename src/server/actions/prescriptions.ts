"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { prescriptionSchema, PrescriptionFormData } from "@/lib/validations/prescription";

export async function getPrescriptions(patientId?: string) {
  try {
    const where = patientId ? { patientId } : {};
    return await prisma.prescription.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        patient: true,
        optometrist: true,
        workOrders: true,
      },
    });
  } catch (error) {
    console.error("Error al obtener recetas:", error);
    return [];
  }
}

export async function getPrescriptionById(id: string) {
  try {
    return await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: true,
        optometrist: true,
        branch: true,
        workOrders: {
          include: {
            history: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(`Error al obtener receta ${id}:`, error);
    return null;
  }
}

export async function createPrescription(data: PrescriptionFormData) {
  try {
    const validated = prescriptionSchema.parse(data);

    // Generate unique code REC-YYYY-XXXX
    const count = await prisma.prescription.count();
    const currentYear = new Date().getFullYear();
    const code = `REC-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    const prescription = await prisma.prescription.create({
      data: {
        code,
        patientId: validated.patientId,
        optometristId: validated.optometristId || null,
        branchId: validated.branchId || null,
        date: validated.date ? new Date(validated.date) : new Date(),

        // OD
        odSphere: validated.odSphere ?? null,
        odCylinder: validated.odCylinder ?? null,
        odAxis: validated.odAxis ?? null,
        odAddition: validated.odAddition ?? null,
        odPrism: validated.odPrism ?? null,
        odBase: validated.odBase ?? null,
        odVisualAcuityFar: validated.odVisualAcuityFar ?? null,
        odVisualAcuityNear: validated.odVisualAcuityNear ?? null,

        // OI
        osSphere: validated.osSphere ?? null,
        osCylinder: validated.osCylinder ?? null,
        osAxis: validated.osAxis ?? null,
        osAddition: validated.osAddition ?? null,
        osPrism: validated.osPrism ?? null,
        osBase: validated.osBase ?? null,
        osVisualAcuityFar: validated.osVisualAcuityFar ?? null,
        osVisualAcuityNear: validated.osVisualAcuityNear ?? null,

        // Pupillary
        pupillaryDistance: validated.pupillaryDistance ?? null,
        npdFarOD: validated.npdFarOD ?? null,
        npdFarOS: validated.npdFarOS ?? null,
        npdNearOD: validated.npdNearOD ?? null,
        npdNearOS: validated.npdNearOS ?? null,
        pupilHeightOD: validated.pupilHeightOD ?? null,
        pupilHeightOS: validated.pupilHeightOS ?? null,

        // Lens
        lensType: validated.lensType ?? null,
        lensMaterial: validated.lensMaterial ?? null,
        treatments: validated.treatments ?? [],
        usage: validated.usage ?? null,
        notes: validated.notes ?? null,
        expirationDate: validated.expirationDate
          ? new Date(validated.expirationDate)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
      },
    });

    revalidatePath("/recetas");
    revalidatePath(`/pacientes/${validated.patientId}`);
    return { success: true, data: prescription };
  } catch (error: any) {
    console.error("Error al registrar receta optométrica:", error);
    return {
      success: false,
      error: error.message || "No se pudo guardar la receta optométrica.",
    };
  }
}
