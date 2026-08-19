"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  SearchX,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { trackWorkOrder } from "@/server/actions/work-orders";
import { getPublicCatalogProducts } from "@/server/actions/inventory";

export default function CatalogoPublicoPage() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("TODAS");
  const [selectedShape, setSelectedShape] = useState("TODAS");
  const [searchFilter, setSearchFilter] = useState("");

  // Tracking state
  const [trackingQuery, setTrackingQuery] = useState("");
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [isSearchingTrack, setIsSearchingTrack] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Fetch real synchronized products 100% from PostgreSQL Database
  useEffect(() => {
    async function loadProducts() {
      try {
        const dbProducts = await getPublicCatalogProducts();
        if (dbProducts && Array.isArray(dbProducts)) {
          const mapped = dbProducts.map((p: any) => ({
            id: p.id,
            sku: p.sku,
            name: p.name,
            brand: p.brandRef?.name || p.name.split(" ")[0] || "OptiCore",
            category: p.category === "FRAME" ? "FRAME" : "SUNGLASSES",
            faceShape: "TODOS LOS ROSTROS",
            style: p.frameModel || "Montura Oftálmica",
            material: p.frameMaterial || "Acetato / Metal",
            measurements:
              p.frameEyeSize || p.frameBridge || p.frameTemple
                ? `${p.frameEyeSize || 52}□${p.frameBridge || 18}-${p.frameTemple || 140}`
                : "Talla Estándar",
            color: p.frameColor || "Color Especial",
            price: Number(p.salePrice) || 0,
            originalPrice: Number(p.salePrice) > 0 ? Number(p.salePrice) * 1.15 : 0,
            tag: p.category === "FRAME" ? "Oftálmico" : "Destacado",
            imageUrl: p.imageUrl || null,
          }));
          setProductsList(mapped);
        } else {
          setProductsList([]);
        }
      } catch (err) {
        console.error("Error al cargar productos públicos:", err);
        setProductsList([]);
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
      item.name.toLowerCase().includes(selectedShape.toLowerCase());

    const matchQuery =
      searchFilter === "" ||
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.color.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchFilter.toLowerCase());

    return matchCategory && matchShape && matchQuery;
  });

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingQuery.trim();
    if (!query) return;

    setIsSearchingTrack(true);
    setTrackError(null);
    setTrackingResult(null);

    try {
      const res = await trackWorkOrder(query);
      if (res) {
        setTrackingResult(res);
      } else {
        setTrackError(
          "No encontramos ninguna orden de trabajo con el DNI o Código ingresado. Verifica los dígitos o contáctanos por WhatsApp para asistirte."
        );
      }
    } catch (err) {
      setTrackError("Ocurrió un error al consultar el estado. Por favor intenta de nuevo.");
    } finally {
      setIsSearchingTrack(false);
    }
  };

  const getWhatsAppLink = (productName: string, sku: string, price: number, imageUrl?: string | null) => {
    const phone = "51987654321";
    let message = `¡Hola OptiCore! Me interesa la montura ${productName} (SKU: ${sku}) con precio de ${formatCurrency(price)}. ¿Tienen disponibilidad y opción de biselar con lunas BlueBlock?`;
    if (imageUrl) {
      message += `\nFoto de referencia: ${imageUrl}`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleResetFilters = () => {
    setSelectedCategory("TODAS");
    setSelectedShape("TODAS");
    setSearchFilter("");
  };

  // Featured Hero Frame (the latest product or placeholder)
  const featuredProduct = productsList.find((p) => p.imageUrl) || productsList[0];

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* 1. Header Flotante Glassmorphism */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between px-4 sm:px-5 py-3 rounded-2xl backdrop-blur-xl bg-slate-900/85 border border-slate-800/80 shadow-2xl">
          <Link href="/catalogo" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                OptiCore <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">PRO</span>
              </span>
              <p className="text-[10px] text-slate-400">Óptica Médica & Catálogo</p>
            </div>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#catalogo" className="hover:text-blue-400 transition-colors">
              Catálogo en Vivo
            </a>
            <a href="#rastreo" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Rastrear mis Lentes
            </a>
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://wa.me/51987654321?text=Hola%20OptiCore,%20deseo%20agendar%20un%20examen%20visual"
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
                <span className="hidden sm:inline">Acceso Personal</span>
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. Hero Section de Alto Impacto Visual */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-4 lg:pt-12">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-spin" style={{ animationDuration: "6s" }} />
              Colección 2026 • Lunas con Filtro Blue Defense UV400
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Visión Perfecta con{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
                Estilo Único.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 font-normal">
              Monturas de diseñador, titanio ultraligero y cristales de alta precisión tallados digitalmente en nuestro taller propio.
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

          {/* Right Floating Showcase (5 cols) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="relative w-full max-w-md"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-cyan-500/30 rounded-3xl blur-2xl transform rotate-6" />

              <div className="relative rounded-3xl border border-slate-700/60 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-2xl backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-600 text-white font-bold text-xs px-2.5 py-0.5">
                    {featuredProduct?.tag || "Novedad 2026"}
                  </Badge>
                  <span className="text-xs font-mono font-semibold text-cyan-400">
                    {featuredProduct?.sku || "OPTICORE-2026"}
                  </span>
                </div>

                <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-950/60 border border-slate-800 flex items-center justify-center p-4">
                  {featuredProduct?.imageUrl ? (
                    <Image
                      src={featuredProduct.imageUrl}
                      alt={featuredProduct.name || "Montura Destacada"}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 450px"
                      className="object-cover object-center rounded-xl hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                      <Glasses className="h-16 w-16 text-blue-500 animate-pulse" />
                      <span className="text-xs font-semibold text-slate-400">Colección Exclusiva OptiCore</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {featuredProduct?.name || "Monturas de Alta Precisión"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {featuredProduct?.material || "Acetato & Titanio Aeroespacial"}
                    </p>
                  </div>
                  {featuredProduct?.price ? (
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-emerald-400 font-mono">
                        {formatCurrency(featuredProduct.price)}
                      </p>
                      {featuredProduct.originalPrice > featuredProduct.price && (
                        <p className="text-[11px] text-slate-500 line-through">
                          {formatCurrency(featuredProduct.originalPrice)}
                        </p>
                      )}
                    </div>
                  ) : null}
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
            Catálogo en Tiempo Real ({filteredProducts.length} Modelos Disponibles)
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Encuentra tu Montura Ideal
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Filtra por estilo de montura, material o busca por tu marca favorita.
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
                placeholder="Buscar por Nombre, Marca, SKU..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Style Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 mr-2">Estilo / Silueta:</span>
            {["TODAS", "Cat Eye", "Aviador", "Redonda", "Cuadrada", "Al Aire", "Clubmaster"].map((shape) => (
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

        {/* 4. Product Cards Grid (FORCED 3-COLUMNS ON DESKTOP) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((sk) => (
              <div
                key={sk}
                className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 animate-pulse"
              >
                <div className="h-4 bg-slate-800 rounded-lg w-1/3" />
                <div className="h-48 bg-slate-800 rounded-2xl w-full" />
                <div className="h-5 bg-slate-800 rounded-lg w-3/4" />
                <div className="h-4 bg-slate-800 rounded-lg w-1/2" />
                <div className="h-10 bg-slate-800 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-slate-800 bg-slate-900/40 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Glasses className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {searchFilter || selectedCategory !== "TODAS" || selectedShape !== "TODAS"
                ? "No encontramos monturas con estos filtros"
                : "Catálogo en actualización"}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              {searchFilter || selectedCategory !== "TODAS" || selectedShape !== "TODAS"
                ? "Prueba cambiando los filtros de búsqueda o limpiando la selección."
                : "Nuevas monturas están siendo registradas en el taller. ¡Contáctanos por WhatsApp para consultar disponibilidad inmediata!"}
            </p>
            {searchFilter || selectedCategory !== "TODAS" || selectedShape !== "TODAS" ? (
              <Button
                onClick={handleResetFilters}
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-700 text-xs text-slate-200 hover:text-white gap-2"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restablecer Filtros
              </Button>
            ) : (
              <a
                href="https://wa.me/51987654321?text=Hola%20OptiCore,%20deseo%20consultar%20modelos%20de%20monturas%20disponibles"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
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

                  {/* Product Image with Next Image / Fallback */}
                  <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-800/80 flex items-center justify-center p-2 mb-4 group-hover:border-blue-500/30 transition-colors">
                    {prod.imageUrl ? (
                      <Image
                        src={prod.imageUrl}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center rounded-xl group-hover:scale-108 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                        <Glasses className="h-12 w-12 text-slate-600 group-hover:text-blue-400 transition-colors" />
                        <span className="text-[11px]">Foto en Taller</span>
                      </div>
                    )}
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
                      href={getWhatsAppLink(prod.name, prod.sku, prod.price, prod.imageUrl)}
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
        )}
      </section>

      {/* 5. Sección de Rastreo de Orden en Tiempo Real */}
      <section id="rastreo" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
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
            <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs text-center max-w-md mx-auto flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{trackError}</span>
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
