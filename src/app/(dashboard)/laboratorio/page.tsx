import Link from "next/link";
import { Wrench, Clock, CheckCircle, Package, User, Calendar, Glasses, ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkOrderStatusBadge } from "@/components/work-orders/work-order-status-badge";
import { getWorkOrders } from "@/server/actions/work-orders";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LaboratorioPage() {
  const workOrders = await getWorkOrders();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Taller y Laboratorio Óptico
          </h2>
          <p className="text-sm text-slate-500">
            Control de producción, corte, biselado y montaje de lentes con trazabilidad de estados y fotos de montura.
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {workOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No hay órdenes de trabajo activas en taller
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Las órdenes de taller se generan automáticamente al realizar una venta de lunas con montura en el POS o desde la receta.
              </p>
              <Link href="/pos">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Ir al Punto de Venta
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          workOrders.map((order: any) => (
            <Card key={order.id} className="border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Frame image thumbnail & order info */}
                  <div className="flex items-center gap-4 flex-1">
                    {order.frameProduct?.imageUrl ? (
                      <div className="h-16 w-16 rounded-xl overflow-hidden border border-slate-200 bg-white dark:border-slate-700 shrink-0 shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={order.frameProduct.imageUrl}
                          alt={order.frameProduct.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 dark:border-slate-800 dark:bg-slate-900">
                        <Glasses className="h-7 w-7 text-slate-400" />
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-950/60">
                          {order.orderNumber}
                        </span>
                        <WorkOrderStatusBadge status={order.status as any} />
                        <span className="text-xs text-slate-400">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {order.patient?.firstName} {order.patient?.lastName}
                        </span>
                        <span className="text-xs text-slate-400">({order.patient?.documentId})</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 text-xs text-slate-600 dark:text-slate-300">
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">Montura: </span>
                          <span>
                            {order.frameProduct
                              ? order.frameProduct.name
                              : order.customFrameDetails || "Montura Propia del Cliente"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">Lunas: </span>
                          <span>{order.customLensDetails || "Lunas de Stock"} ({order.bevelType})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Promised date */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">Fecha Compromiso</p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {formatDate(order.promisedDate) || "No fijada"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
