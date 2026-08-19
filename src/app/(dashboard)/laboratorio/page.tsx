"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wrench,
  Clock,
  CheckCircle,
  Package,
  User,
  Calendar,
  Glasses,
  ImageIcon,
  Plus,
  Search,
  Printer,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getWorkOrders, updateWorkOrderStatus } from "@/server/actions/work-orders";
import { formatDate, formatDiopter, formatCylinder } from "@/lib/utils";
import { OrderStatus } from "@/types";
import { NewWorkOrderModal } from "@/components/work-orders/new-work-order-modal";
import { TechnicalTicketDialog } from "@/components/work-orders/technical-ticket-dialog";

export const dynamic = "force-dynamic";

export default function LaboratorioPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "IN_LAB" | "READY_FOR_PICKUP" | "DELIVERED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrderForTicket, setSelectedOrderForTicket] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const filterParam = statusFilter === "ALL" ? undefined : (statusFilter as OrderStatus);
    const data = await getWorkOrders(filterParam);
    setWorkOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    await updateWorkOrderStatus(orderId, newStatus);
    await loadData();
    setUpdatingId(null);
  };

  const filteredOrders = workOrders.filter((order) => {
    if (statusFilter !== "ALL" && order.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchOT = order.orderNumber?.toLowerCase().includes(q);
      const matchPatient = `${order.patient?.firstName} ${order.patient?.lastName}`.toLowerCase().includes(q);
      const matchDoc = order.patient?.documentId?.toLowerCase().includes(q);
      const matchFrame = order.frameProduct?.name?.toLowerCase().includes(q) || order.customFrameDetails?.toLowerCase().includes(q);
      return matchOT || matchPatient || matchDoc || matchFrame;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning">1. Pendiente Ingreso</Badge>;
      case "IN_LAB":
        return <Badge variant="info">2. En Taller / Biselado</Badge>;
      case "READY_FOR_PICKUP":
        return <Badge variant="success">3. Listo para Entrega</Badge>;
      case "DELIVERED":
        return <Badge variant="outline">4. Entregado</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Taller y Laboratorio Óptico
          </h2>
          <p className="text-sm text-slate-500">
            Control de producción, corte, biselado y montaje de lentes con trazabilidad de estados y fichas técnicas.
          </p>
        </div>
        <Button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 shadow-sm gap-2 text-white"
        >
          <Plus className="h-4 w-4" />
          Nueva Orden de Taller
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            <Button
              variant={statusFilter === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("ALL")}
              className="text-xs"
            >
              Todas ({workOrders.length})
            </Button>
            <Button
              variant={statusFilter === "PENDING" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("PENDING")}
              className="text-xs text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
            >
              Pendientes ({workOrders.filter((o) => o.status === "PENDING").length})
            </Button>
            <Button
              variant={statusFilter === "IN_LAB" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("IN_LAB")}
              className="text-xs text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
            >
              En Biselado ({workOrders.filter((o) => o.status === "IN_LAB").length})
            </Button>
            <Button
              variant={statusFilter === "READY_FOR_PICKUP" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("READY_FOR_PICKUP")}
              className="text-xs text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
            >
              Listos para Entrega ({workOrders.filter((o) => o.status === "READY_FOR_PICKUP").length})
            </Button>
            <Button
              variant={statusFilter === "DELIVERED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("DELIVERED")}
              className="text-xs"
            >
              Entregados ({workOrders.filter((o) => o.status === "DELIVERED").length})
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por N° OT, Paciente o DNI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Cargando órdenes de taller...</div>
        ) : filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No hay órdenes de trabajo en este estado
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Registra una nueva orden de taller manual o realiza una venta de lunas con montura en el POS.
              </p>
              <Button
                onClick={() => setIsNewOrderModalOpen(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" /> Nueva Orden de Taller
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order: any) => {
            const rx = order.prescription;
            const hasRx = !!rx;

            return (
              <Card
                key={order.id}
                className="border-slate-200/90 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Frame thumbnail & Order details */}
                    <div className="flex items-start sm:items-center gap-4 flex-1">
                      {order.frameProduct?.imageUrl ? (
                        <div className="h-16 w-16 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={order.frameProduct.imageUrl}
                            alt={order.frameProduct.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
                          <Glasses className="h-7 w-7 text-slate-400" />
                        </div>
                      )}

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                            {order.orderNumber}
                          </span>
                          {getStatusBadge(order.status)}
                          <span className="text-xs text-slate-400">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                            {order.patient?.firstName} {order.patient?.lastName}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({order.patient?.documentType || "DNI"}: {order.patient?.documentId})
                          </span>
                        </div>

                        {/* Rx diopters snippet */}
                        {hasRx && (
                          <div className="flex items-center gap-4 text-xs font-mono text-slate-600 bg-slate-50/80 px-2.5 py-1 rounded-lg border border-slate-200/60 max-w-xl">
                            <div>
                              <span className="font-bold text-blue-700">OD:</span>{" "}
                              {formatDiopter(rx.odSphere)} / {formatCylinder(rx.odCylinder)}
                              {rx.odAxis ? ` x ${rx.odAxis}°` : ""}
                            </div>
                            <span className="text-slate-300">|</span>
                            <div>
                              <span className="font-bold text-blue-700">OI:</span>{" "}
                              {formatDiopter(rx.osSphere)} / {formatCylinder(rx.osCylinder)}
                              {rx.osAxis ? ` x ${rx.osAxis}°` : ""}
                            </div>
                            {rx.odAddition && (
                              <>
                                <span className="text-slate-300">|</span>
                                <div>
                                  <span className="font-bold text-amber-700">ADD:</span> +{Number(rx.odAddition).toFixed(2)}
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 text-xs text-slate-600">
                          <div>
                            <span className="font-semibold text-slate-700">Montura: </span>
                            <span>
                              {order.frameProduct
                                ? order.frameProduct.name
                                : order.customFrameDetails || "Montura Propia del Cliente"}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700">Lunas: </span>
                            <span>{order.customLensDetails || "Lunas según receta"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Promised date & Interactive Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 shrink-0">
                      <div className="text-left sm:text-right mr-2">
                        <p className="text-[11px] text-slate-400">Fecha Compromiso</p>
                        <p className="text-xs font-bold text-slate-800 font-mono">
                          {order.promisedDate
                            ? new Date(order.promisedDate).toLocaleString("es-PE", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "No fijada"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Print Technical Sheet Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrderForTicket(order)}
                          className="h-8 text-xs text-slate-700 hover:text-blue-600 hover:border-blue-300 gap-1.5 shadow-2xs"
                          title="Imprimir Ficha Técnica para Biselador"
                        >
                          <Printer className="h-3.5 w-3.5 text-blue-600" />
                          <span>Ficha Técnica</span>
                        </Button>

                        {/* Status Transition Quick Buttons */}
                        {order.status === "PENDING" && (
                          <Button
                            size="sm"
                            disabled={updatingId === order.id}
                            onClick={() => handleStatusChange(order.id, "IN_LAB")}
                            className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1 shadow-2xs"
                          >
                            <Wrench className="h-3.5 w-3.5" />
                            <span>A Biselado</span>
                          </Button>
                        )}

                        {order.status === "IN_LAB" && (
                          <Button
                            size="sm"
                            disabled={updatingId === order.id}
                            onClick={() => handleStatusChange(order.id, "READY_FOR_PICKUP")}
                            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-2xs"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Marcar Listo</span>
                          </Button>
                        )}

                        {order.status === "READY_FOR_PICKUP" && (
                          <Button
                            size="sm"
                            disabled={updatingId === order.id}
                            onClick={() => handleStatusChange(order.id, "DELIVERED")}
                            className="h-8 text-xs bg-slate-800 hover:bg-slate-900 text-white gap-1 shadow-2xs"
                          >
                            <Package className="h-3.5 w-3.5" />
                            <span>Entregar</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* New Work Order Modal */}
      <NewWorkOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onSuccess={() => loadData()}
      />

      {/* Technical Sheet Print Modal */}
      {selectedOrderForTicket && (
        <TechnicalTicketDialog
          order={selectedOrderForTicket}
          onClose={() => setSelectedOrderForTicket(null)}
        />
      )}
    </div>
  );
}
