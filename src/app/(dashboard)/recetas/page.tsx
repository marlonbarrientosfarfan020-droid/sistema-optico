import Link from "next/link";
import { Eye, Plus, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPrescriptions } from "@/server/actions/prescriptions";
import { formatDate, formatDiopter, formatAxis } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RecetasPage() {
  const prescriptions = await getPrescriptions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Recetas Optométricas
          </h2>
          <p className="text-sm text-slate-500">
            Historial clínico de refracciones, agudeza visual y recomendaciones de lentes.
          </p>
        </div>
        <Link href="/recetas/nueva">
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm gap-2">
            <Plus className="h-4 w-4" />
            Nueva Refracción
          </Button>
        </Link>
      </div>

      {/* Grid of Prescriptions */}
      <div className="grid gap-4 md:grid-cols-2">
        {prescriptions.length === 0 ? (
          <Card className="col-span-2 text-center py-12">
            <CardContent>
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No hay recetas registradas
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Crea una nueva receta optométrica ingresando los valores de esfera, cilindro, eje, adición y distancias pupilares.
              </p>
              <Link href="/recetas/nueva">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" /> Crear Receta
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          prescriptions.map((rx: any) => (
            <Card key={rx.id} className="border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60">
                      {rx.code}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {formatDate(rx.date)}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[11px]">
                    {rx.lensType || "MONOFOCAL"}
                  </Badge>
                </div>
                <div className="pt-2">
                  <p className="font-semibold text-base text-slate-900 dark:text-slate-100">
                    {rx.patient?.firstName} {rx.patient?.lastName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {rx.patient?.documentType}: {rx.patient?.documentId}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {/* Refraction Table Mini */}
                <div className="rounded-lg border border-slate-200 overflow-hidden text-xs dark:border-slate-800">
                  <table className="w-full text-center">
                    <thead className="bg-slate-100/70 dark:bg-slate-800/60 font-semibold text-slate-600 dark:text-slate-300">
                      <tr>
                        <th className="py-1.5 px-2">OJO</th>
                        <th className="py-1.5 px-2">SPH</th>
                        <th className="py-1.5 px-2">CYL</th>
                        <th className="py-1.5 px-2">AXIS</th>
                        <th className="py-1.5 px-2">ADD</th>
                        <th className="py-1.5 px-2">AV</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      <tr>
                        <td className="py-1.5 px-2 font-bold text-blue-600">OD</td>
                        <td className="py-1.5 px-2">{formatDiopter(rx.odSphere)}</td>
                        <td className="py-1.5 px-2">{formatDiopter(rx.odCylinder)}</td>
                        <td className="py-1.5 px-2">{formatAxis(rx.odAxis)}</td>
                        <td className="py-1.5 px-2">{formatDiopter(rx.odAddition)}</td>
                        <td className="py-1.5 px-2 text-slate-600">{rx.odVisualAcuityFar || "-"}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2 font-bold text-emerald-600">OI</td>
                        <td className="py-1.5 px-2">{formatDiopter(rx.osSphere)}</td>
                        <td className="py-1.5 px-2">{formatDiopter(rx.osCylinder)}</td>
                        <td className="py-1.5 px-2">{formatAxis(rx.osAxis)}</td>
                        <td className="py-1.5 px-2">{formatDiopter(rx.osAddition)}</td>
                        <td className="py-1.5 px-2 text-slate-600">{rx.osVisualAcuityFar || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Measurements & Treatments */}
                <div className="flex flex-wrap items-center justify-between text-xs gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <span>DP: <strong>{rx.pupillaryDistance ? `${rx.pupillaryDistance} mm` : "-"}</strong></span>
                    <span>DNP: <strong>{rx.npdFarOD || "-"}/{rx.npdFarOS || "-"}</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(rx.treatments) &&
                      rx.treatments.slice(0, 2).map((t: string) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {t}
                        </span>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
