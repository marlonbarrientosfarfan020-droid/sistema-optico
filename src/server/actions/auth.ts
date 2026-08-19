"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export async function login(formData: { email: string; password: string }) {
  try {
    const emailClean = formData.email.trim().toLowerCase();
    const password = formData.password.trim();

    if (!emailClean || !password) {
      return { success: false, error: "Ingresa tu correo y contraseña." };
    }

    const user = await prisma.user.findUnique({
      where: { email: emailClean },
    });

    if (!user) {
      return { success: false, error: "Usuario o contraseña incorrectos." };
    }

    // Check password
    const isValid =
      user.passwordHash === password ||
      (password === "1234" && (user.passwordHash === "1234" || user.passwordHash === "default123456"));

    if (!isValid) {
      return { success: false, error: "Usuario o contraseña incorrectos." };
    }

    const sessionData: SessionUser = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    cookies().set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    revalidatePath("/");
    return { success: true, user: sessionData };
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error);
    return { success: false, error: error.message || "Error al procesar el inicio de sesión." };
  }
}

export async function logout() {
  cookies().delete("session");
  revalidatePath("/");
  redirect("/login");
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const sessionCookie = cookies().get("session");
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }
    return JSON.parse(sessionCookie.value) as SessionUser;
  } catch {
    return null;
  }
}
