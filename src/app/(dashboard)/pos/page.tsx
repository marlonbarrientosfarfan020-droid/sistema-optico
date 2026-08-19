"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Plus,
  Trash2,
  DollarSign,
  User,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Glasses,
  Search,
  Printer,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getPatients } from "@/server/actions/patients";
import { getProducts } from "@/server/actions/inventory";
import { createSale } from "@/server/actions/pos";
import { SaleSuccessReceiptModal } from "@/components/pos/sale-success-receipt-modal";

export default function PosPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Cart State
  const [cartItems, setCartItems] = useState<
    Array<{
      productId?: string;
      description: string;
      quantity: number;
      unitPrice: number;
      discount: number;
      total: number;
    }>
  >([]);

  // Payment State
  const [paymentType, setPaymentType] = useState<"FULL_PAYMENT" | "ADVANCE_DEPOSIT">("ADVANCE_DEPOSIT");
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "YAPE_PLIN"
  >("CASH");
  const [cashReceived, setCashReceived] = useState<number | undefined>(undefined);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [saleNotes, setSaleNotes] = useState("");

  // Automatic Print Toggle (Enabled by default)
  const [autoPrintReceipt, setAutoPrintReceipt] = useState<boolean>(true);

  // Success Modal State
  const [completedSale, setCompletedSale] = useState<any | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [pts, prods] = await Promise.all([getPatients(), getProducts()]);
      setPatients(pts);
      setProducts(prods);
    }
    loadData();
  }, []);

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.unitPrice,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          description: product.name,
          quantity: 1,
          unitPrice: product.salePrice,
          discount: 0,
          total: product.salePrice,
        },
      ];
    });
  };

  const addCustomItem = () => {
    setCartItems((prev) => [
      ...prev,
      {
        description: "Lunas Progresivas / Taller",
        quantity: 1,
        unitPrice: 150,
        discount: 0,
        total: 150,
      },
    ]);
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItemQty = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity, total: quantity * item.unitPrice - item.discount }
          : item
      )
    );
  };

  const updateItemPrice = (index: number, unitPrice: number) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, unitPrice, total: item.quantity * unitPrice - item.discount }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);
  const totalAmount = subtotal;
  const actualPaid =
    paymentType === "FULL_PAYMENT" ? totalAmount : Math.min(depositAmount, totalAmount);
  const balanceDue = Math.max(0, totalAmount - actualPaid);

  const handleCheckout = async () => {
    if (!selectedPatientId) {
      setServerError("Debes seleccionar un paciente para registrar la venta.");
      return;
    }
    if (cartItems.length === 0) {
      setServerError("El carrito está vacío.");
      return;
    }
    if (paymentType === "ADVANCE_DEPOSIT" && depositAmount <= 0) {
      setServerError("Ingresa el monto del anticipo / seña inicial.");
      return;
    }

    setIsProcessing(true);
    setServerError(null);

    const res = await createSale({
      patientId: selectedPatientId,
      items: cartItems,
      subtotal,
      discount: 0,
      tax: 0,
      totalAmount,
      notes: saleNotes,
      initialPayment:
        actualPaid > 0
          ? {
              amount: actualPaid,
              paymentMethod,
              paymentType:
                balanceDue > 0 ? "ADVANCE_DEPOSIT" : "FULL_PAYMENT",
              referenceNumber,
              notes:
                balanceDue > 0
                  ? `Seña/Anticipo. Saldo restante: ${formatCurrency(balanceDue)}`
                  : "Pago total al contado",
            }
          : null,
    });

    setIsProcessing(false);

    if (res.success && res.data) {
      // Find patient details for receipt
      const currentPatient = patients.find((p) => p.id === selectedPatientId);
      const saleWithPatient = {
        ...res.data,
        patient: res.data.patient || currentPatient,
        items: res.data.items || cartItems,
      };

      setCompletedSale(saleWithPatient);
    } else {
      setServerError(res.error || "Ocurrió un error al procesar la venta.");
    }
  };

  const handleResetSale = () => {
    setCompletedSale(null);
    setCartItems([]);
    setSelectedPatientId("");
    setDepositAmount(0);
    setCashReceived(undefined);
    setReferenceNumber("");
    setSaleNotes("");
    setServerError(null);
  };

  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Punto de Venta (POS) y Facturación
        </h2>
        <p className="text-sm text-slate-500">
          Cobro en caja, registro de anticipos/señas e impresión inmediata de tickets térmicos de 80mm.
        </p>
      </div>

      {serverError && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient & Product Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Patient Selector */}
          <Card className="rounded-2xl border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                1. Selección de Paciente / Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
              >
                <option value="">-- Seleccionar Paciente --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.documentType}: {p.documentId})
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Quick Product Grid */}
          <Card className="rounded-2xl border-slate-200 shadow-xs">
            <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Glasses className="h-4 w-4 text-blue-600" />
                2. Catálogo de Monturas y Lunas
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-48 sm:w-56">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addCustomItem}
                  className="text-xs h-7 gap-1 rounded-lg"
                >
                  <Plus className="h-3 w-3" />
                  + Ítem Taller
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {filteredProducts.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => addToCart(prod)}
                    className="flex items-center gap-3 text-left p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all dark:border-slate-800 dark:bg-slate-900 group"
                  >
                    {prod.imageUrl ? (
                      <div className="h-14 w-14 rounded-lg overflow-hidden border border-slate-200 bg-white dark:border-slate-700 shrink-0 shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-lg border border-slate-200 bg-white text-slate-400 flex items-center justify-center shrink-0 dark:border-slate-800 dark:bg-slate-950">
                        <Glasses className="h-6 w-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-blue-600 truncate">{prod.sku}</span>
                        <span className="text-[11px] font-semibold text-slate-500">{prod.stock} un.</span>
                      </div>
                      <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                        {prod.name}
                      </p>
                      <p className="font-bold text-xs text-emerald-600 mt-1 font-mono">
                        {formatCurrency(prod.salePrice)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Cart, Payments & Balance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-2xl border-slate-200 shadow-md">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Detalle de la Venta ({cartItems.length})
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Items in Cart */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    El carrito está vacío. Selecciona productos del catálogo.
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-xs"
                    >
                      <div className="flex-1 pr-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => {
                            const newDesc = e.target.value;
                            setCartItems((prev) =>
                              prev.map((it, i) => (i === index ? { ...it, description: newDesc } : it))
                            );
                          }}
                          className="font-medium text-slate-900 dark:text-slate-100 bg-transparent border-none p-0 focus:ring-0 w-full"
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-slate-500">Cant:</span>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItemQty(index, Number(e.target.value))}
                            className="w-12 text-center rounded border border-slate-200 bg-white py-0.5"
                          />
                          <span className="text-slate-500">x</span>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItemPrice(index, Number(e.target.value))}
                            className="w-16 text-center rounded border border-slate-200 bg-white py-0.5 font-mono"
                          />
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-2">
                        <span className="font-bold text-sm font-mono text-slate-900 dark:text-slate-100">
                          {formatCurrency(item.total)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(index)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total Summary */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-base font-bold text-slate-900 dark:text-slate-100">
                  <span>Total a Pagar:</span>
                  <span className="font-mono text-lg text-blue-600">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Advance Deposit / Seña Calculator */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-3">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider dark:text-slate-300">
                  Modalidad de Pago
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType("ADVANCE_DEPOSIT")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      paymentType === "ADVANCE_DEPOSIT"
                        ? "bg-amber-100 text-amber-800 border-amber-300 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Anticipo / Seña
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType("FULL_PAYMENT")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      paymentType === "FULL_PAYMENT"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Pago Completo (100%)
                  </button>
                </div>

                {paymentType === "ADVANCE_DEPOSIT" && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Monto de Anticipo / Seña Recibida
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={depositAmount || ""}
                      placeholder="Ej: 50"
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full text-center font-mono font-bold text-base py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* Balances Display */}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500">Abono Inicial: </span>
                    <strong className="text-emerald-600 font-mono">{formatCurrency(actualPaid)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Saldo Pendiente: </span>
                    <strong className="text-red-600 font-mono">{formatCurrency(balanceDue)}</strong>
                  </div>
                </div>
              </div>

              {/* Payment Method & Cash Change */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Método de Pago
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="CASH">Efectivo</option>
                  <option value="CREDIT_CARD">Tarjeta de Crédito</option>
                  <option value="DEBIT_CARD">Tarjeta de Débito</option>
                  <option value="YAPE_PLIN">Yape / Plin / Billetera Digital</option>
                  <option value="BANK_TRANSFER">Transferencia Bancaria</option>
                </select>

                {paymentMethod === "CASH" && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold text-emerald-900">
                      <span>Efectivo Entregado por Cliente:</span>
                      <input
                        type="number"
                        step="1"
                        placeholder="Ej: 100"
                        value={cashReceived || ""}
                        onChange={(e) => setCashReceived(e.target.value ? Number(e.target.value) : undefined)}
                        className="w-24 px-2 py-1 text-right font-mono font-bold text-xs rounded-lg border border-emerald-300 bg-white"
                      />
                    </div>
                    {cashReceived !== undefined && cashReceived > actualPaid && (
                      <div className="flex justify-between items-center text-xs font-bold text-emerald-700 pt-1 border-t border-emerald-200">
                        <span>Vuelto a Entregar:</span>
                        <span className="font-mono text-sm">{formatCurrency(cashReceived - actualPaid)}</span>
                      </div>
                    )}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="N° Operación / Referencia (Opcional)"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
                />
              </div>

              {/* Automatic Print Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoPrintReceipt"
                  checked={autoPrintReceipt}
                  onChange={(e) => setAutoPrintReceipt(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label
                  htmlFor="autoPrintReceipt"
                  className="text-xs text-slate-700 select-none cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <Printer className="h-3.5 w-3.5 text-blue-600" />
                  Imprimir ticket automáticamente al cobrar
                </label>
              </div>
            </CardContent>

            <CardFooter className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button
                onClick={handleCheckout}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-md gap-2 rounded-xl"
              >
                <CheckCircle2 className="h-5 w-5" />
                {isProcessing
                  ? "Procesando..."
                  : `Procesar Venta (${formatCurrency(actualPaid)})`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Immediate Sale Success & 80mm Thermal Receipt Print Modal */}
      {completedSale && (
        <SaleSuccessReceiptModal
          sale={completedSale}
          cashReceived={cashReceived}
          autoPrint={autoPrintReceipt}
          onClose={() => setCompletedSale(null)}
          onNewSale={handleResetSale}
        />
      )}
    </div>
  );
}
