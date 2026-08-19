export const metadata = {
  title: "OptiCore | Catálogo de Monturas, Lentes y Rastreo de Taller",
  description: "Descubre la colección de monturas exclusivas, cristales con filtro Blue Defense y rastrea el avance de tu orden de laboratorio en tiempo real.",
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
