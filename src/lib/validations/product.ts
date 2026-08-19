import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().min(2, "El SKU debe tener al menos 2 caracteres"),
  barcode: z.string().optional().or(z.literal("")),
  name: z.string().min(2, "El nombre del producto es obligatorio"),
  description: z.string().optional().or(z.literal("")),
  category: z.enum([
    "FRAME",
    "OPHTHALMIC_LENS",
    "CONTACT_LENS",
    "ACCESSORY",
    "SOLUTION",
    "SERVICE",
  ]),
  categoryId: z.string().optional().or(z.literal("")),
  brandId: z.string().optional().or(z.literal("")),
  branchId: z.string().optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")).nullable(),
  showInCatalog: z.boolean().default(true),

  // Monturas
  frameModel: z.string().optional().or(z.literal("")),
  frameColor: z.string().optional().or(z.literal("")),
  frameMaterial: z.string().optional().or(z.literal("")),
  frameEyeSize: z.coerce.number().int().min(30).max(75).optional().nullable(),
  frameBridge: z.coerce.number().int().min(10).max(30).optional().nullable(),
  frameTemple: z.coerce.number().int().min(100).max(170).optional().nullable(),

  // Lentes de Contacto y Cristales
  baseCurve: z.coerce.number().optional().nullable(),
  diameter: z.coerce.number().optional().nullable(),
  sphereRange: z.string().optional().or(z.literal("")),

  costPrice: z.coerce.number().min(0, "El costo no puede ser negativo").default(0),
  salePrice: z.coerce.number().min(0, "El precio no puede ser negativo").default(0),
  stock: z.coerce.number().int().min(0, "El stock inicial no puede ser negativo").default(0),
  minStock: z.coerce.number().int().min(0, "El stock mínimo no puede ser negativo").default(3),
  isActive: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;
