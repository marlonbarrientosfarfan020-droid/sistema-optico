import { z } from "zod";

export const saleItemSchema = z.object({
  productId: z.string().optional().nullable(),
  description: z.string().min(1, "La descripción del ítem es requerida"),
  quantity: z.coerce.number().int().min(1, "La cantidad mínima es 1").default(1),
  unitPrice: z.coerce.number().min(0, "El precio unitario no puede ser negativo"),
  discount: z.coerce.number().min(0).default(0),
  total: z.coerce.number().min(0),
});

export const paymentSchema = z.object({
  amount: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
  paymentMethod: z.enum([
    "CASH",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "BANK_TRANSFER",
    "YAPE_PLIN",
    "OTHER",
  ]),
  paymentType: z.enum(["FULL_PAYMENT", "ADVANCE_DEPOSIT", "BALANCE_SETTLEMENT"]).default("FULL_PAYMENT"),
  referenceNumber: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const saleSchema = z.object({
  patientId: z.string().min(1, "Selecciona o registra un paciente"),
  branchId: z.string().optional(),
  prescriptionId: z.string().optional().nullable(),
  items: z.array(saleItemSchema).min(1, "Debes agregar al menos un producto o servicio"),
  subtotal: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
  tax: z.coerce.number().min(0).default(0),
  totalAmount: z.coerce.number().min(0),
  initialPayment: paymentSchema.optional().nullable(),
  notes: z.string().optional().or(z.literal("")),
});

export type SaleItemFormData = z.infer<typeof saleItemSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type SaleFormData = z.infer<typeof saleSchema>;
