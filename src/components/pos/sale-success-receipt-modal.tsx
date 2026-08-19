"use client";

import { useEffect, useRef } from "react";
import {
  Printer,
  CheckCircle2,
  X,
  Eye,
  Glasses,
  QrCode,
  ArrowRight,
  Plus,
  Receipt,
  DollarSign,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface SaleSuccessReceiptModalProps {
  sale: any;
  cashReceived?: number;
  autoPrint?: boolean;
  onClose: () => void;
  onNewSale: () => void;
}

export function SaleSuccessReceiptModal({
  sale,
  cashReceived,
  autoPrint = false,
  onClose,
  onNewSale,
}: SaleSuccessReceiptModalProps) {
  const hasAutoPrintedRef = useRef(false);

  useEffect(() => {
    if (autoPrint && !hasAutoPrintedRef.current) {
      hasAutoPrintedRef.current = true;
      const timer = setTimeout(() => {
        window.print();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const total = Number(sale.totalAmount ?? 0);
  const paid = Number(sale.paidAmount ?? 0);
  const balance = Number(sale.balanceDue ?? 0);
  const isPending = balance > 0;

  const changeGiven =
    cashReceived && cashReceived > paid ? Math.max(0, cashReceived - paid) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 print:border-none print:shadow-none print:max-w-none print:m-0">
        {/* Modal Top Banner (Success feedback) - Hidden on print */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">¡Venta Procesada con Éxito!</h3>
                <p className="text-xs text-emerald-100 font-mono">
                  Comprobante: {sale.saleNumber}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 text-center">
            <div className="bg-black/15 backdrop-blur-xs rounded-xl p-2">
              <p className="text-[10px] text-emerald-100 uppercase tracking-wider">Total</p>
              <p className="font-mono font-bold text-sm text-white">{formatCurrency(total)}</p>
            </div>
            <div className="bg-black/15 backdrop-blur-xs rounded-xl p-2">
              <p className="text-[10px] text-emerald-100 uppercase tracking-wider">Abonado</p>
              <p className="font-mono font-bold text-sm text-white">{formatCurrency(paid)}</p>
            </div>
            <div className="bg-black/15 backdrop-blur-xs rounded-xl p-2">
              <p className="text-[10px] text-emerald-100 uppercase tracking-wider">
                {isPending ? "Saldo Pendiente" : "Vuelto"}
              </p>
              <p
                className={`font-mono font-bold text-sm ${
                  isPending ? "text-amber-200" : "text-white"
                }`}
              >
                {isPending ? formatCurrency(balance) : formatCurrency(changeGiven)}
              </p>
            </div>
          </div>
        </div>

        {/* 80mm / 58mm Thermal Ticket Preview Container */}
        <div className="p-6 bg-slate-100/60 flex justify-center max-h-[60vh] overflow-y-auto print:p-0 print:bg-white print:max-h-none print:overflow-visible">
          <div
            id="pos-thermal-ticket"
            className="w-full max-w-[320px] bg-white border border-slate-300 p-5 rounded-2xl shadow-xs font-mono text-xs text-slate-800 space-y-3.5 print:border-none print:shadow-none print:p-1 print:max-w-[80mm] print:text-[11px]"
          >
            {/* Header Optical Shop */}
            <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
              <div className="flex items-center justify-center gap-1.5 text-blue-800 font-black text-base tracking-tight font-sans">
                <Eye className="h-4 w-4" />
                <span>OPTICORE - MIRAFLORES</span>
              </div>
              <p className="text-[11px] font-bold text-slate-700">CENTRO ÓPTICO Y ESPECIALIDADES</p>
              <p className="text-[10px] text-slate-500">RUC: 20608945123</p>
              <p className="text-[10px] text-slate-500">Av. Larco 1045, Miraflores - Lima</p>
              <p className="text-[10px] text-slate-500">Tel: (01) 445-8920 / WhatsApp: 987 654 321</p>
            </div>

            {/* Ticket Info */}
            <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between font-bold">
                <span>COMPROBANTE:</span>
                <span className="text-blue-800 font-black">{sale.saleNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>FECHA:</span>
                <span>{new Date(sale.createdAt || Date.now()).toLocaleString("es-PE")}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CLIENTE:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[170px]">
                  {sale.patient?.firstName} {sale.patient?.lastName}
                </span>
              </div>
              {sale.patient?.documentId && (
                <div className="flex justify-between text-slate-600">
                  <span>{sale.patient?.documentType || "DNI"}:</span>
                  <span>{sale.patient?.documentId}</span>
                </div>
              )}
              {sale.patient?.phone && (
                <div className="flex justify-between text-slate-600">
                  <span>TELÉFONO:</span>
                  <span>{sale.patient?.phone}</span>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="border-b border-dashed border-slate-300 pb-3 space-y-2">
              <div className="flex justify-between font-bold text-[10px] text-slate-500 border-b border-slate-200 pb-1">
                <span className="w-8">CANT</span>
                <span className="flex-1">DESCRIPCIÓN</span>
                <span className="w-16 text-right">TOTAL</span>
              </div>

              {sale.items && sale.items.length > 0 ? (
                sale.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-[11px] items-start gap-1">
                    <span className="w-8 font-bold text-slate-700">{it.quantity}x</span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 leading-tight">{it.description}</p>
                      {it.discount > 0 && (
                        <p className="text-[9px] text-emerald-600 font-sans">
                          Desc: -{formatCurrency(it.discount)}
                        </p>
                      )}
                    </div>
                    <span className="w-16 text-right font-bold font-mono">
                      {formatCurrency(it.total)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-slate-500 text-center py-1">
                  Atención Optométrica y Montura
                </div>
              )}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-1 text-xs border-b border-dashed border-slate-300 pb-3">
              {Number(sale.subtotal) > 0 && Number(sale.subtotal) !== total && (
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>SUBTOTAL:</span>
                  <span>{formatCurrency(sale.subtotal)}</span>
                </div>
              )}
              {Number(sale.discount) > 0 && (
                <div className="flex justify-between text-emerald-600 text-[11px]">
                  <span>DESCUENTO:</span>
                  <span>-{formatCurrency(sale.discount)}</span>
                </div>
              )}

              <div className="flex justify-between font-extrabold text-sm pt-1 text-slate-900">
                <span>TOTAL VENTA:</span>
                <span className="text-blue-800">{formatCurrency(total)}</span>
              </div>

              <div className="flex justify-between text-emerald-700 font-bold text-[11px]">
                <span>MONTO ABONADO:</span>
                <span>{formatCurrency(paid)}</span>
              </div>

              {cashReceived && cashReceived > 0 && (
                <>
                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>EFECTIVO RECIBIDO:</span>
                    <span>{formatCurrency(cashReceived)}</span>
                  </div>
                  {changeGiven > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold text-[11px]">
                      <span>VUELTO ENTREGADO:</span>
                      <span>{formatCurrency(changeGiven)}</span>
                    </div>
                  )}
                </>
              )}

              {isPending ? (
                <div className="flex justify-between font-bold text-red-600 text-xs pt-1 border-t border-dotted border-red-300">
                  <span>SALDO PENDIENTE:</span>
                  <span>{formatCurrency(balance)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-emerald-700 text-[10px] font-bold">
                  <span>ESTADO:</span>
                  <span>✓ 100% CANCELADO</span>
                </div>
              )}
            </div>

            {/* Payments List */}
            {sale.payments && sale.payments.length > 0 && (
              <div className="space-y-1 text-[10px] text-slate-500 border-b border-dashed border-slate-300 pb-2">
                <p className="font-bold text-slate-700">MÉTODO DE PAGO:</p>
                {sale.payments.map((p: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      • {p.paymentMethod} {p.referenceNumber ? `(Op: ${p.referenceNumber})` : ""}
                    </span>
                    <span className="font-mono font-bold text-slate-700">
                      {formatCurrency(p.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* QR / Taller Code / Footer */}
            <div className="text-center space-y-1.5 pt-1">
              <div className="inline-block p-1.5 border border-slate-300 rounded-xl bg-white">
                <QrCode className="h-10 w-10 text-slate-800 mx-auto" />
              </div>
              <p className="text-[9px] text-slate-600 font-bold uppercase">
                Conserve su comprobante para recoger sus lentes
              </p>
              <p className="text-[8px] text-slate-400 leading-tight">
                Garantía de 1 año en monturas y 30 días de adaptación en cristales.
              </p>
              <p className="font-sans font-bold text-[10px] text-blue-700 pt-0.5">
                ¡Gracias por su preferencia!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions - Hidden on print */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200 print:hidden">
          <Button
            type="button"
            variant="outline"
            onClick={onNewSale}
            className="w-full sm:w-auto text-xs gap-1.5 rounded-xl border-slate-300 hover:bg-slate-100 text-slate-700"
          >
            <Plus className="h-4 w-4 text-emerald-600" />
            <span>Nueva Venta</span>
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs rounded-xl"
            >
              Cerrar
            </Button>
            <Button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs gap-2 rounded-xl shadow-md font-semibold px-4"
            >
              <Printer className="h-4 w-4" />
              <span>🖨️ Imprimir Ticket (80mm)</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
