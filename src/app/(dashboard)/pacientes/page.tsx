import Link from "next/link";
import { UserPlus, Search, Eye, Phone, Mail, FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPatients } from "@/server/actions/patients";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const patients = await getPatients(query);

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Directorio de Pacientes
          </h2>
          <p className="text-sm text-slate-500">
            Gestión de historias clínicas, consultas optométricas y antecedentes.
          </p>
        </div>
        <Link href="/pacientes/nuevo">
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm gap-2">
            <UserPlus className="h-4 w-4" />
            Nuevo Paciente
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <form method="GET" className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Buscar por DNI, Nombres, Apellidos o Teléfono..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900"
              />
            </div>
            <Button type="submit" variant="secondary" size="default">
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Pacientes Registrados ({patients.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No se encontraron pacientes
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Comienza registrando tu primer paciente para asociarle recetas optométricas y órdenes de trabajo.
              </p>
              <Link href="/pacientes/nuevo">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" /> Registrar Paciente
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
                    <th className="py-3 px-4">PACIENTE</th>
                    <th className="py-3 px-4">DOCUMENTO</th>
                    <th className="py-3 px-4">CONTACTO</th>
                    <th className="py-3 px-4 text-center">RECETAS</th>
                    <th className="py-3 px-4 text-center">ÓRDENES TALLER</th>
                    <th className="py-3 px-4">REGISTRO</th>
                    <th className="py-3 px-4 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                            {patient.firstName[0]}
                            {patient.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold">{patient.firstName} {patient.lastName}</p>
                            <p className="text-xs text-slate-400">{patient.occupation || "Particular"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-mono text-xs">
                          {patient.documentType}: {patient.documentId}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                        {patient.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{patient.phone}</span>
                          </div>
                        )}
                        {patient.email && (
                          <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-[180px]">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span>{patient.email}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="secondary" className="font-semibold">
                          {patient._count.prescriptions}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="font-semibold">
                          {patient._count.workOrders}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {formatDate(patient.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/recetas/nueva?patientId=${patient.id}`}>
                            <Button size="sm" variant="ghost" className="h-8 text-xs text-blue-600 hover:text-blue-700">
                              <Eye className="h-3.5 w-3.5 mr-1" /> Refracción
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
