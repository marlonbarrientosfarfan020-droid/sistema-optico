"use client";

import { useRef } from "react";
import {
  Printer,
  X,
  Eye,
  CheckCircle2,
  Receipt,
  QrCode,
  Calendar,
  User,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ThermalReceiptDialogProps {
  sale: any;
  onClose: () => void;
}

export function ThermalReceiptDialog({ sale, onClose }: ThermalReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const balance = Number(sale.balanceDue ?? 0);
  const isPending = balance > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 print:border-none print:shadow-none print:max-w-none print:m-0">
        {/* Modal Header (Hidden during print) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Vista Previa de Comprobante</h3>
              <p className="text-[11px] text-slate-500 font-mono">{sale.saleNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handlePrint}
              className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              Imprimir (80mm)
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 80mm Thermal Ticket Body */}
        <div className="p-6 bg-slate-100/50 flex justify-center print:p-0 print:bg-white">
          <div
            ref={receiptRef}
            id="thermal-receipt"
            className="w-full max-w-[320px] bg-white border border-slate-200 p-5 rounded-xl shadow-xs font-mono text-xs text-slate-800 space-y-4 print:border-none print:shadow-none print:p-2 print:max-w-[80mm] print:text-[11px]"
          >
            {/* Store Header */}
            <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
              <div className="flex items-center justify-center gap-1.5 text-blue-700 font-black text-base tracking-tight font-sans">
                <Eye className="h-4 w-4" />
                <span>OPTICORE PRO</span>
              </div>
              <p className="text-[11px] font-bold text-slate-700">CENTRO ÓPTICO & ESPECIALIDADES</p>
              <p className="text-[10px] text-slate-500">RUC: 20608945123</p>
              <p className="text-[10px] text-slate-500">Av. Larco 1045, Miraflores - Lima</p>
              <p className="text-[10px] text-slate-500">Tel: (01) 445-8920 / WhatsApp: 987 654 321</p>
            </div>

            {/* Ticket Info */}
            <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between font-bold">
                <span>N° TICKET:</span>
                <span className="text-blue-700">{sale.saleNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>FECHA:</span>
                <span>{new Date(sale.createdAt).toLocaleString("es-PE")}</span>
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

            {/* Item Table */}
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

            {/* Totals & Balances */}
            <div className="space-y-1 text-xs border-b border-dashed border-slate-300 pb-3">
              {Number(sale.subtotal) > 0 && Number(sale.subtotal) !== Number(sale.totalAmount) && (
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
                <span>TOTAL A PAGAR:</span>
                <span className="text-blue-700">{formatCurrency(sale.totalAmount)}</span>
              </div>

              <div className="flex justify-between text-emerald-700 font-bold text-[11px]">
                <span>ANTICIPO / PAGADO:</span>
                <span>{formatCurrency(sale.paidAmount)}</span>
              </div>

              {isPending ? (
                <div className="flex justify-between font-bold text-red-600 text-xs pt-1 border-t border-dotted border-red-200">
                  <span>SALDO PENDIENTE:</span>
                  <span>{formatCurrency(balance)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-emerald-600 text-[10px] font-bold">
                  <span>ESTADO:</span>
                  <span>✓ TOTALMENTE CANCELADO</span>
                </div>
              )}
            </div>

            {/* Payment Method Details */}
            {sale.payments && sale.payments.length > 0 && (
              <div className="space-y-1 text-[10px] text-slate-500 border-b border-dashed border-slate-300 pb-2">
                <p className="font-bold text-slate-700">MÉTODO DE PAGO:</p>
                {sale.payments.map((p: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>• {p.paymentMethod} {p.referenceNumber ? `(Op: ${p.referenceNumber})` : ""}</span>
                    <span className="font-mono font-bold text-slate-700">{formatCurrency(p.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* QR / Disclaimer */}
            <div className="text-center space-y-1.5 pt-1">
              <div className="inline-block p-1.5 border border-slate-300 rounded-lg bg-white">
                <QrCode className="h-10 w-10 text-slate-800 mx-auto" />
              </div>
              <p className="text-[9px] text-slate-500 uppercase">
                Conserve este comprobante para retirar sus lentes del taller
              </p>
              <p className="text-[8px] text-slate-400 leading-tight">
                Garantía de 1 año en monturas. 30 días de adaptación en cristales progresivos y monofocales.
              </p>
              <p className="font-sans font-bold text-[10px] text-blue-700 pt-1">
                ¡Gracias por confiar en OptiCore PRO!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden during print) */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-100 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cerrar
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
          >
            <Printer className="h-4 w-4" />
            Imprimir Ticket (80mm)
          </Button>
        </div>
      </div>
    </div>
  );
}
