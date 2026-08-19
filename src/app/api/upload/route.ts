import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No se proporcionó ningún archivo de imagen." },
        { status: 400 }
      );
    }

    // Validate mime type
    const validMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/gif",
      "image/svg+xml",
    ];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Formato no válido. Usa PNG, JPG o WEBP." },
        { status: 400 }
      );
    }

    // Size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "La imagen no debe superar los 5 MB." },
        { status: 400 }
      );
    }

    // Generate safe unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const cleanName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const filename = `products/prod-${Date.now()}-${cleanName}.${ext}`;

    // Upload directly to Vercel Blob
    const token =
      process.env.BLOB_READ_WRITE_TOKEN ||
      "vercel_blob_rw_c3wpKUktzGlb2k4t_mbKsNtnxB7GXoF04mnXjcq7iRcBR8H";

    const blob = await put(filename, file, {
      access: "public",
      token: token,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: blob.pathname,
    });
  } catch (error: any) {
    console.error("Error al subir imagen a Vercel Blob:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al procesar la subida a Vercel Blob." },
      { status: 500 }
    );
  }
}
