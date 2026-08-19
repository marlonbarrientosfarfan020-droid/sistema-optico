"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Building,
  Users,
  Shield,
  DollarSign,
  Save,
  Plus,
  Mail,
  Phone,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUsers, createUser, updatePassword } from "@/server/actions/settings";
import { UserRole } from "@/types";

export const dynamic = "force-dynamic";

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<"EMPRESA" | "USUARIOS" | "OPTICA">("EMPRESA");
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Business settings state
  const [businessName, setBusinessName] = useState("Óptica Visión Clara & Consultorios");
  const [taxId, setTaxId] = useState("20601234567");
  const [phone, setPhone] = useState("+51 1 445-8920");
  const [email, setEmail] = useState("contacto@opticavisionclara.com");
  const [currency, setCurrency] = useState("PEN");
  const [address, setAddress] = useState("Av. Larco 1045, Miraflores, Lima");
  const [taxRate, setTaxRate] = useState(18);

  // New user form state
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newUserRole, setNewUserRole] = useState<UserRole>("OPTOMETRIST");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  // Change Password Modal State
  const [selectedUserToChangePwd, setSelectedUserToChangePwd] = useState<any | null>(null);
  const [changePasswordValue, setChangePasswordValue] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);

  const loadUsersList = async () => {
    setLoadingUsers(true);
    const data = await getUsers();
    setUsers(data);
    setLoadingUsers(false);
  };

  useEffect(() => {
    loadUsersList();
  }, []);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Configuración general de la óptica guardada exitosamente!");
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      setUserError("El nombre y correo electrónico son obligatorios.");
      return;
    }

    if (!newUserPassword.trim()) {
      setUserError("Por favor ingresa una contraseña para el usuario.");
      return;
    }

    setIsCreatingUser(true);
    setUserError(null);

    const res = await createUser({
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
      phone: newUserPhone,
    });

    setIsCreatingUser(false);

    if (res.success) {
      alert("¡Usuario registrado exitosamente con su contraseña personalizada!");
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserPhone("");
      loadUsersList();
    } else {
      setUserError(res.error || "No se pudo registrar el usuario.");
    }
  };

  const handleConfirmPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserToChangePwd) return;

    if (!changePasswordValue.trim()) {
      setChangePasswordError("Por favor escribe la nueva contraseña.");
      return;
    }

    setIsChangingPassword(true);
    setChangePasswordError(null);

    const res = await updatePassword(selectedUserToChangePwd.id, changePasswordValue.trim());

    setIsChangingPassword(false);

    if (res.success) {
      alert(`¡Contraseña actualizada con éxito para ${selectedUserToChangePwd.name}!`);
      setSelectedUserToChangePwd(null);
      setChangePasswordValue("");
    } else {
      setChangePasswordError(res.error || "Error al actualizar la contraseña.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Configuración del Sistema
        </h2>
        <p className="text-sm text-slate-500">
          Ajustes de la empresa, datos fiscales, moneda y administración de usuarios con contraseñas seguras.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("EMPRESA")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "EMPRESA"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          <Building className="h-4 w-4" />
          Datos de la Óptica / Facturación
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("USUARIOS")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "USUARIOS"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          <Users className="h-4 w-4" />
          Usuarios y Roles ({users.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("OPTICA")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "OPTICA"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          <Eye className="h-4 w-4" />
          Parámetros Optométricos
        </button>
      </div>

      {/* Tab 1: Datos de la Empresa */}
      {activeTab === "EMPRESA" && (
        <form onSubmit={handleSaveCompany} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Información Comercial y Fiscal</CardTitle>
              <CardDescription>
                Estos datos aparecerán en las boletas, tickets de venta y recetas impresas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Razón Social / Nombre Comercial *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    RUC / Identificación Fiscal (NIT / RUT) *
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Teléfono Central
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Correo Electrónico de Contacto
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Moneda Principal
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="PEN">PEN (S/ - Sol Peruano)</option>
                    <option value="USD">USD ($ - Dólar Estadounidense)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="COP">COP ($ - Peso Colombiano)</option>
                    <option value="MXN">MXN ($ - Peso Mexicano)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Dirección Principal
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Save className="h-4 w-4" />
              Guardar Configuración
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Usuarios y Roles */}
      {activeTab === "USUARIOS" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create User Form */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="h-4 w-4 text-blue-600" />
                  Registrar Nuevo Usuario
                </CardTitle>
                <CardDescription>
                  Ingresa los accesos con credenciales seguras para el personal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userError && (
                  <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{userError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Lic. Claudia Morales"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Correo Electrónico (Login) *
                    </label>
                    <input
                      type="email"
                      placeholder="claudia@opticacore.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Contraseña de Acceso *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Ej: 1234 o contraseña segura"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        className="w-full h-9 pl-3 pr-9 rounded-lg border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Rol / Perfil *
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="OPTOMETRIST">Optometrista (Escribe recetas)</option>
                      <option value="SALES_AGENT">Asesor de Ventas / Cajero</option>
                      <option value="LAB_TECHNICIAN">Técnico de Laboratorio / Taller</option>
                      <option value="ADMIN">Administrador General</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      placeholder="+51 987 654 321"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isCreatingUser}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {isCreatingUser ? "Registrando..." : "Crear Usuario"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Usuarios Activos ({users.length})</CardTitle>
                <CardDescription>
                  Gestiona los roles y actualiza contraseñas de acceso al sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="text-center py-8 text-slate-400 text-sm">Cargando usuarios...</div>
                ) : (
                  <div className="space-y-3">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {u.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                              {u.name}
                            </p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              u.role === "ADMIN"
                                ? "destructive"
                                : u.role === "OPTOMETRIST"
                                ? "default"
                                : u.role === "LAB_TECHNICIAN"
                                ? "warning"
                                : "info"
                            }
                            className="text-[10px]"
                          >
                            {u.role}
                          </Badge>

                          {/* Botón Cambiar Contraseña */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUserToChangePwd(u);
                              setChangePasswordValue("");
                              setChangePasswordError(null);
                            }}
                            className="h-8 px-2.5 text-xs text-slate-700 hover:text-blue-600 hover:border-blue-300 gap-1.5"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Contraseña</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: Parámetros Optométricos */}
      {activeTab === "OPTICA" && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Parámetros Optométricos y Valores por Defecto</CardTitle>
            <CardDescription>
              Configura los valores sugeridos al abrir el formulario de refracción OD/OI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Vigencia de Receta sugerida
                </label>
                <select className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white">
                  <option>1 año (12 meses)</option>
                  <option>6 meses</option>
                  <option>2 años</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Paso de Esfera / Cilindro
                </label>
                <select className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white">
                  <option>0.25 Dioptrías (Estándar)</option>
                  <option>0.12 Dioptrías (Digital)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Material de Luna por Defecto
                </label>
                <select className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white">
                  <option>Policarbonato (1.59)</option>
                  <option>Orgánico CR-39</option>
                  <option>Alto Índice 1.67</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Save className="h-4 w-4" />
                Guardar Parámetros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal: Cambiar Contraseña */}
      {selectedUserToChangePwd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center dark:bg-amber-950/50">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Cambiar Contraseña
                  </h3>
                  <p className="text-xs text-slate-500">{selectedUserToChangePwd.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserToChangePwd(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {changePasswordError && (
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{changePasswordError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmPasswordChange} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nueva Contraseña para el Usuario *
                </label>
                <div className="relative">
                  <input
                    type={showChangePassword ? "text" : "password"}
                    placeholder="Escribe la nueva contraseña (Ej: 1234)"
                    value={changePasswordValue}
                    onChange={(e) => setChangePasswordValue(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 rounded-lg border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showChangePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUserToChangePwd(null)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isChangingPassword}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  {isChangingPassword ? "Guardando..." : "Actualizar Contraseña"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
