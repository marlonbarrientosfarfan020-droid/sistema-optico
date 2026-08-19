"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { recordBalancePayment } from "@/server/actions/pos";

interface BalancePaymentDialogProps {
  sale: {
    id: string;
    saleNumber: string;
    patient: {
      firstName: string;
      lastName: string;
      documentId: string;
    };
    totalAmount: number;
    paidAmount: number;
    balanceDue: number;
  };
  onClose: () => void;
}

export function BalancePaymentDialog({ sale, onClose }: BalancePaymentDialogProps) {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(sale.balanceDue);
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "YAPE_PLIN"
  >("CASH");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError("El monto a abonar debe ser mayor a 0.");
      return;
    }
    if (amount > sale.balanceDue) {
      setError(`El monto no puede exceder el saldo pendiente (${formatCurrency(sale.balanceDue)})`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await recordBalancePayment(sale.id, {
      amount,
      paymentMethod,
      paymentType: amount >= sale.balanceDue ? "BALANCE_SETTLEMENT" : "ADVANCE_DEPOSIT",
      referenceNumber,
      notes: notes || (amount >= sale.balanceDue ? "Liquidación total de saldo para entrega" : "Abono parcial"),
    });

    setIsSubmitting(false);

    if (res.success) {
      alert("¡Abono registrado exitosamente!");
      onClose();
      router.refresh();
    } else {
      setError(res.error || "No se pudo registrar el pago.");
    }
  };

  const remainingAfter = Math.max(0, sale.balanceDue - amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Cobrar Saldo Pendiente
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {sale.saleNumber} • {sale.patient.firstName} {sale.patient.lastName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-800 text-center text-xs">
            <div>
              <p className="text-slate-500 text-[11px]">Total Venta</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {formatCurrency(sale.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-[11px]">Abonado</p>
              <p className="font-bold text-emerald-600 mt-0.5">
                {formatCurrency(sale.paidAmount)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-[11px]">Saldo Actual</p>
              <p className="font-bold text-red-600 mt-0.5">
                {formatCurrency(sale.balanceDue)}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Monto a Cobrar Ahora *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max={sale.balanceDue}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full text-center font-mono font-bold text-lg py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
              />
              <button
                type="button"
                onClick={() => setAmount(sale.balanceDue)}
                className="absolute right-2 top-2 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100"
              >
                100% Saldo
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 text-center">
              Saldo restante tras este pago: <strong className="text-slate-700 dark:text-slate-300">{formatCurrency(remainingAfter)}</strong>
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Método de Pago
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
            >
              <option value="CASH">Efectivo</option>
              <option value="CREDIT_CARD">Tarjeta de Crédito</option>
              <option value="DEBIT_CARD">Tarjeta de Débito</option>
              <option value="YAPE_PLIN">Yape / Plin / Billetera Digital</option>
              <option value="BANK_TRANSFER">Transferencia Bancaria</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              N° de Operación / Referencia
            </label>
            <input
              type="text"
              placeholder="Ej: OP-849201"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Notas / Observaciones
            </label>
            <input
              type="text"
              placeholder="Ej: Pago total al retirar lentes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || amount <= 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting ? "Registrando..." : `Confirmar Cobro (${formatCurrency(amount)})`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
