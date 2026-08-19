import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OptiCore PRO | Catálogo Exclusivo de Monturas & Rastreo de Taller",
  description:
    "Colección 2026 de monturas oftálmicas de diseñador, lentes de sol polarizados, cristales con filtro BlueBlock UV400 y consulta en vivo del estado de tu orden en taller.",
  keywords: [
    "óptica",
    "monturas oftálmicas",
    "lentes de sol",
    "cristales blueblock",
    "ray-ban",
    "oakley",
    "taller óptico",
    "consulta de orden",
    "lima",
    "miraflores",
  ],
  authors: [{ name: "OptiCore PRO" }],
  openGraph: {
    title: "OptiCore PRO | Catálogo Exclusivo de Monturas & Rastreo de Taller",
    description:
      "Descubre monturas de alta gama, cristales digitales de precisión y rastrea tu pedido de laboratorio en tiempo real.",
    url: "https://opticore.com/catalogo",
    siteName: "OptiCore PRO",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "OptiCore Catálogo de Lentes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OptiCore PRO | Catálogo de Monturas & Rastreo de Taller",
    description:
      "Colección 2026 de monturas oftálmicas y rastreo de biselado en tiempo real.",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&auto=format&fit=crop&q=80",
    ],
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {children}
    </div>
  );
}
