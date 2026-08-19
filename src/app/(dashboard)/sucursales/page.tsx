"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Phone,
  Mail,
  MapPin,
  Users,
  Eye,
  Glasses,
  ReceiptText,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBranches, createBranch } from "@/server/actions/branches";

export const dynamic = "force-dynamic";

export default function SucursalesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeBranchId, setActiveBranchId] = useState<string>("");

  // New branch form
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getBranches();
    setBranches(data);
    if (data.length > 0 && !activeBranchId) {
      setActiveBranchId(data[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError("El nombre y código de la sede son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await createBranch({
      name,
      code,
      address,
      phone,
      email,
    });

    setIsSubmitting(false);

    if (res.success) {
      alert("¡Sucursal creada exitosamente!");
      setName("");
      setCode("");
      setAddress("");
      setPhone("");
      setEmail("");
      setShowAddDialog(false);
      loadData();
    } else {
      setError(res.error || "No se pudo crear la sucursal.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Sedes y Sucursales
          </h2>
          <p className="text-sm text-slate-500">
            Administración de consultorios, ópticas afiliadas y sedes del grupo.
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 shadow-sm gap-2 text-white"
        >
          <Plus className="h-4 w-4" />
          Nueva Sucursal
        </Button>
      </div>

      {/* Grid of Branches */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-400 text-sm">
            Cargando sucursales...
          </div>
        ) : branches.length === 0 ? (
          <Card className="col-span-3 text-center py-12">
            <CardContent>
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No hay sucursales registradas
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Crea tu primera sede para asignar inventario, personal y arqueos de caja.
              </p>
              <Button
                onClick={() => setShowAddDialog(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" /> Agregar Sede
              </Button>
            </CardContent>
          </Card>
        ) : (
          branches.map((b) => {
            const isActive = b.id === activeBranchId;

            return (
              <Card
                key={b.id}
                className={`border transition-all ${
                  isActive
                    ? "border-blue-500 shadow-md ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {b.code}
                      </span>
                    </div>
                    {isActive ? (
                      <Badge variant="default" className="bg-blue-600 text-[10px] gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Sede Activa
                      </Badge>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveBranchId(b.id)}
                        className="text-xs text-slate-500 hover:text-blue-600 font-medium"
                      >
                        Seleccionar
                      </button>
                    )}
                  </div>
                  <CardTitle className="text-base mt-2">{b.name}</CardTitle>
                </CardHeader>

                <CardContent className="pt-4 space-y-3 text-xs">
                  {b.address && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{b.address}</span>
                    </div>
                  )}
                  {b.phone && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{b.phone}</span>
                    </div>
                  )}
                  {b.email && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{b.email}</span>
                    </div>
                  )}

                  {/* Branch Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/40">
                      <p className="text-[10px] text-slate-400">Pacientes</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {b._count?.patients ?? 0}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/40">
                      <p className="text-[10px] text-slate-400">Productos</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {b._count?.products ?? 0}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/40">
                      <p className="text-[10px] text-slate-400">Personal</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {b._count?.users ?? 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* New Branch Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Registrar Nueva Sede
              </h3>
              <button
                type="button"
                onClick={() => setShowAddDialog(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
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

            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nombre de la Sede *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sede San Isidro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Código de Identificación *
                </label>
                <input
                  type="text"
                  placeholder="Ej: SEDE-SAN-ISIDRO"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Ej: Av. Javier Prado Este 2140"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="+51 1 224-5500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Correo
                  </label>
                  <input
                    type="email"
                    placeholder="sanisidro@optica.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? "Guardando..." : "Registrar Sede"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
