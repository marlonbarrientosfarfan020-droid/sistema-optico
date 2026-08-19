"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types";

export async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { name: "asc" },
      include: {
        branch: true,
      },
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
}

export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  branchId?: string;
}) {
  try {
    const emailClean = data.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: emailClean },
    });

    if (existing) {
      return { success: false, error: `Ya existe un usuario con el correo "${emailClean}"` };
    }

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: emailClean,
        passwordHash: data.password ? data.password.trim() : "1234",
        role: data.role,
        phone: data.phone || null,
        branchId: data.branchId || null,
      },
    });

    revalidatePath("/configuracion");
    return { success: true, data: user };
  } catch (error: any) {
    console.error("Error al registrar usuario:", error);
    return { success: false, error: error.message || "No se pudo registrar el usuario." };
  }
}

export async function updatePassword(userId: string, newPassword: string) {
  try {
    if (!newPassword || newPassword.trim().length === 0) {
      return { success: false, error: "La contraseña no puede estar vacía." };
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPassword.trim(),
      },
    });

    revalidatePath("/configuracion");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error al actualizar contraseña:", error);
    return { success: false, error: error.message || "No se pudo actualizar la contraseña." };
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/configuracion");
    return { success: true };
  } catch (error: any) {
    console.error("Error al eliminar usuario:", error);
    return { success: false, error: error.message || "No se pudo eliminar el usuario." };
  }
}
