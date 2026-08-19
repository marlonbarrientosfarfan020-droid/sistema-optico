"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ReceiptText,
  Plus,
  Search,
  DollarSign,
  User,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Eye,
  Printer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getSales } from "@/server/actions/pos";
import { BalancePaymentDialog } from "@/components/pos/balance-payment-dialog";
import { ThermalReceiptDialog } from "@/components/pos/thermal-receipt-dialog";

export const dynamic = "force-dynamic";

export default function VentasPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING_BALANCE" | "COMPLETED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSaleForPayment, setSelectedSaleForPayment] = useState<any | null>(null);
  const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getSales();
    setSales(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSales = sales.filter((sale) => {
    // Filter tab
    if (filter === "PENDING_BALANCE" && Number(sale.balanceDue) <= 0) return false;
    if (filter === "COMPLETED" && Number(sale.balanceDue) > 0) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = sale.saleNumber?.toLowerCase().includes(q);
      const matchPatient = `${sale.patient?.firstName} ${sale.patient?.lastName}`.toLowerCase().includes(q);
      const matchDoc = sale.patient?.documentId?.toLowerCase().includes(q);
      return matchNumber || matchPatient || matchDoc;
    }
    return true;
  });

  const totalSalesAmount = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
  const totalPaidAmount = sales.reduce((sum, s) => sum + Number(s.paidAmount), 0);
  const totalPendingBalance = sales.reduce((sum, s) => sum + Number(s.balanceDue), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Ventas y Control de Saldos
          </h2>
          <p className="text-sm text-slate-500">
            Historial de boletas, anticipos, señas recibidas, impresión de tickets y liquidación de saldos.
          </p>
        </div>
        <Link href="/pos">
          <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm gap-2 text-white">
            <Plus className="h-4 w-4" />
            Nueva Venta / POS
          </Button>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Facturado
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                {formatCurrency(totalSalesAmount)}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/50">
              <ReceiptText className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Cobrado en Caja (Anticipos + Pagos)
              </p>
              <p className="text-xl font-bold text-emerald-600 mt-1 font-mono">
                {formatCurrency(totalPaidAmount)}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/50">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Saldos por Cobrar (Pendiente)
              </p>
              <p className="text-xl font-bold text-red-600 mt-1 font-mono">
                {formatCurrency(totalPendingBalance)}
              </p>
            </div>
            <div className="rounded-xl bg-red-50 p-2.5 text-red-600 dark:bg-red-950/50">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button
              variant={filter === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("ALL")}
              className="text-xs"
            >
              Todas ({sales.length})
            </Button>
            <Button
              variant={filter === "PENDING_BALANCE" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("PENDING_BALANCE")}
              className="text-xs text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
            >
              Con Saldo Pendiente ({sales.filter((s) => Number(s.balanceDue) > 0).length})
            </Button>
            <Button
              variant={filter === "COMPLETED" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("COMPLETED")}
              className="text-xs"
            >
              Canceladas al 100% ({sales.filter((s) => Number(s.balanceDue) <= 0).length})
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por N° Venta o Paciente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Comprobantes y Ventas ({filteredSales.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Cargando ventas...</div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ReceiptText className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No hay ventas registradas
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Genera tu primera venta desde el módulo de Punto de Venta.
              </p>
              <Link href="/pos">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" /> Ir al POS
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
                    <th className="py-3 px-4">N° COMPROBANTE</th>
                    <th className="py-3 px-4">PACIENTE</th>
                    <th className="py-3 px-4">FECHA</th>
                    <th className="py-3 px-4 text-right">TOTAL</th>
                    <th className="py-3 px-4 text-right">ANTICIPO / ABONO</th>
                    <th className="py-3 px-4 text-right">SALDO PENDIENTE</th>
                    <th className="py-3 px-4 text-center">ESTADO</th>
                    <th className="py-3 px-4 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSales.map((sale) => {
                    const balance = Number(sale.balanceDue ?? 0);
                    const isPending = balance > 0;

                    return (
                      <tr
                        key={sale.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-xs font-bold text-blue-600">
                          {sale.saleNumber}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {sale.patient?.firstName} {sale.patient?.lastName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {sale.patient?.documentType}: {sale.patient?.documentId}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500">
                          {formatDate(sale.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(sale.totalAmount)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600">
                          {formatCurrency(sale.paidAmount)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-red-600">
                          {isPending ? formatCurrency(balance) : "-"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={isPending ? "warning" : "success"}
                            className="text-[11px]"
                          >
                            {isPending ? "Con Saldo" : "Cancelado"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Print Thermal Ticket Button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedSaleForReceipt(sale)}
                              className="h-8 text-xs text-slate-700 hover:text-blue-600 hover:border-blue-300 gap-1.5 shadow-2xs"
                              title="Imprimir Ticket Térmico de 80mm"
                            >
                              <Printer className="h-3.5 w-3.5 text-blue-600" />
                              <span>Imprimir</span>
                            </Button>

                            {/* Collect Balance Payment Button */}
                            {isPending && (
                              <Button
                                size="sm"
                                onClick={() => setSelectedSaleForPayment(sale)}
                                className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1 shadow-2xs"
                              >
                                <DollarSign className="h-3.5 w-3.5" />
                                Cobrar
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Balance Payment Modal */}
      {selectedSaleForPayment && (
        <BalancePaymentDialog
          sale={selectedSaleForPayment}
          onClose={() => {
            setSelectedSaleForPayment(null);
            loadData();
          }}
        />
      )}

      {/* Thermal Receipt Print Modal */}
      {selectedSaleForReceipt && (
        <ThermalReceiptDialog
          sale={selectedSaleForReceipt}
          onClose={() => setSelectedSaleForReceipt(null)}
        />
      )}
    </div>
  );
}
