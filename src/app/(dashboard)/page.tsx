import Link from "next/link";
import {
  Users,
  Eye,
  Wrench,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Glasses,
  ShoppingCart,
  ReceiptText,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { RevenueChart } from "@/components/dashboard/revenue-chart";

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Panel de Control Óptico
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Resumen en tiempo real de consultas optométricas, taller y ventas en Sede Miraflores.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link href="/recetas/nueva">
            <Button className="h-9 sm:h-10 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 shadow-sm gap-2 text-white rounded-xl">
              <Eye className="h-4 w-4" />
              Nueva Receta
            </Button>
          </Link>
          <Link href="/pos">
            <Button className="h-9 sm:h-10 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 shadow-sm gap-2 text-white rounded-xl">
              <ShoppingCart className="h-4 w-4" />
              Punto de Venta
            </Button>
          </Link>
          <Link href="/pacientes/nuevo">
            <Button variant="outline" className="h-9 sm:h-10 text-xs sm:text-sm gap-2 rounded-xl border-slate-200">
              <Users className="h-4 w-4" />
              Nuevo Paciente
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Pacientes */}
        <Card className="rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pacientes Atendidos
            </CardTitle>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/60 shadow-2xs">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">142</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" /> +12% este mes
            </p>
          </CardContent>
        </Card>

        {/* 2. Órdenes en Laboratorio */}
        <Card className="rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              En Taller / Biselado
            </CardTitle>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/60 shadow-2xs">
              <Wrench className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">18</div>
            <p className="text-xs text-amber-600 font-semibold mt-1.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 5 con entrega hoy
            </p>
          </CardContent>
        </Card>

        {/* 3. Ventas del Mes (TrendingUp) */}
        <Card className="rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ventas del Mes
            </CardTitle>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/60 shadow-2xs">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {formatCurrency(8450)}
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" /> +8.4% vs mes anterior
            </p>
          </CardContent>
        </Card>

        {/* 4. Saldos por Cobrar */}
        <Card className="rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Saldos por Cobrar
            </CardTitle>
            <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600 dark:bg-rose-950/60 shadow-2xs">
              <ReceiptText className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {formatCurrency(1920)}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1.5">11 pacientes con anticipo</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Órdenes de Taller activas & Widget de Gráficos/Citas */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column (7 cols): Órdenes de Taller en Producción */}
        <Card className="lg:col-span-7 rounded-2xl border border-slate-200/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-base font-bold">Órdenes de Trabajo en Taller</CardTitle>
              <CardDescription className="text-xs">
                Trazabilidad del proceso de corte, biselado y montaje de lunas
              </CardDescription>
            </div>
            <Link href="/laboratorio">
              <Button variant="outline" size="sm" className="rounded-xl text-xs">
                Ver todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {[
                {
                  id: "OT-2026-0042",
                  patient: "Carlos Mendoza Silva",
                  type: "Progresivo Freeform BlueBlock 1.67",
                  frame: "Ray-Ban RB5154 Clubmaster",
                  statusLabel: "En Taller",
                  variant: "info" as const,
                  date: "Hoy 17:00",
                },
                {
                  id: "OT-2026-0041",
                  patient: "María José Fernández",
                  type: "Monofocal Orgánico AR Verde",
                  frame: "Montura Propia del Cliente",
                  statusLabel: "Listo para Entrega",
                  variant: "success" as const,
                  date: "Hoy 14:30",
                },
                {
                  id: "OT-2026-0040",
                  patient: "Roberto Gómez Bolaños",
                  type: "Bifocal Flat-Top Policarbonato",
                  frame: "Oakley Pitchman R Satin Black",
                  statusLabel: "Pendiente Material",
                  variant: "warning" as const,
                  date: "Mañana 11:00",
                },
              ].map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 hover:bg-blue-50/30 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <Glasses className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-600">{order.id}</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {order.patient}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{order.type} • {order.frame}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 sm:self-center self-end">
                    <Badge variant={order.variant} className="text-[11px]">
                      {order.statusLabel}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3" /> {order.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column (5 cols): Gráfico de Ingresos & Citas */}
        <div className="lg:col-span-5 space-y-6">
          {/* Revenue Chart Widget */}
          <Card className="rounded-2xl border border-slate-200/80 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>Ingresos Semanales (S/)</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                  +14.2% esta semana
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                Ventas y cobros de anticipos en caja por día
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>

          {/* Pacientes Citados Hoy Widget */}
          <Card className="rounded-2xl border border-slate-200/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Pacientes Citados Hoy
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-2.5">
              {[
                { time: "09:30 AM", patient: "Lucía Paredes", type: "Examen de Refracción", status: "ATENDIDO" },
                { time: "11:00 AM", patient: "Jorge Benavides", type: "Prueba Lentes de Contacto", status: "EN SALA" },
                { time: "03:30 PM", patient: "Elena Morales", type: "Control Post-Entrega", status: "PENDIENTE" },
              ].map((apt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                      {apt.time}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{apt.patient}</p>
                      <p className="text-[11px] text-slate-500">{apt.type}</p>
                    </div>
                  </div>
                  <Badge
                    variant={apt.status === "ATENDIDO" ? "success" : apt.status === "EN SALA" ? "info" : "outline"}
                    className="text-[10px]"
                  >
                    {apt.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
