"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Glasses,
  Search,
  Sparkles,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Wrench,
  Package,
  MessageCircle,
  ArrowRight,
  Sun,
  Shield,
  Layers,
  ChevronRight,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { trackWorkOrder } from "@/server/actions/work-orders";
import { getPublicCatalogProducts } from "@/server/actions/inventory";

// Curated Showcase Products (Fallback / Initial)
const INITIAL_CURATED_FRAMES = [
  {
    id: "prod-1",
    sku: "FRM-RB5154",
    name: "Ray-Ban Clubmaster Classic",
    brand: "Ray-Ban",
    category: "FRAME",
    faceShape: "OVALADO / CUADRADO",
    style: "Clubmaster",
    material: "Acetato & Metal Dorado",
    measurements: "51□21-145",
    color: "Negro Brillante / Oro",
    price: 349,
    originalPrice: 420,
    isNew: true,
    tag: "Más Vendido",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-2",
    sku: "FRM-OAK-PITCH",
    name: "Oakley Pitchman R Satin",
    brand: "Oakley",
    category: "FRAME",
    faceShape: "REDONDO / CORAZÓN",
    style: "Redonda Clásica",
    material: "O-Matter & Acero Inoxidable",
    measurements: "50□19-140",
    color: "Satin Black / Gris Mate",
    price: 389,
    originalPrice: 450,
    isNew: true,
    tag: "Ultra Ligero",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-3",
    sku: "FRM-GUCCI-CAT",
    name: "Gucci Glamour Cat-Eye",
    brand: "Gucci",
    category: "FRAME",
    faceShape: "CORAZÓN / DIAMANTE",
    style: "Cat Eye",
    material: "Acetato Italiano Biselado",
    measurements: "53□17-140",
    color: "Carey Havana / Oro",
    price: 490,
    originalPrice: 560,
    isNew: false,
    tag: "Colección Mujer",
    imageUrl: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-4",
    sku: "FRM-SILH-TITAN",
    name: "Silhouette Minimal Titan Al Aire",
    brand: "Silhouette",
    category: "FRAME",
    faceShape: "TODOS LOS ROSTROS",
    style: "Al Aire / Sin Marco",
    material: "Titanio Aeroespacial High-Flex",
    measurements: "52□18-145",
    color: "Plata Titanio / Azul Cristal",
    price: 520,
    originalPrice: 610,
    isNew: true,
    tag: "Sin Montura",
    imageUrl: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-5",
    sku: "SUN-PERSOL-714",
    name: "Persol 714 Plegable Polarized",
    brand: "Persol",
    category: "SUNGLASSES",
    faceShape: "OVALADO / RECTANGULAR",
    style: "Aviador Plegable",
    material: "Acetato de Celulosa Hecho a Mano",
    measurements: "54□21-140",
    color: "Havana Oscuro / Cristal Verde Polarizado",
    price: 460,
    originalPrice: 530,
    isNew: false,
    tag: "Lente de Sol",
    imageUrl: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-6",
    sku: "FRM-TR90-SPORT",
    name: "OptiCore Active Pro TR-90",
    brand: "OptiCore Lab",
    category: "FRAME",
    faceShape: "CUADRADO / OVALADO",
    style: "Deportivo Rectangular",
    material: "TR-90 Grilamid Anti-Impacto",
    measurements: "55□17-142",
    color: "Azul Marino / Terminales Goma",
    price: 240,
    originalPrice: 290,
    isNew: true,
    tag: "Anti-Caídas",
    imageUrl: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&auto=format&fit=crop&q=80",
  },
];

