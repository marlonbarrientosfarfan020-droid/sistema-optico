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
import { formatCurrency, formatDate } from "@/lib/utils";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { getDashboardMetrics } from "@/server/actions/dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  const chartData = metrics.weeklyRevenue.map((d) => ({
    day: d.day,
    ventas: d.total,
  }));

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

      {/* KPI Metrics Cards (100% Real Database Metrics) */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Pacientes Atendidos */}
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
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {metrics.totalPatients}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-1">
              <span>{metrics.totalPatients === 1 ? "1 paciente en historia clínica" : `${metrics.totalPatients} pacientes en historia clínica`}</span>
            </p>
          </CardContent>
        </Card>

        {/* 2. En Taller / Biselado */}
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
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {metrics.inLabOrdersCount}
            </div>
            <p className="text-xs text-amber-600 font-semibold mt-1.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{metrics.inLabOrdersCount === 1 ? "1 trabajo en proceso" : `${metrics.inLabOrdersCount} trabajos en proceso`}</span>
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
              {formatCurrency(metrics.totalMonthSales)}
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" /> Facturación mes en curso
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
              {formatCurrency(metrics.totalBalanceDue)}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1.5">
              {metrics.pendingPatientsCount === 1
                ? "1 paciente con saldo pendiente"
                : `${metrics.pendingPatientsCount} pacientes con saldo pendiente`}
            </p>
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
            {metrics.recentWorkOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <Glasses className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                No hay órdenes de taller pendientes en este momento.
              </div>
            ) : (
              <div className="space-y-3">
                {metrics.recentWorkOrders.map((order: any) => {
                  const statusMap: { [key: string]: { label: string; variant: "info" | "warning" | "success" | "outline" } } = {
                    PENDING: { label: "Ingresada", variant: "warning" },
                    IN_LAB: { label: "En Taller / Biselado", variant: "info" },
                    LAB_COMPLETED: { label: "Biselado Listo", variant: "info" },
                    READY_FOR_PICKUP: { label: "Listo para Entrega", variant: "success" },
                    DELIVERED: { label: "Entregado", variant: "outline" },
                    CANCELLED: { label: "Cancelada", variant: "outline" },
                  };

                  const currentSt = statusMap[order.status] || { label: order.status, variant: "outline" };
                  const frameName =
                    order.frameProduct?.name ||
                    order.customFrameDetails ||
                    "Montura Propia";
                  const lensName =
                    order.lensProduct?.name ||
                    order.customLensDetails ||
                    "Lunas Graduadas";

                  return (
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
                            <span className="font-mono font-bold text-xs text-blue-600">{order.orderNumber}</span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {order.patient?.firstName} {order.patient?.lastName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{lensName} • {frameName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 sm:self-center self-end">
                        <Badge variant={currentSt.variant} className="text-[11px]">
                          {currentSt.label}
                        </Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="h-3 w-3" /> {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column (5 cols): Gráfico de Ingresos & Citas */}
        <div className="lg:col-span-5 space-y-6">
          {/* Revenue Chart Widget with Real Database Data */}
          <Card className="rounded-2xl border border-slate-200/80 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>Ingresos Semanales (S/)</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                  Últimos 7 días
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                Ventas y cobros de anticipos en caja por día
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart data={chartData} />
            </CardContent>
          </Card>

          {/* Pacientes y Consultas Recientes */}
          <Card className="rounded-2xl border border-slate-200/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Atenciones y Consultas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                    09:30 AM
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Carlos Mendoza Silva</p>
                    <p className="text-[11px] text-slate-500">Examen de Refracción & Presbicia</p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">
                  ATENDIDO
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                    11:00 AM
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Control de Adaptación</p>
                    <p className="text-[11px] text-slate-500">Entrega de Montura y Lunas</p>
                  </div>
                </div>
                <Badge variant="info" className="text-[10px]">
                  EN SALA
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
