"use client";

import React from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { PrescriptionFormData } from "@/lib/validations/prescription";
import { transposePrescription } from "@/lib/utils";
import { RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrescriptionGridInputProps {
  register: UseFormRegister<PrescriptionFormData>;
  setValue: UseFormSetValue<PrescriptionFormData>;
  watch: UseFormWatch<PrescriptionFormData>;
}

export function PrescriptionGridInput({
  register,
  setValue,
  watch,
}: PrescriptionGridInputProps) {
  const odSphere = watch("odSphere");
  const odCylinder = watch("odCylinder");
  const odAxis = watch("odAxis");

  const osSphere = watch("osSphere");
  const osCylinder = watch("osCylinder");
  const osAxis = watch("osAxis");

  const handleTransposeOD = () => {
    if (odCylinder) {
      const result = transposePrescription(
        Number(odSphere || 0),
        Number(odCylinder || 0),
        Number(odAxis || 0)
      );
      setValue("odSphere", result.sph);
      setValue("odCylinder", result.cyl);
      setValue("odAxis", result.axis);
    }
  };

  const handleTransposeOS = () => {
    if (osCylinder) {
      const result = transposePrescription(
        Number(osSphere || 0),
        Number(osCylinder || 0),
        Number(osAxis || 0)
      );
      setValue("osSphere", result.sph);
      setValue("osCylinder", result.cyl);
      setValue("osAxis", result.axis);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
              <th className="py-3 px-4 w-28 text-center">OJO</th>
              <th className="py-3 px-3 text-center">ESFERA (SPH)</th>
              <th className="py-3 px-3 text-center">CILINDRO (CYL)</th>
              <th className="py-3 px-3 text-center">EJE (AXIS)</th>
              <th className="py-3 px-3 text-center">ADICIÓN (ADD)</th>
              <th className="py-3 px-3 text-center">PRISMA / BASE</th>
              <th className="py-3 px-3 text-center">AV LEJOS</th>
              <th className="py-3 px-3 text-center">AV CERCA</th>
              <th className="py-3 px-3 text-center">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* OJO DERECHO (OD) */}
            <tr className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20">
              <td className="py-3 px-4 font-bold text-blue-700 dark:text-blue-400 text-center">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold dark:bg-blue-900/60">
                  OD (Derecho)
                </div>
              </td>
              <td className="p-2">
                <input
                  type="number"
                  step="0.25"
                  placeholder="+0.00"
                  className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  {...register("odSphere")}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  step="0.25"
                  placeholder="-0.00"
                  className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  {...register("odCylinder")}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  min="0"
                  max="180"
                  placeholder="0° - 180°"
                  className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  {...register("odAxis")}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="4.00"
                  placeholder="+0.00"
                  className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  {...register("odAddition")}
                />
              </td>
              <td className="p-2">
                <div className="flex gap-1">
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Δ"
                    className="w-1/2 text-center font-mono text-sm py-1.5 px-1 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                    {...register("odPrism")}
                  />
                  <input
                    type="text"
                    placeholder="Base"
                    className="w-1/2 text-center text-xs py-1.5 px-1 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                    {...register("odBase")}
                  />
                </div>
              </td>
              <td className="p-2">
                <input
                  type="text"
                  placeholder="20/20"
                  className="w-full text-center text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  {...register("odVisualAcuityFar")}
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  placeholder="20/20"
                  className="w-full text-center text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  {...register("odVisualAcuityNear")}
                />
              </td>
              <td className="p-2 text-center">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleTransposeOD}
                  title="Transponer fórmula óptica OD"
                  className="text-xs h-8 px-2 text-slate-600 hover:text-blue-600"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Transponer
                </Button>
              </td>
            </tr>

            {/* OJO IZQUIERDO (OI) */}
            <tr className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20">
              <td className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-400 text-center">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold dark:bg-emerald-900/60">
                  OI (Izquierdo)
                </div>
              </td>
              <td className="p-2">
                <input
                  type="number"
                  step="0.25"
                  placeholder="+0.00"
                  className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  {...register("osSphere")}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  step="0.25"
                  placeholder="-0.00"
                  className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  {...register("osCylinder")}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  min="0"
                  max="180"
                  placeholder="0° - 180°"
                  className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  {...register("osAxis")}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="4.00"
                  placeholder="+0.00"
                  className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  {...register("osAddition")}
                />
              </td>
              <td className="p-2">
                <div className="flex gap-1">
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Δ"
                    className="w-1/2 text-center font-mono text-sm py-1.5 px-1 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                    {...register("osPrism")}
                  />
                  <input
                    type="text"
                    placeholder="Base"
                    className="w-1/2 text-center text-xs py-1.5 px-1 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                    {...register("osBase")}
                  />
                </div>
              </td>
              <td className="p-2">
                <input
                  type="text"
                  placeholder="20/20"
                  className="w-full text-center text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  {...register("osVisualAcuityFar")}
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  placeholder="20/20"
                  className="w-full text-center text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  {...register("osVisualAcuityNear")}
                />
              </td>
              <td className="p-2 text-center">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleTransposeOS}
                  title="Transponer fórmula óptica OI"
                  className="text-xs h-8 px-2 text-slate-600 hover:text-emerald-600"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Transponer
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Medidas Pupilares y Centrado */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-xl bg-slate-50/80 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-800">
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
            DP Total (mm)
          </label>
          <input
            type="number"
            step="0.5"
            placeholder="62.0"
            className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
            {...register("pupillaryDistance")}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
            DNP OD Lejos (mm)
          </label>
          <input
            type="number"
            step="0.5"
            placeholder="31.0"
            className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
            {...register("npdFarOD")}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
            DNP OI Lejos (mm)
          </label>
          <input
            type="number"
            step="0.5"
            placeholder="31.0"
            className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
            {...register("npdFarOS")}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
            Alt. Pupilar OD (mm)
          </label>
          <input
            type="number"
            step="0.5"
            placeholder="19.0"
            className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
            {...register("pupilHeightOD")}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
            Alt. Pupilar OI (mm)
          </label>
          <input
            type="number"
            step="0.5"
            placeholder="19.0"
            className="w-full text-center font-mono text-sm py-1.5 px-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
            {...register("pupilHeightOS")}
          />
        </div>
      </div>
    </div>
  );
}
