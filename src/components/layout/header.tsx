"use client";

import { Bell, Search, Store, Menu, ExternalLink } from "lucide-react";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/70 bg-white/85 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-900/85">
      {/* Left: Mobile Menu Trigger + Search Bar */}
      <div className="flex items-center gap-3 w-full max-w-md">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Abrir Menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar por DNI, paciente o N° OT..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 ml-3 shrink-0">
        {/* Desktop View Web Catalog Button (sm/md/lg) */}
        <a
          href="/catalogo"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-blue-50/80 hover:border-blue-300 hover:text-blue-700 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          title="Abrir tienda y catálogo online para pacientes en pestaña nueva"
        >
          <span>Ver Tienda / Catálogo Web</span>
          <ExternalLink className="h-3.5 w-3.5 text-blue-600 shrink-0" />
        </a>

        {/* Mobile View Store Quick Button (Icon on small screens) */}
        <a
          href="/catalogo"
          target="_blank"
          rel="noopener noreferrer"
          className="sm:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-blue-200 bg-blue-50/80 text-blue-600 hover:bg-blue-100 shadow-2xs transition-all dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-400"
          title="Ver Tienda / Catálogo Web"
          aria-label="Ver Tienda / Catálogo Web"
        >
          <Store className="h-4 w-4" />
        </a>

        {/* Branch Selector Badge (Desktop) */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/50 hover:border-blue-200 hover:text-blue-700 transition-all cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Store className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span className="truncate max-w-[140px] md:max-w-none">Sede Miraflores</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-all dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
          title="Notificaciones de taller y ventas"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
        </button>
      </div>
    </header>
  );
}
