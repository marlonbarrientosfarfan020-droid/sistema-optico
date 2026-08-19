"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Eye,
  Glasses,
  Wrench,
  ShoppingCart,
  ReceiptText,
  DollarSign,
  Settings,
  Building2,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout, getSession, SessionUser } from "@/server/actions/auth";

export const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Pacientes", href: "/pacientes", icon: Users },
  { name: "Recetas Optométricas", href: "/recetas", icon: Eye },
  { name: "Catálogo e Inventario", href: "/inventario", icon: Glasses },
  { name: "Taller / Laboratorio", href: "/laboratorio", icon: Wrench },
  { name: "Punto de Venta (POS)", href: "/pos", icon: ShoppingCart },
  { name: "Ventas y Anticipos", href: "/ventas", icon: ReceiptText },
  { name: "Caja y Arqueo", href: "/caja", icon: DollarSign },
  { name: "Sucursales", href: "/sucursales", icon: Building2 },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    getSession().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
  }, []);

  const handleLogout = async () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      setIsLoggingOut(true);
      await logout();
    }
  };

  const displayName = currentUser ? currentUser.name : "Dr. Alejandro Reyes";
  const displayRole = currentUser
    ? currentUser.role === "ADMIN"
      ? "Administrador General"
      : currentUser.role === "OPTOMETRIST"
      ? "Optometrista Principal"
      : currentUser.role === "LAB_TECHNICIAN"
      ? "Técnico de Laboratorio"
      : "Asesor de Ventas"
    : "Optometrista Principal";

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 shadow-xs">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-3 group" onClick={onCloseMobile}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              OptiCore{" "}
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Gestión Integral de Óptica</p>
          </div>
        </Link>

        {/* Close Button on Mobile */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "group flex items-center gap-3 rounded-lg py-2.5 text-xs sm:text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-blue-50/90 text-blue-600 font-semibold border-l-4 border-blue-600 pl-3 shadow-2xs dark:bg-blue-950/50 dark:text-blue-400"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100 pl-4"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 transition-colors shrink-0",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User Profile & Logout Footer */}
      <div className="border-t border-slate-100 p-3.5 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2.5 rounded-xl bg-slate-50/80 p-2.5 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{displayRole}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Cerrar Sesión"
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center transition-all shrink-0 group cursor-pointer"
          >
            <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
