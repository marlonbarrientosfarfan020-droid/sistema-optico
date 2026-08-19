"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { patientSchema, PatientFormData } from "@/lib/validations/patient";

export async function getPatients(query?: string) {
  try {
    const where = query
      ? {
          OR: [
            { firstName: { contains: query, mode: "insensitive" as const } },
            { lastName: { contains: query, mode: "insensitive" as const } },
            { documentId: { contains: query, mode: "insensitive" as const } },
            { phone: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {};

    return await prisma.patient.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            prescriptions: true,
            sales: true,
            workOrders: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    return [];
  }
}

export async function getPatientById(id: string) {
  try {
    return await prisma.patient.findUnique({
      where: { id },
      include: {
        prescriptions: {
          orderBy: { date: "desc" },
          include: { optometrist: true },
        },
        sales: {
          orderBy: { createdAt: "desc" },
          include: {
            items: true,
            payments: true,
            workOrders: true,
          },
        },
        workOrders: {
          orderBy: { createdAt: "desc" },
          include: {
            prescription: true,
            history: { orderBy: { createdAt: "desc" } },
          },
        },
      },
    });
  } catch (error) {
    console.error(`Error al obtener paciente ${id}:`, error);
    return null;
  }
}

export async function createPatient(data: PatientFormData) {
  try {
    const validated = patientSchema.parse(data);

    // Check if documentId already exists for this documentType
    const existing = await prisma.patient.findUnique({
      where: {
        documentType_documentId: {
          documentType: validated.documentType,
          documentId: validated.documentId,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        error: `Ya existe un paciente registrado con ${validated.documentType} ${validated.documentId}`,
      };
    }

    const patient = await prisma.patient.create({
      data: {
        documentType: validated.documentType,
        documentId: validated.documentId.trim(),
        firstName: validated.firstName.trim(),
        lastName: validated.lastName.trim(),
        email: validated.email || null,
        phone: validated.phone || null,
        address: validated.address || null,
        birthDate: validated.birthDate ? new Date(validated.birthDate) : null,
        gender: validated.gender,
        occupation: validated.occupation || null,
        medicalHistory: validated.medicalHistory || {},
        branchId: validated.branchId || null,
      },
    });

    revalidatePath("/pacientes");
    return { success: true, data: patient };
  } catch (error: any) {
    console.error("Error al crear paciente:", error);
    return {
      success: false,
      error: error.message || "No se pudo registrar el paciente.",
    };
  }
}
