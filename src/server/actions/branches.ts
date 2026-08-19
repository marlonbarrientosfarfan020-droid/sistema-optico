"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getBranches() {
  try {
    return await prisma.branch.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
            products: true,
            sales: true,
            workOrders: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener sucursales:", error);
    return [];
  }
}

export async function createBranch(data: {
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
}) {
  try {
    const existing = await prisma.branch.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      return { success: false, error: `Ya existe una sede con el código "${data.code}"` };
    }

    const branch = await prisma.branch.create({
      data: {
        name: data.name.trim(),
        code: data.code.trim().toUpperCase(),
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
      },
    });

    revalidatePath("/sucursales");
    return { success: true, data: branch };
  } catch (error: any) {
    console.error("Error al crear sucursal:", error);
    return { success: false, error: error.message || "No se pudo registrar la sucursal." };
  }
}
