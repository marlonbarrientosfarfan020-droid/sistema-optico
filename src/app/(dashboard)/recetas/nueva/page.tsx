"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Save, Eye, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PrescriptionGridInput } from "@/components/prescriptions/prescription-grid-input";
import { prescriptionSchema, PrescriptionFormData } from "@/lib/validations/prescription";
import { createPrescription } from "@/server/actions/prescriptions";
import { getPatients } from "@/server/actions/patients";

function NuevaRecetaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatientId = searchParams.get("patientId") || "";

  const [patients, setPatients] = useState<any[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: preselectedPatientId,
      lensType: "MONOFOCAL",
      lensMaterial: "POLYCARBONATE",
      treatments: ["ANTIREFLECTIVE", "BLUE_BLOCK"],
      usage: "Permanente",
    },
  });

  useEffect(() => {
    async function loadPatients() {
      const data = await getPatients();
      setPatients(data);
      if (preselectedPatientId) {
        setValue("patientId", preselectedPatientId);
      }
    }
    loadPatients();
  }, [preselectedPatientId, setValue]);

  const onSubmit = async (data: PrescriptionFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    const res = await createPrescription(data);
    setIsSubmitting(false);

    if (res.success && res.data) {
      router.push(`/recetas`);
      router.refresh();
    } else {
      setServerError(res.error || "Ocurrió un error al guardar la receta optométrica.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/recetas">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Nueva Consulta Optométrica / Refracción
            </h2>
            <p className="text-sm text-slate-500">
              Registra la graduación óptica OD/OI, distancias pupilares y recomendación de cristales.
            </p>
          </div>
        </div>
      </div>

      {serverError && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 1. Selección de Paciente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">1. Selección del Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Paciente *
                </label>
                <select
                  {...register("patientId")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="">-- Seleccionar Paciente --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.documentType}: {p.documentId})
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="text-xs text-red-500 mt-1">{errors.patientId.message}</p>
                )}
              </div>

              <div className="flex items-end">
                <Link href="/pacientes/nuevo" className="w-full">
                  <Button type="button" variant="outline" className="w-full">
                    + Registrar Nuevo Paciente
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Refracción Subjetiva y Medidas Pupilares (Grilla Óptica) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">2. Refracción y Parámetros Ópticos</CardTitle>
                <CardDescription>
                  Ingresa Esfera, Cilindro, Eje, Adición y Distancia Pupilar.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PrescriptionGridInput
              register={register}
              setValue={setValue}
              watch={watch}
            />
          </CardContent>
        </Card>

        {/* 3. Recomendación de Cristales, Materiales y Tratamientos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">3. Recomendación Óptica y Tratamientos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Tipo de Luna / Diseño
                </label>
                <select
                  {...register("lensType")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="MONOFOCAL">Monofocal</option>
                  <option value="BIFOCAL">Bifocal (Flat-Top / Invisible)</option>
                  <option value="PROGRESSIVE">Progresivo / Multifocal</option>
                  <option value="OCCUPATIONAL">Ocupacional / Degresivo</option>
                  <option value="CONTACT_LENS">Lente de Contacto</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Material de la Luna
                </label>
                <select
                  {...register("lensMaterial")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="ORGANIC_CR39">Orgánico CR-39 (1.50)</option>
                  <option value="POLYCARBONATE">Policarbonato (1.59)</option>
                  <option value="HIGH_INDEX_1_60">Alto Índice 1.60</option>
                  <option value="HIGH_INDEX_1_67">Alto Índice 1.67 (Ultra Delgado)</option>
                  <option value="HIGH_INDEX_1_74">Alto Índice 1.74 (Extra Plano)</option>
                  <option value="MINERAL_GLASS">Cristal Mineral / Vidrio</option>
                  <option value="TRIVEX">Trivex</option>
                  <option value="SILICONE_HYDROGEL">Hidrogel de Silicona</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Uso Recomendado
                </label>
                <input
                  type="text"
                  placeholder="Ej: Permanente, Computadora, Conducción"
                  {...register("usage")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Observaciones Clínicas y Diagnóstico
              </label>
              <textarea
                rows={3}
                placeholder="Observaciones de adaptación, control a 6 meses, recomendaciones especiales..."
                {...register("notes")}
                className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/recetas">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 shadow-sm gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Guardando..." : "Guardar Receta Optométrica"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NuevaRecetaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Cargando formulario...</div>}>
      <NuevaRecetaForm />
    </Suspense>
  );
}
