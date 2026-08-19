"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Lock,
  Unlock,
  CreditCard,
  Smartphone,
  Landmark,
  TrendingUp,
  Receipt,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  getCurrentCashSession,
  getTodayCashSummary,
  openCashSession,
  closeCashSession,
} from "@/server/actions/cash";

export const dynamic = "force-dynamic";

export default function CajaPage() {
  const [session, setSession] = useState<any | null>(null);
  const [summary, setSummary] = useState<any>({
    payments: [],
    cashIncome: 0,
    cardIncome: 0,
    digitalIncome: 0,
    transferIncome: 0,
    totalIncome: 0,
  });
  const [loading, setLoading] = useState(true);

  // Open modal state
  const [openingAmount, setOpeningAmount] = useState<number>(100);
  const [openingNotes, setOpeningNotes] = useState("");
  const [isOpening, setIsOpening] = useState(false);

  // Close modal state
  const [actualClosingCash, setActualClosingCash] = useState<number>(0);
  const [closingNotes, setClosingNotes] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [currentSession, todaySummary] = await Promise.all([
      getCurrentCashSession(),
      getTodayCashSummary(),
    ]);
    setSession(currentSession);
    setSummary(todaySummary);
    if (currentSession) {
      const expectedCash = Number(currentSession.openingAmount) + Number(todaySummary.cashIncome);
      setActualClosingCash(expectedCash);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenBox = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpening(true);
    const res = await openCashSession({
      openingAmount,
      notes: openingNotes,
    });
    setIsOpening(false);
    if (res.success) {
      alert("¡Turno de caja abierto correctamente!");
      loadData();
    } else {
      alert(res.error || "No se pudo abrir la caja.");
    }
  };

  const handleCloseBox = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsClosing(true);
    const expectedClosingAmount =
      Number(session.openingAmount) + Number(summary.cashIncome);

    const res = await closeCashSession({
      sessionId: session.id,
      actualClosingAmount: actualClosingCash,
      expectedClosingAmount,
      notes: closingNotes,
    });
    setIsClosing(false);
    setShowCloseDialog(false);

    if (res.success) {
      alert("¡Caja cerrada y arqueada exitosamente!");
      loadData();
    } else {
      alert(res.error || "No se pudo cerrar la caja.");
    }
  };

  const expectedCashInDrawer = session
    ? Number(session.openingAmount) + Number(summary.cashIncome)
    : 0;

  const difference = actualClosingCash - expectedCashInDrawer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Control y Arqueo de Caja
          </h2>
          <p className="text-sm text-slate-500">
            Apertura de turno, control de ingresos en efectivo, tarjetas y billeteras digitales, y cierre diario.
          </p>
        </div>
        {session ? (
          <Button
            onClick={() => setShowCloseDialog(true)}
            variant="destructive"
            className="gap-2 shadow-sm"
          >
            <Lock className="h-4 w-4" />
            Cerrar Caja / Cuadre
          </Button>
        ) : null}
      </div>

      {/* Session State Banner */}
      {!loading && !session ? (
        <Card className="border-amber-200 bg-amber-50/70 dark:bg-amber-950/20 dark:border-amber-900">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center dark:bg-amber-900 dark:text-amber-300">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Caja Cerrada
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Debes abrir el turno de caja indicando el fondo inicial para registrar ventas en el POS.
                  </p>
                </div>
              </div>

              <form onSubmit={handleOpenBox} className="flex items-center gap-3">
                <div>
                  <input
                    type="number"
                    step="10"
                    value={openingAmount}
                    onChange={(e) => setOpeningAmount(Number(e.target.value))}
                    placeholder="Monto Inicial"
                    className="h-10 w-36 text-center font-mono font-bold rounded-lg border border-slate-300 bg-white px-3 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isOpening}
                  className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                >
                  <Unlock className="h-4 w-4" />
                  {isOpening ? "Abriendo..." : "Abrir Turno de Caja"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900">
          <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Unlock className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Turno de Caja Activo
                  </span>
                  <Badge variant="success" className="text-[10px]">
                    Abierta
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Apertura: {session?.openedAt ? formatDate(session.openedAt) : "Hoy"} • Fondo Inicial:{" "}
                  <strong className="font-mono text-slate-800 dark:text-slate-200">
                    {formatCurrency(session?.openingAmount ?? 0)}
                  </strong>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Efectivo Estimado en Gaveta</span>
              <span className="font-mono font-bold text-lg text-emerald-700 dark:text-emerald-400">
                {formatCurrency(expectedCashInDrawer)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Income Breakdown KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Efectivo */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Efectivo
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
              {formatCurrency(summary.cashIncome)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Cobros en tienda</p>
          </CardContent>
        </Card>

        {/* Tarjetas */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tarjetas (POS)
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
              {formatCurrency(summary.cardIncome)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Crédito y Débito</p>
          </CardContent>
        </Card>

        {/* Digital Wallets (Yape / Plin) */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Yape / Plin / Billeteras
            </CardTitle>
            <Smartphone className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
              {formatCurrency(summary.digitalIncome)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Transferencia QR móvil</p>
          </CardContent>
        </Card>

        {/* Total General Cobrado */}
        <Card className="border-slate-200 shadow-xs bg-slate-900 text-white dark:bg-slate-950">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Cobrado Hoy
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg font-bold font-mono text-emerald-400">
              {formatCurrency(summary.totalIncome)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{summary.payments.length} operaciones</p>
          </CardContent>
        </Card>
      </div>

      {/* Movements Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Movimientos de Cobro y Pagos del Día ({summary.payments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summary.payments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No hay cobros registrados durante este turno.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
                    <th className="py-3 px-4">HORA</th>
                    <th className="py-3 px-4">COMPROBANTE</th>
                    <th className="py-3 px-4">PACIENTE</th>
                    <th className="py-3 px-4">MÉTODO</th>
                    <th className="py-3 px-4">TIPO DE PAGO</th>
                    <th className="py-3 px-4 text-right">MONTO COBRADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {summary.payments.map((p: any) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-xs font-mono text-slate-500">
                        {new Date(p.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-bold text-blue-600">
                        {p.sale?.saleNumber || "-"}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-slate-800 dark:text-slate-200">
                        {p.sale?.patient
                          ? `${p.sale.patient.firstName} ${p.sale.patient.lastName}`
                          : "Cliente General"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[11px]">
                          {p.paymentMethod}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                        {p.notes || p.paymentType}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                        {formatCurrency(p.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Close Cash Box Modal */}
      {showCloseDialog && session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              Cierre y Cuadre de Caja
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa el conteo físico de dinero en efectivo en la gaveta.
            </p>

            <form onSubmit={handleCloseBox} className="mt-4 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 dark:bg-slate-800/50 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fondo Inicial:</span>
                  <span className="font-mono font-semibold">{formatCurrency(session.openingAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ingresos Efectivo:</span>
                  <span className="font-mono font-semibold text-emerald-600">+{formatCurrency(summary.cashIncome)}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Efectivo Esperado:</span>
                  <span className="font-mono text-blue-600">{formatCurrency(expectedCashInDrawer)}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Efectivo Físico Contado en Gaveta *
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={actualClosingCash}
                  onChange={(e) => setActualClosingCash(Number(e.target.value))}
                  className="w-full text-center font-mono font-bold text-lg py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-2.5 rounded-lg text-xs font-semibold text-center border">
                {difference === 0 ? (
                  <span className="text-emerald-600">✓ Cuadre Exacto (Diferencia: S/ 0.00)</span>
                ) : difference > 0 ? (
                  <span className="text-blue-600">Sobrante de Caja: +{formatCurrency(difference)}</span>
                ) : (
                  <span className="text-red-600">Faltante de Caja: {formatCurrency(difference)}</span>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Observaciones de Cierre
                </label>
                <textarea
                  rows={2}
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="Ej: Cuadre realizado sin observaciones..."
                  className="w-full p-2 text-xs rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCloseDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isClosing}
                  variant="destructive"
                >
                  {isClosing ? "Cerrando..." : "Confirmar Cierre de Caja"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
