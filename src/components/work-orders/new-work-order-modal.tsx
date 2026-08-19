"use client";

import { useState, useEffect } from "react";
import {
  Wrench,
  X,
  User,
  Glasses,
  Calendar,
  Clock,
  Save,
  Plus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDirectWorkOrder } from "@/server/actions/work-orders";
import { getPatients } from "@/server/actions/patients";

interface NewWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewWorkOrderModal({ isOpen, onClose, onSuccess }: NewWorkOrderModalProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(false);

  // Rx OD
  const [odSphere, setOdSphere] = useState<number | undefined>(0);
  const [odCylinder, setOdCylinder] = useState<number | undefined>(0);
  const [odAxis, setOdAxis] = useState<number | undefined>(undefined);
  const [odAddition, setOdAddition] = useState<number | undefined>(undefined);
  const [npdFarOD, setNpdFarOD] = useState<number | undefined>(31.5);
  const [pupilHeightOD, setPupilHeightOD] = useState<number | undefined>(undefined);

  // Rx OI
  const [osSphere, setOsSphere] = useState<number | undefined>(0);
  const [osCylinder, setOsCylinder] = useState<number | undefined>(0);
  const [osAxis, setOsAxis] = useState<number | undefined>(undefined);
  const [osAddition, setOsAddition] = useState<number | undefined>(undefined);
  const [npdFarOS, setNpdFarOS] = useState<number | undefined>(31.5);
  const [pupilHeightOS, setPupilHeightOS] = useState<number | undefined>(undefined);

  // Lenses & Material
  const [lensType, setLensType] = useState("MONOFOCAL");
  const [lensMaterial, setLensMaterial] = useState("ORGANIC_CR39");
  const [treatments, setTreatments] = useState<string[]>(["Filtro BlueBlock UV400", "Antirreflejo Verde"]);
  const [bevelType, setBevelType] = useState<"CLASSIC_BEVEL" | "GROOVED_RIMLESS" | "DRILLED_RIMLESS" | "FLAT">("CLASSIC_BEVEL");

  // Frame
  const [frameSource, setFrameSource] = useState<"STORE_INVENTORY" | "CUSTOMER_OWN_FRAME">("STORE_INVENTORY");
  const [customFrameDetails, setCustomFrameDetails] = useState("");

  // Dates & Instructions
  const [promisedDate, setPromisedDate] = useState("");
  const [instructions, setInstructions] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load patients on mount
  useEffect(() => {
    async function load() {
      setLoadingPatients(true);
      const res = await getPatients();
      setPatients(res);
      if (res.length > 0 && !selectedPatientId) {
        setSelectedPatientId(res[0].id);
      }
      setLoadingPatients(false);

      // Default promised date: 2 days from now at 17:00
      const d = new Date();
      d.setDate(d.getDate() + 2);
      d.setHours(17, 0, 0, 0);
      const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setPromisedDate(isoLocal);
    }
    if (isOpen) {
      load();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTreatmentToggle = (t: string) => {
    if (treatments.includes(t)) {
      setTreatments(treatments.filter((item) => item !== t));
    } else {
      setTreatments([...treatments, t]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setError("Por favor selecciona un paciente.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await createDirectWorkOrder({
      patientId: selectedPatientId,
      odSphere: odSphere !== undefined ? Number(odSphere) : null,
      odCylinder: odCylinder !== undefined ? Number(odCylinder) : null,
      odAxis: odAxis !== undefined ? Number(odAxis) : null,
      odAddition: odAddition !== undefined ? Number(odAddition) : null,
      npdFarOD: npdFarOD !== undefined ? Number(npdFarOD) : null,
      pupilHeightOD: pupilHeightOD !== undefined ? Number(pupilHeightOD) : null,

      osSphere: osSphere !== undefined ? Number(osSphere) : null,
      osCylinder: osCylinder !== undefined ? Number(osCylinder) : null,
      osAxis: osAxis !== undefined ? Number(osAxis) : null,
      osAddition: osAddition !== undefined ? Number(osAddition) : null,
      npdFarOS: npdFarOS !== undefined ? Number(npdFarOS) : null,
      pupilHeightOS: pupilHeightOS !== undefined ? Number(pupilHeightOS) : null,

      lensType,
      lensMaterial,
      treatments,
      bevelType,

      frameSource,
      customFrameDetails: customFrameDetails || "Montura indicada en orden",
      promisedDate: promisedDate ? new Date(promisedDate).toISOString() : null,
      instructions: instructions || null,
    });

    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || "No se pudo registrar la orden de taller.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Nueva Orden de Taller / Biselado
              </h3>
              <p className="text-xs text-slate-500">
                Ingresa una orden directa con graduación técnica y especificaciones de corte
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Selector de Paciente */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Paciente Asignado *
            </label>
            {loadingPatients ? (
              <div className="p-2 text-slate-400">Cargando pacientes...</div>
            ) : (
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                required
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="">-- Seleccionar Paciente --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.documentType}: {p.documentId})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Graduación Técnica (OD / OI) */}
          <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40 space-y-3">
            <h4 className="font-bold text-blue-900 dark:text-blue-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Glasses className="h-4 w-4 text-blue-600" /> Prescripción Técnica para Laboratorio
            </h4>

            {/* Ojo Derecho (OD) */}
            <div>
              <span className="font-bold text-[11px] text-blue-700 block mb-1">Ojo Derecho (OD)</span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block">Esfera (SPH)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={odSphere ?? ""}
                    onChange={(e) => setOdSphere(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0.00"
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-center font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Cilindro (CYL)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={odCylinder ?? ""}
                    onChange={(e) => setOdCylinder(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0.00"
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-center font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Eje (°)</label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={odAxis ?? ""}
                    onChange={(e) => setOdAxis(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0-180"
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-center font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Adición (ADD)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={odAddition ?? ""}
                    onChange={(e) => setOdAddition(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="+2.00"
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-center font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">DNP (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={npdFarOD ?? ""}
                    onChange={(e) => setNpdFarOD(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="31.5"
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-center font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Altura (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={pupilHeightOD ?? ""}
                    onChange={(e) => setPupilHeightOD(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="18.0"
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-center font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Ojo Izquierdo (OI) */}
            <div>
              <span className="font-bold text-[11px] text-blue-700 block mb-1">Ojo Izquierdo (OI)</span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block">Esfera (SPH)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={osSphere ?? ""}
                    onChange={(e) => setOsSphere(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0.00"
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-center font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Cilindro (CYL)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={osCylinder ?? ""}
                    onChange={(e) => setOsCylinder(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0.00"
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-center font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Eje (°)</label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={osAxis ?? ""}
                    onChange={(e) => setOsAxis(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0-180"
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-center font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Adición (ADD)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={osAddition ?? ""}
                    onChange={(e) => setOsAddition(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="+2.00"
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-center font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">DNP (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={npdFarOS ?? ""}
                    onChange={(e) => setNpdFarOS(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="31.5"
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-center font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Altura (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={pupilHeightOS ?? ""}
                    onChange={(e) => setPupilHeightOS(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="18.0"
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-center font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Lunas & Tipo de Bisel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Tipo de Luna
              </label>
              <select
                value={lensType}
                onChange={(e) => setLensType(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs"
              >
                <option value="MONOFOCAL">Monofocal</option>
                <option value="BIFOCAL">Bifocal Flat-Top</option>
                <option value="PROGRESSIVE">Progresivo Digital / Freeform</option>
                <option value="OCCUPATIONAL">Ocupacional / Oficina</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Material de Cristales
              </label>
              <select
                value={lensMaterial}
                onChange={(e) => setLensMaterial(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs"
              >
                <option value="ORGANIC_CR39">Orgánico CR-39</option>
                <option value="POLYCARBONATE">Policarbonato (Alto Impacto)</option>
                <option value="HIGH_INDEX_1_60">Alto Índice 1.60</option>
                <option value="HIGH_INDEX_1_67">Alto Índice 1.67 (Ultra Delgado)</option>
                <option value="HIGH_INDEX_1_74">Alto Índice 1.74</option>
                <option value="TRIVEX">Trivex</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Tipo de Bisel
              </label>
              <select
                value={bevelType}
                onChange={(e) => setBevelType(e.target.value as any)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs"
              >
                <option value="CLASSIC_BEVEL">Bisel en V (Clásico)</option>
                <option value="GROOVED_RIMLESS">Ranurado / Al Hilo</option>
                <option value="DRILLED_RIMLESS">Al Aire / Taladrado</option>
                <option value="FLAT">Plano</option>
              </select>
            </div>
          </div>

          {/* 4. Tratamientos */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Tratamientos Incluidos
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Filtro BlueBlock UV400",
                "Antirreflejo Verde",
                "Fotocromático / Transitions",
                "Polarizado",
                "Hidrofóbico",
              ].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTreatmentToggle(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    treatments.includes(t)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {treatments.includes(t) ? `✓ ${t}` : `+ ${t}`}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Datos de la Montura */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Procedencia de Montura
              </label>
              <select
                value={frameSource}
                onChange={(e) => setFrameSource(e.target.value as any)}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs"
              >
                <option value="STORE_INVENTORY">Inventario de la Óptica</option>
                <option value="CUSTOMER_OWN_FRAME">Montura Propia del Cliente</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Modelo / Color de Montura
              </label>
              <input
                type="text"
                value={customFrameDetails}
                onChange={(e) => setCustomFrameDetails(e.target.value)}
                placeholder="Ej: Ray-Ban Clubmaster Negro/Dorado RB5154"
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* 6. Fecha de Entrega e Instrucciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Fecha y Hora Compromiso de Entrega *
              </label>
              <input
                type="datetime-local"
                value={promisedDate}
                onChange={(e) => setPromisedDate(e.target.value)}
                required
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Instrucciones para el Biselador
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Ej: Bisel fino, cuidar antireflejo, montaje urgente"
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Generando OT..." : "Crear Orden de Taller"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
