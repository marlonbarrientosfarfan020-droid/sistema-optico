"use client";

import { useRef } from "react";
import {
  Printer,
  X,
  Eye,
  Glasses,
  CheckSquare,
  Wrench,
  Calendar,
  Clock,
  User,
  Layers,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDiopter, formatCylinder, formatAxis } from "@/lib/utils";

interface TechnicalTicketDialogProps {
  order: any;
  onClose: () => void;
}

export function TechnicalTicketDialog({ order, onClose }: TechnicalTicketDialogProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const rx = order.prescription;
  const frame = order.frameProduct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 print:border-none print:shadow-none print:max-w-none print:m-0">
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Ficha Técnica de Taller</h3>
              <p className="text-xs text-slate-500 font-mono">{order.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handlePrint}
              className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              Imprimir Ficha Técnica
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Laboratory Work Order Sheet */}
        <div className="p-6 font-sans text-xs text-slate-800 space-y-4 bg-white print:p-4">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-blue-700 font-black text-lg">
                <Eye className="h-5 w-5" />
                <span>OPTICORE PRO</span>
              </div>
              <p className="text-[11px] font-bold text-slate-700">ORDEN DE TALLER & BISELADO TÉCNICO</p>
              <p className="text-[10px] text-slate-500">Laboratorio Digital de Corte y Montaje</p>
            </div>

            <div className="text-right">
              <span className="font-mono font-black text-base px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-300 text-slate-900 inline-block">
                {order.orderNumber}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Emisión: {new Date(order.createdAt).toLocaleDateString("es-PE")}
              </p>
            </div>
          </div>

          {/* Patient and Delivery Promise Box */}
          <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Paciente</span>
              <p className="font-bold text-sm text-slate-900">
                {order.patient?.firstName} {order.patient?.lastName}
              </p>
              <p className="text-[11px] text-slate-600">
                {order.patient?.documentType || "DNI"}: {order.patient?.documentId} • Tel: {order.patient?.phone || "-"}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Fecha y Hora de Entrega</span>
              <p className="font-bold text-sm text-amber-700 font-mono">
                {order.promisedDate ? new Date(order.promisedDate).toLocaleString("es-PE") : "Urgente / Coordinar"}
              </p>
              <p className="text-[11px] text-slate-500">
                Estado: <span className="font-semibold text-slate-800">{order.status}</span>
              </p>
            </div>
          </div>

          {/* Prescription Diopters Table */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Glasses className="h-3.5 w-3.5 text-blue-600" /> Graduación Óptica para Biselado
            </h4>

            <table className="w-full text-center text-xs border border-slate-300 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 font-bold text-[10px] text-slate-700">
                <tr>
                  <th className="p-2 border-r border-b border-slate-300">OJO</th>
                  <th className="p-2 border-r border-b border-slate-300">ESFERA (SPH)</th>
                  <th className="p-2 border-r border-b border-slate-300">CILINDRO (CYL)</th>
                  <th className="p-2 border-r border-b border-slate-300">EJE (AXIS)</th>
                  <th className="p-2 border-r border-b border-slate-300">ADICIÓN (ADD)</th>
                  <th className="p-2 border-r border-b border-slate-300">DNP / DIP</th>
                  <th className="p-2 border-b border-slate-300">ALTURA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-mono text-xs font-semibold">
                <tr className="bg-white">
                  <td className="p-2 font-bold text-blue-700 border-r border-slate-300 bg-blue-50/50">OD</td>
                  <td className="p-2 border-r border-slate-300">{formatDiopter(rx?.odSphere)}</td>
                  <td className="p-2 border-r border-slate-300">{formatCylinder(rx?.odCylinder)}</td>
                  <td className="p-2 border-r border-slate-300">{rx?.odAxis !== null && rx?.odAxis !== undefined ? `${rx.odAxis}°` : "-"}</td>
                  <td className="p-2 border-r border-slate-300">{rx?.odAddition ? `+${Number(rx.odAddition).toFixed(2)}` : "-"}</td>
                  <td className="p-2 border-r border-slate-300">{rx?.npdFarOD ? `${rx.npdFarOD} mm` : rx?.pupillaryDistance ? `${rx.pupillaryDistance} mm` : "-"}</td>
                  <td className="p-2">{rx?.pupilHeightOD ? `${rx.pupilHeightOD} mm` : "-"}</td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="p-2 font-bold text-blue-700 border-r border-slate-300 bg-blue-50/50">OI</td>
                  <td className="p-2 border-r border-slate-300">{formatDiopter(rx?.osSphere)}</td>
                  <td className="p-2 border-r border-slate-300">{formatCylinder(rx?.osCylinder)}</td>
                  <td className="p-2 border-r border-slate-300">{rx?.osAxis !== null && rx?.osAxis !== undefined ? `${rx.osAxis}°` : "-"}</td>
                  <td className="p-2 border-r border-slate-300">{rx?.osAddition ? `+${Number(rx.osAddition).toFixed(2)}` : "-"}</td>
                  <td className="p-2 border-r border-slate-300">{rx?.npdFarOS ? `${rx.npdFarOS} mm` : rx?.pupillaryDistance ? `${rx.pupillaryDistance} mm` : "-"}</td>
                  <td className="p-2">{rx?.pupilHeightOS ? `${rx.pupilHeightOS} mm` : "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Technical Specifications: Frame & Lenses */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* Montura */}
            <div className="p-3 rounded-xl border border-slate-200 space-y-1.5 bg-slate-50/40">
              <p className="font-bold text-slate-800 text-[11px] uppercase border-b border-slate-200 pb-1">
                Datos de la Montura
              </p>
              <p className="font-semibold text-slate-900">
                {frame ? frame.name : order.customFrameDetails || "Montura Propia del Cliente"}
              </p>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <p>
                  <span className="font-semibold">Procedencia:</span>{" "}
                  {order.frameSource === "STORE_INVENTORY" ? "Inventario Óptica" : "Propia del Paciente"}
                </p>
                {frame && (
                  <p>
                    <span className="font-semibold">Medidas:</span> {frame.frameEyeSize || 52}□{frame.frameBridge || 18}-{frame.frameTemple || 140} mm
                  </p>
                )}
                {frame?.frameMaterial && (
                  <p><span className="font-semibold">Material:</span> {frame.frameMaterial}</p>
                )}
              </div>
            </div>

            {/* Lunas / Bisel */}
            <div className="p-3 rounded-xl border border-slate-200 space-y-1.5 bg-slate-50/40">
              <p className="font-bold text-slate-800 text-[11px] uppercase border-b border-slate-200 pb-1">
                Especificación de Cristales
              </p>
              <p className="font-semibold text-slate-900">
                {order.customLensDetails || (rx?.lensType ? `${rx.lensType} ${rx.lensMaterial || ""}` : "Monofocal Orgánico")}
              </p>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <p>
                  <span className="font-semibold">Tipo de Bisel:</span>{" "}
                  {order.bevelType === "CLASSIC_BEVEL"
                    ? "Bisel en V (Estándar)"
                    : order.bevelType === "GROOVED_RIMLESS"
                    ? "Ranurado / Al Hilo"
                    : order.bevelType === "DRILLED_RIMLESS"
                    ? "Al Aire / Taladrado"
                    : "Plano"}
                </p>
                {order.treatments && order.treatments.length > 0 && (
                  <p><span className="font-semibold">Tratamientos:</span> {order.treatments.join(", ")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          {order.instructions && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <span className="font-bold">Instrucciones Especiales de Laboratorio: </span>
              <span>{order.instructions}</span>
            </div>
          )}

          {/* Quality Checklist & Technician Sign-off */}
          <div className="pt-2 border-t-2 border-slate-200">
            <p className="font-bold text-slate-800 text-[11px] uppercase mb-2">
              Control de Calidad en Taller (Checklist)
            </p>
            <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5 p-1.5 border border-slate-200 rounded">
                <span className="h-3.5 w-3.5 border border-slate-400 rounded-xs inline-block" />
                <span>Centros y DIP</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 border border-slate-200 rounded">
                <span className="h-3.5 w-3.5 border border-slate-400 rounded-xs inline-block" />
                <span>Ejes Dioptrías</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 border border-slate-200 rounded">
                <span className="h-3.5 w-3.5 border border-slate-400 rounded-xs inline-block" />
                <span>Bisel y Montaje</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 border border-slate-200 rounded">
                <span className="h-3.5 w-3.5 border border-slate-400 rounded-xs inline-block" />
                <span>Limpieza y Ajuste</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-6 text-center text-xs">
              <div className="border-t border-slate-400 pt-1">
                <p className="font-bold text-slate-800">Técnico Biselador / Taller</p>
                <p className="text-[10px] text-slate-400">Firma y Sello</p>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <p className="font-bold text-slate-800">Control de Calidad & Entrega</p>
                <p className="text-[10px] text-slate-400">Firma de Conformidad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden in print) */}
        <div className="flex items-center justify-end gap-2 px-6 py-3 bg-slate-50 border-t border-slate-100 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cerrar
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
          >
            <Printer className="h-4 w-4" />
            Imprimir Ficha Técnica
          </Button>
        </div>
      </div>
    </div>
  );
}
