import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "OptiCore | Sistema de Gestión Óptica y Ficha Clínica",
  description: "Software SaaS integral para Ópticas, Consultorios Optométricos, Taller de Laboratorio y Punto de Venta",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-screen bg-slate-50/50 text-slate-900 dark:bg-slate-950 dark:text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
