"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { productSchema, ProductFormData } from "@/lib/validations/product";
import { ProductCategory } from "@/types";

export async function getProducts(category?: ProductCategory, query?: string) {
  try {
    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { sku: { contains: query, mode: "insensitive" } },
        { barcode: { contains: query, mode: "insensitive" } },
        { frameModel: { contains: query, mode: "insensitive" } },
        { frameColor: { contains: query, mode: "insensitive" } },
      ];
    }

    return await prisma.product.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        categoryRef: true,
        brandRef: true,
      },
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

export async function getPublicCatalogProducts() {
  try {
    return await prisma.product.findMany({
      where: {
        showInCatalog: true,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
      include: {
        categoryRef: true,
        brandRef: true,
      },
    });
  } catch (error) {
    console.error("Error al obtener productos del catálogo público:", error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        categoryRef: true,
        brandRef: true,
        inventoryMovements: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });
  } catch (error) {
    console.error(`Error al obtener producto ${id}:`, error);
    return null;
  }
}

export async function createProduct(data: ProductFormData) {
  try {
    const validated = productSchema.parse(data);

    // Check SKU duplicate
    const existing = await prisma.product.findUnique({
      where: { sku: validated.sku },
    });

    if (existing) {
      return {
        success: false,
        error: `Ya existe un producto con el SKU "${validated.sku}".`,
      };
    }

    const product = await prisma.product.create({
      data: {
        sku: validated.sku.trim().toUpperCase(),
        barcode: validated.barcode || null,
        name: validated.name.trim(),
        description: validated.description || null,
        category: validated.category,
        categoryId: validated.categoryId || null,
        brandId: validated.brandId || null,
        branchId: validated.branchId || null,
        imageUrl: validated.imageUrl || null,
        showInCatalog: validated.showInCatalog ?? true,

        frameModel: validated.frameModel || null,
        frameColor: validated.frameColor || null,
        frameMaterial: validated.frameMaterial || null,
        frameEyeSize: validated.frameEyeSize || null,
        frameBridge: validated.frameBridge || null,
        frameTemple: validated.frameTemple || null,

        baseCurve: validated.baseCurve || null,
        diameter: validated.diameter || null,
        sphereRange: validated.sphereRange || null,

        costPrice: validated.costPrice,
        salePrice: validated.salePrice,
        stock: validated.stock,
        minStock: validated.minStock,
        isActive: validated.isActive,

        inventoryMovements: {
          create: {
            type: "INITIAL",
            quantity: validated.stock,
            previousStock: 0,
            newStock: validated.stock,
            reason: "Inventario inicial",
          },
        },
      },
    });

    revalidatePath("/inventario");
    revalidatePath("/pos");
    revalidatePath("/catalogo");
    return { success: true, data: product };
  } catch (error: any) {
    console.error("Error al crear producto:", error);
    return {
      success: false,
      error: error.message || "No se pudo registrar el producto en el catálogo.",
    };
  }
}

export async function updateProduct(id: string, data: Partial<ProductFormData>) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        sku: data.sku ? data.sku.trim().toUpperCase() : undefined,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : undefined,
        showInCatalog: data.showInCatalog !== undefined ? data.showInCatalog : undefined,
      },
    });

    revalidatePath("/inventario");
    revalidatePath("/pos");
    revalidatePath("/catalogo");
    return { success: true, data: product };
  } catch (error: any) {
    console.error("Error al actualizar producto:", error);
    return {
      success: false,
      error: error.message || "No se pudo actualizar el producto.",
    };
  }
}
