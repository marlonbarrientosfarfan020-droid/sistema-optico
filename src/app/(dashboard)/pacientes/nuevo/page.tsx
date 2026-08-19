"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Save, User, Activity, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { patientSchema, PatientFormData } from "@/lib/validations/patient";
import { createPatient } from "@/server/actions/patients";

export default function NuevoPacientePage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      documentType: "DNI",
      gender: "PREFER_NOT_TO_SAY",
      medicalHistory: {
        hasDiabetes: false,
        hasHypertension: false,
        hasGlaucoma: false,
        hasCataracts: false,
        allergies: "",
        familyHistory: "",
        notes: "",
      },
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    const res = await createPatient(data);
    setIsSubmitting(false);

    if (res.success && res.data) {
      router.push(`/pacientes`);
      router.refresh();
    } else {
      setServerError(res.error || "Ocurrió un error al guardar el paciente.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/pacientes">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Registrar Nuevo Paciente
            </h2>
            <p className="text-sm text-slate-500">
              Completa los datos de filiación e historia médica del paciente.
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
        {/* 1. Datos Personales */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-blue-600">
              <User className="h-5 w-5" />
              <CardTitle className="text-base text-slate-900 dark:text-slate-100">
                1. Datos de Filiación
              </CardTitle>
            </div>
            <CardDescription>
              Información general y datos de contacto del paciente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Tipo de Documento *
                </label>
                <select
                  {...register("documentType")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="DNI">DNI (Doc. Nacional de Identidad)</option>
                  <option value="CE">Carnet de Extranjería</option>
                  <option value="PASSPORT">Pasaporte</option>
                  <option value="RUC">RUC</option>
                  <option value="OTHER">Otro</option>
                </select>
                {errors.documentType && (
                  <p className="text-xs text-red-500 mt-1">{errors.documentType.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Número de Documento *
                </label>
                <input
                  type="text"
                  placeholder="Ej: 47891234"
                  {...register("documentId")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                />
                {errors.documentId && (
                  <p className="text-xs text-red-500 mt-1">{errors.documentId.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Nombres *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Carlos"
                  {...register("firstName")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Apellidos *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Mendoza Silva"
                  {...register("lastName")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="Ej: +51 987 654 321"
                  {...register("phone")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="Ej: paciente@correo.com"
                  {...register("email")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Ocupación / Profesión
                </label>
                <input
                  type="text"
                  placeholder="Ej: Diseñador / Conductor"
                  {...register("occupation")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Dirección
              </label>
              <input
                type="text"
                placeholder="Ej: Av. Larco 1045, Dpto 501"
                {...register("address")}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. Antecedentes Médicos y Clínicos */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <Activity className="h-5 w-5" />
              <CardTitle className="text-base text-slate-900 dark:text-slate-100">
                2. Antecedentes Clínicos y Oculares
              </CardTitle>
            </div>
            <CardDescription>
              Condiciones de salud relevantes para la adaptación óptica y prescripción.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
              <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  {...register("medicalHistory.hasDiabetes")}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Diabetes</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  {...register("medicalHistory.hasHypertension")}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Hipertensión</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  {...register("medicalHistory.hasGlaucoma")}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Glaucoma</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  {...register("medicalHistory.hasCataracts")}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Cataratas</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Alergias o Sensibilidades
                </label>
                <input
                  type="text"
                  placeholder="Ej: Alergia a soluciones de contacto, polen..."
                  {...register("medicalHistory.allergies")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Observaciones / Motivo de Consulta
                </label>
                <input
                  type="text"
                  placeholder="Ej: Dolor de cabeza, fatiga visual por computadora..."
                  {...register("medicalHistory.notes")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/pacientes">
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
            {isSubmitting ? "Guardando..." : "Guardar Paciente"}
          </Button>
        </div>
      </form>
    </div>
  );
}
