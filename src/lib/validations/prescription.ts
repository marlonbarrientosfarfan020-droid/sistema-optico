import { z } from "zod";

export const prescriptionSchema = z.object({
  patientId: z.string().min(1, "El paciente es requerido"),
  optometristId: z.string().optional(),
  branchId: z.string().optional(),
  date: z.string().optional(),

  // Ojo Derecho (OD)
  odSphere: z.coerce.number().min(-30).max(30).optional().nullable(),
  odCylinder: z.coerce.number().min(-15).max(15).optional().nullable(),
  odAxis: z.coerce.number().int().min(0).max(180).optional().nullable(),
  odAddition: z.coerce.number().min(0).max(6).optional().nullable(),
  odPrism: z.coerce.number().optional().nullable(),
  odBase: z.string().optional().nullable(),
  odVisualAcuityFar: z.string().optional().nullable(),
  odVisualAcuityNear: z.string().optional().nullable(),

  // Ojo Izquierdo (OI)
  osSphere: z.coerce.number().min(-30).max(30).optional().nullable(),
  osCylinder: z.coerce.number().min(-15).max(15).optional().nullable(),
  osAxis: z.coerce.number().int().min(0).max(180).optional().nullable(),
  osAddition: z.coerce.number().min(0).max(6).optional().nullable(),
  osPrism: z.coerce.number().optional().nullable(),
  osBase: z.string().optional().nullable(),
  osVisualAcuityFar: z.string().optional().nullable(),
  osVisualAcuityNear: z.string().optional().nullable(),

  // Medidas y Centrado
  pupillaryDistance: z.coerce.number().min(40).max(85).optional().nullable(),
  npdFarOD: z.coerce.number().min(20).max(45).optional().nullable(),
  npdFarOS: z.coerce.number().min(20).max(45).optional().nullable(),
  npdNearOD: z.coerce.number().min(18).max(42).optional().nullable(),
  npdNearOS: z.coerce.number().min(18).max(42).optional().nullable(),
  pupilHeightOD: z.coerce.number().min(10).max(40).optional().nullable(),
  pupilHeightOS: z.coerce.number().min(10).max(40).optional().nullable(),

  // Recomendación
  lensType: z.enum(["MONOFOCAL", "BIFOCAL", "PROGRESSIVE", "OCCUPATIONAL", "CONTACT_LENS", "OTHER"]).optional().nullable(),
  lensMaterial: z.enum([
    "ORGANIC_CR39",
    "POLYCARBONATE",
    "HIGH_INDEX_1_60",
    "HIGH_INDEX_1_67",
    "HIGH_INDEX_1_74",
    "MINERAL_GLASS",
    "TRIVEX",
    "SILICONE_HYDROGEL"
  ]).optional().nullable(),
  treatments: z.array(z.string()).default([]),
  usage: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  expirationDate: z.string().optional().nullable(),
});

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;
