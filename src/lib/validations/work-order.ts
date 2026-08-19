import { z } from "zod";

export const workOrderSchema = z.object({
  patientId: z.string().min(1, "El paciente es obligatorio"),
  saleId: z.string().optional().or(z.literal("")),
  prescriptionId: z.string().optional().or(z.literal("")),
  branchId: z.string().optional().or(z.literal("")),
  labTechnicianId: z.string().optional().or(z.literal("")),
  externalLabName: z.string().optional().or(z.literal("")),

  status: z.enum([
    "PENDING",
    "IN_LAB",
    "LAB_COMPLETED",
    "READY_FOR_PICKUP",
    "DELIVERED",
    "CANCELLED",
  ]).default("PENDING"),

  frameSource: z.enum(["STORE_INVENTORY", "CUSTOMER_OWN_FRAME"]).default("STORE_INVENTORY"),
  frameProductId: z.string().optional().or(z.literal("")),
  customFrameDetails: z.string().optional().or(z.literal("")),

  lensProductId: z.string().optional().or(z.literal("")),
  customLensDetails: z.string().optional().or(z.literal("")),
  treatments: z.array(z.string()).default([]),
  bevelType: z.enum(["CLASSIC_BEVEL", "GROOVED_RIMLESS", "DRILLED_RIMLESS", "FLAT"]).default("CLASSIC_BEVEL"),

  promisedDate: z.string().optional().or(z.literal("")),
  instructions: z.string().optional().or(z.literal("")),
  qualityCheckPassed: z.boolean().default(false),
  qualityNotes: z.string().optional().or(z.literal("")),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;