export default function CatalogoPublicoPage() {
  const [productsList, setProductsList] = useState<any[]>(INITIAL_CURATED_FRAMES);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("TODAS");
  const [selectedShape, setSelectedShape] = useState("TODAS");
  const [searchFilter, setSearchFilter] = useState("");

  // Tracking state
  const [trackingQuery, setTrackingQuery] = useState("");
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [isSearchingTrack, setIsSearchingTrack] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Fetch real synchronized products from Database
  useEffect(() => {
    async function loadProducts() {
      try {
        const dbProducts = await getPublicCatalogProducts();
        if (dbProducts && dbProducts.length > 0) {
          const mappedDbProducts = dbProducts.map((p: any) => ({
            id: p.id,
            sku: p.sku,
            name: p.name,
            brand: p.brandRef?.name || (p.name.split(" ")[0] || "OptiCore"),
            category: p.category === "FRAME" ? "FRAME" : "SUNGLASSES",
            faceShape: "TODOS LOS ROSTROS",
            style: p.frameModel || "Estándar",
            material: p.frameMaterial || "Acetato Premium",
            measurements: `${p.frameEyeSize || 52}□${p.frameBridge || 18}-${p.frameTemple || 140}`,
            color: p.frameColor || "Variado",
            price: Number(p.salePrice),
            originalPrice: Number(p.salePrice) * 1.2,
            isNew: true,
            tag: p.category === "FRAME" ? "Oftálmico" : "Destacado",
            imageUrl:
              p.imageUrl ||
              "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
          }));
          // Merge with initial showcases
          setProductsList([...mappedDbProducts, ...INITIAL_CURATED_FRAMES]);
        }
      } catch (err) {
        console.error("Error al cargar productos públicos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = productsList.filter((item) => {
    const matchCategory =
      selectedCategory === "TODAS" ||
      (selectedCategory === "OFTALMICAS" && item.category === "FRAME") ||
      (selectedCategory === "SOL" && item.category === "SUNGLASSES");

    const matchShape =
      selectedShape === "TODAS" ||
      item.style.toLowerCase().includes(selectedShape.toLowerCase()) ||
      item.faceShape.toLowerCase().includes(selectedShape.toLowerCase());

    const matchQuery =
      searchFilter === "" ||
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.color.toLowerCase().includes(searchFilter.toLowerCase());

    return matchCategory && matchShape && matchQuery;
  });

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;

    setIsSearchingTrack(true);
    setTrackError(null);
    setTrackingResult(null);

    const res = await trackWorkOrder(trackingQuery);
    setIsSearchingTrack(false);

    if (res) {
      setTrackingResult(res);
    } else {
      setTrackError("No se encontró ninguna orden con ese DNI o Código de Trabajo.");
    }
  };

  const getWhatsAppLink = (productName: string, sku: string, price: number) => {
    const phone = "51987654321";
    const text = encodeURIComponent(
      `¡Hola OptiCore! Me interesa la montura ${productName} (SKU: ${sku}) con precio de ${formatCurrency(price)}. ¿Tienen stock disponible y opción de graduar con lunas BlueBlock?`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Header Flotante Glassmorphism */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between px-5 py-3 rounded-2xl backdrop-blur-xl bg-slate-900/80 border border-slate-800/80 shadow-2xl">
          <Link href="/catalogo" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                OptiCore <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">PRO</span>
              </span>
              <p className="text-[10px] text-slate-400">Óptica & Ficha Clínica</p>
            </div>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#catalogo" className="hover:text-blue-400 transition-colors">
              Catálogo 2026
            </a>
            <a href="#tecnologia" className="hover:text-blue-400 transition-colors">
              Cristales BlueBlock
            </a>
            <a href="#rastreo" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Rastrear mis Lentes
            </a>
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://wa.me/51987654321?text=Hola%20OptiCore,%20deseo%20agendar%20un%20examen%20de%20la%20vista"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp Citas</span>
            </a>

            <Link href="/login">
              <Button size="sm" variant="outline" className="rounded-xl border-slate-700 text-xs text-slate-300 hover:text-white hover:bg-slate-800 gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Personal</span>
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. Hero Section de Alto Impacto Visual */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-4 lg:pt-12">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Badges */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-spin" style={{ animationDuration: "6s" }} />
              Colección 2026 • Sincronizada con Taller Propio
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Visión Perfecta con{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
                Estilo Único.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 font-normal">
              Monturas oftálmicas de diseñador, titanio ultraligero y cristales de alta precisión tallados digitalmente en nuestro taller propio.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#catalogo"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 hover:scale-105 transition-all"
              >
                Explorar Catálogo <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#rastreo"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:border-cyan-500/50"
              >
                <Clock className="h-4 w-4 text-cyan-400" /> Rastrear Mi Trabajo de Taller
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-extrabold text-white">+2,500</p>
                <p className="text-xs text-slate-500">Pacientes Felices</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-extrabold text-white">24h</p>
                <p className="text-xs text-slate-500">Biselado Rápido</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-extrabold text-white">100%</p>
                <p className="text-xs text-slate-500">Garantía Óptica</p>
              </div>
            </div>
          </div>

          {/* Right Floating Glasses Showcase (5 cols) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="relative w-full max-w-md"
            >
              {/* Glow Behind */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-cyan-500/30 rounded-3xl blur-2xl transform rotate-6" />

              <div className="relative rounded-3xl border border-slate-700/60 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-2xl backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-600 text-white font-bold text-xs px-2.5 py-0.5">
                    Novedad 2026
                  </Badge>
                  <span className="text-xs font-mono font-semibold text-cyan-400">
                    FRM-RB5154
                  </span>
                </div>

                <div className="h-56 w-full rounded-2xl overflow-hidden bg-slate-950/60 border border-slate-800 flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
                    alt="Montura de Lujo"
                    className="h-full w-full object-cover object-center rounded-xl hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="font-bold text-base text-white">Ray-Ban Clubmaster Gold</h3>
                    <p className="text-xs text-slate-400">Acetato Italiano & Metal Grabado</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-emerald-400 font-mono">S/ 349.00</p>
                    <p className="text-[11px] text-slate-500 line-through">S/ 420.00</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Catálogo Interactivo con Filtros */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="border-blue-500/40 text-blue-400 text-xs px-3 py-1">
            Catálogo Interactivo en Vivo ({filteredProducts.length} Modelos)
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Encuentra tu Montura Ideal
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Filtra por estilo de montura, forma de rostro o busca por tu marca favorita.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Todas las Colecciones", value: "TODAS" },
                { label: "Monturas Oftálmicas", value: "OFTALMICAS" },
                { label: "Lentes de Sol", value: "SOL" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setSelectedCategory(tab.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === tab.value
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105"
                      : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar Ray-Ban, Cat Eye..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Face Shape Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 mr-2">Forma / Estilo:</span>
            {["TODAS", "Cat Eye", "Aviador", "Redonda", "Al Aire", "Clubmaster"].map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => setSelectedShape(shape)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  selectedShape === shape
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold"
                    : "bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProducts.map((prod) => (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-lg hover:shadow-2xl hover:border-slate-700 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Badge Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {prod.tag}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{prod.measurements}</span>
                </div>

                {/* Product Image */}
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-800/80 flex items-center justify-center p-2 mb-4 group-hover:border-blue-500/30 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="h-full w-full object-cover object-center rounded-xl group-hover:scale-108 transition-transform duration-500"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">{prod.brand}</span>
                    <span className="text-[11px] text-slate-400">{prod.style}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {prod.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {prod.material} • {prod.color}
                  </p>

                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        {formatCurrency(prod.price)}
                      </span>
                      {prod.originalPrice > prod.price && (
                        <span className="ml-2 text-xs text-slate-500 line-through">
                          {formatCurrency(prod.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <div className="pt-4 mt-4 border-t border-slate-800">
                  <a
                    href={getWhatsAppLink(prod.name, prod.sku, prod.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-10 rounded-xl bg-emerald-600/15 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-emerald-600/25"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Consultar por WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 5. Sección de Rastreo de Orden en Tiempo Real */}
      <section id="rastreo" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <Clock className="h-3.5 w-3.5" /> Estado del Taller en Vivo
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              ¿Dónde están tus Lentes?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Ingresa tu N° de DNI o tu Código de Orden de Trabajo (Ej: OT-2026-0001) para ver el avance del biselado.
            </p>
          </div>

          {/* Tracking Search Input */}
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ej: 72849102 o OT-2026-0001"
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                required
                className="w-full h-11 pl-10 pr-3 rounded-2xl border border-slate-700 bg-slate-950 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <Button
              type="submit"
              disabled={isSearchingTrack}
              className="h-11 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 gap-2"
            >
              {isSearchingTrack ? "Buscando..." : "Consultar Avance"}
            </Button>
          </form>

          {trackError && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center max-w-md mx-auto">
              {trackError}
            </div>
          )}

          {/* Tracking Timeline Result */}
          {trackingResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-6 border-t border-slate-800 space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-xs text-slate-500">Orden de Trabajo:</span>
                  <p className="font-mono font-bold text-base text-cyan-400">
                    {trackingResult.orderNumber}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Paciente:</span>
                  <p className="font-bold text-sm text-white">
                    {trackingResult.patient?.firstName} {trackingResult.patient?.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Estado Actual:</span>
                  <Badge className="bg-blue-600 text-white text-xs font-bold">
                    {trackingResult.status}
                  </Badge>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { step: "1. Receta", done: true, desc: "Refracción confirmada" },
                  {
                    step: "2. Biselado",
                    done: trackingResult.status !== "PENDING",
                    desc: "Corte y montaje en taller",
                  },
                  {
                    step: "3. Calidad",
                    done:
                      trackingResult.status === "READY_FOR_PICKUP" ||
                      trackingResult.status === "DELIVERED",
                    desc: "Inspección dioptrías",
                  },
                  {
                    step: "4. Listo",
                    done: trackingResult.status === "READY_FOR_PICKUP" || trackingResult.status === "DELIVERED",
                    desc: "Disponible en Sede",
                  },
                ].map((st, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                      st.done
                        ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-300"
                        : "bg-slate-950 border-slate-800 text-slate-500"
                    }`}
                  >
                    <p className="font-bold">{st.step}</p>
                    <p className="text-[11px] text-slate-400">{st.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 border-t border-slate-800/80 text-xs text-slate-500 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Eye className="h-4 w-4" />
            </div>
            <span className="font-bold text-white text-sm">OptiCore PRO • Óptica Médica</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Sede Principal: Av. Larco 1045, Miraflores, Lima</span>
            <span>Tel: +51 1 445-8920</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900 pt-4">
          <p>© 2026 OptiCore Sistema Óptico. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Garantía de Adaptación & Certificado UV400</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
