import { z } from "zod";

export const patientSchema = z.object({
  documentType: z.enum(["DNI", "CE", "PASSPORT", "RUC", "OTHER"], {
    required_error: "Selecciona el tipo de documento",
  }),
  documentId: z
    .string()
    .min(3, "El número de documento debe tener al menos 3 caracteres")
    .max(20, "El número de documento no puede exceder 20 caracteres"),
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  lastName: z
    .string()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(100, "Los apellidos son demasiado largos"),
  email: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
  phone: z.string().min(6, "Número de teléfono inválido").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  birthDate: z.string().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).default("PREFER_NOT_TO_SAY"),
  occupation: z.string().optional().or(z.literal("")),
  branchId: z.string().optional(),
  medicalHistory: z
    .object({
      hasDiabetes: z.boolean().default(false),
      hasHypertension: z.boolean().default(false),
      hasGlaucoma: z.boolean().default(false),
      hasCataracts: z.boolean().default(false),
      allergies: z.string().optional().default(""),
      familyHistory: z.string().optional().default(""),
      notes: z.string().optional().default(""),
    })
    .optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
