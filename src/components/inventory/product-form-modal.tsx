"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  X,
  Image as ImageIcon,
  Glasses,
  Plus,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Globe,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProduct, updateProduct } from "@/server/actions/inventory";
import { ProductCategory } from "@/types";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any | null;
  onSuccess?: () => void;
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductFormModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProductCategory>("FRAME");
  const [costPrice, setCostPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(1);
  const [minStock, setMinStock] = useState<number>(2);

  // Frame specific
  const [frameModel, setFrameModel] = useState("");
  const [frameColor, setFrameColor] = useState("");
  const [frameMaterial, setFrameMaterial] = useState("Acetato");
  const [frameEyeSize, setFrameEyeSize] = useState<number | undefined>(52);
  const [frameBridge, setFrameBridge] = useState<number | undefined>(18);
  const [frameTemple, setFrameTemple] = useState<number | undefined>(140);

  // Contact/Lens specific
  const [baseCurve, setBaseCurve] = useState<number | undefined>(undefined);
  const [diameter, setDiameter] = useState<number | undefined>(undefined);
  const [sphereRange, setSphereRange] = useState("");
  const [showInCatalog, setShowInCatalog] = useState(true);

  // Image State
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate or reset form when modal opens or product changes
  useEffect(() => {
    if (product) {
      setSku(product.sku || "");
      setBarcode(product.barcode || "");
      setName(product.name || "");
      setDescription(product.description || "");
      setCategory(product.category || "FRAME");
      setCostPrice(Number(product.costPrice) || 0);
      setSalePrice(Number(product.salePrice) || 0);
      setStock(Number(product.stock) || 0);
      setMinStock(Number(product.minStock) || 2);

      setFrameModel(product.frameModel || "");
      setFrameColor(product.frameColor || "");
      setFrameMaterial(product.frameMaterial || "Acetato");
      setFrameEyeSize(product.frameEyeSize || 52);
      setFrameBridge(product.frameBridge || 18);
      setFrameTemple(product.frameTemple || 140);

      setBaseCurve(product.baseCurve || undefined);
      setDiameter(product.diameter || undefined);
      setSphereRange(product.sphereRange || "");
      setShowInCatalog(product.showInCatalog !== undefined ? product.showInCatalog : true);

      setImageUrl(product.imageUrl || null);
      setImagePreview(product.imageUrl || null);
    } else {
      setSku("");
      setBarcode("");
      setName("");
      setDescription("");
      setCategory("FRAME");
      setCostPrice(0);
      setSalePrice(0);
      setStock(1);
      setMinStock(2);

      setFrameModel("");
      setFrameColor("");
      setFrameMaterial("Acetato");
      setFrameEyeSize(52);
      setFrameBridge(18);
      setFrameTemple(140);

      setBaseCurve(undefined);
      setDiameter(undefined);
      setSphereRange("");
      setShowInCatalog(true);

      setImageUrl(null);
      setImagePreview(null);
    }
    setError(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    // Upload to server endpoint /api/upload (Vercel Blob)
    setIsUploadingImage(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        setImageUrl(data.url);
      } else {
        setError(data.error || "Error al subir la imagen al servidor.");
      }
    } catch (err: any) {
      console.error("Error al subir archivo:", err);
      setError("Error de red al subir la imagen.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim()) {
      setError("El SKU y el Nombre del producto son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      sku: sku.trim().toUpperCase(),
      barcode: barcode || undefined,
      name: name.trim(),
      description: description || undefined,
      category,
      imageUrl: imageUrl || undefined,
      showInCatalog,
      costPrice: Number(costPrice),
      salePrice: Number(salePrice),
      stock: Number(stock),
      minStock: Number(minStock),
      isActive: true,

      frameModel: category === "FRAME" ? frameModel : undefined,
      frameColor: category === "FRAME" ? frameColor : undefined,
      frameMaterial: category === "FRAME" ? frameMaterial : undefined,
      frameEyeSize: category === "FRAME" ? frameEyeSize : undefined,
      frameBridge: category === "FRAME" ? frameBridge : undefined,
      frameTemple: category === "FRAME" ? frameTemple : undefined,

      baseCurve: category === "CONTACT_LENS" ? baseCurve : undefined,
      diameter: category === "CONTACT_LENS" ? diameter : undefined,
      sphereRange: sphereRange || undefined,
    };

    let res: any;
    if (product?.id) {
      res = await updateProduct(product.id, payload);
    } else {
      res = await createProduct(payload);
    }

    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
      router.refresh();
    } else {
      setError(res.error || "No se pudo guardar el producto.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              {product ? <Edit3 className="h-5 w-5" /> : <Glasses className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {product ? "Editar Producto e Imagen" : "Nuevo Producto en Catálogo"}
              </h3>
              <p className="text-xs text-slate-500">
                {product
                  ? `Modificando ${product.sku} - ${product.name}`
                  : "Registra monturas, cristales o lentes de contacto con fotografía"}
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

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Subida de Imagen (Vercel Blob / Drag & Drop) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-200 block">
              Fotografía del Producto (Montura / Lente)
            </label>

            {imagePreview || imageUrl ? (
              <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/40">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-slate-300 bg-white dark:border-slate-600 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview || imageUrl!}
                    alt="Vista previa"
                    className="h-full w-full object-cover object-center"
                  />
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-bold">
                      Subiendo...
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Foto cargada correctamente
                  </p>
                  <p className="text-[11px] text-slate-500 truncate max-w-xs">
                    {imageUrl || "Almacenada en Vercel Blob"}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      Cambiar foto
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-[11px] font-semibold text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-400 cursor-pointer transition-colors dark:border-slate-700 dark:bg-slate-800/30"
              >
                <UploadCloud className="h-8 w-8 text-blue-500 mb-1" />
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  Haz clic o arrastra una foto de la montura aquí
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Formatos soportados: PNG, JPG o WEBP (subida a Vercel Blob)
                </p>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageFileChange}
              className="hidden"
            />
          </div>

          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                SKU / Código Único *
              </label>
              <input
                type="text"
                placeholder="Ej: FRM-RB5154-BLK"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 font-mono text-sm uppercase focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                placeholder="Ej: Ray-Ban Clubmaster RB5154 Negro"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="FRAME">Montura Oftálmica</option>
                <option value="OPHTHALMIC_LENS">Cristales / Lunas</option>
                <option value="CONTACT_LENS">Lentes de Contacto</option>
                <option value="ACCESSORY">Accesorio / Estuche</option>
                <option value="SOLUTION">Solución Limpiadora</option>
                <option value="SERVICE">Servicio / Mantenimiento</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Precio de Costo (S/)
              </label>
              <input
                type="number"
                step="0.5"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 font-mono text-sm focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Precio de Venta (S/) *
              </label>
              <input
                type="number"
                step="0.5"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 font-mono font-bold text-sm text-emerald-600 focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          </div>

          {/* Campos específicos de Monturas */}
          {category === "FRAME" && (
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/60 space-y-3">
              <p className="font-bold text-blue-800 dark:text-blue-300 text-[11px] uppercase tracking-wider">
                Especificaciones de la Montura
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Modelo</label>
                  <input
                    type="text"
                    placeholder="RB5154"
                    value={frameModel}
                    onChange={(e) => setFrameModel(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Color</label>
                  <input
                    type="text"
                    placeholder="Negro / Dorado"
                    value={frameColor}
                    onChange={(e) => setFrameColor(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Material</label>
                  <input
                    type="text"
                    placeholder="Acetato / Metal"
                    value={frameMaterial}
                    onChange={(e) => setFrameMaterial(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Calibre (□ mm)</label>
                  <input
                    type="number"
                    placeholder="52"
                    value={frameEyeSize || ""}
                    onChange={(e) => setFrameEyeSize(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white text-center font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Puente (mm)</label>
                  <input
                    type="number"
                    placeholder="18"
                    value={frameBridge || ""}
                    onChange={(e) => setFrameBridge(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white text-center font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Varilla (mm)</label>
                  <input
                    type="number"
                    placeholder="140"
                    value={frameTemple || ""}
                    onChange={(e) => setFrameTemple(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white text-center font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Stock Actual *
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 font-mono text-sm focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Stock Mínimo (Alerta)
              </label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 font-mono text-sm focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          </div>

          {/* Switch: Publicar en Catálogo Web */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-blue-600" />
                Publicar en Catálogo Web para Clientes
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {showInCatalog
                  ? "✓ Visible en la tienda online y catálogo interactivo de pacientes."
                  : "✗ Oculto del catálogo público (solo visible internamente en el POS/Taller)."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowInCatalog(!showInCatalog)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showInCatalog ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  showInCatalog ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting
                ? "Guardando..."
                : product
                ? "Actualizar Producto"
                : "Guardar Producto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
