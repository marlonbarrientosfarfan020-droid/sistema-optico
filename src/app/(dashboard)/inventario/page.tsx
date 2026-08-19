"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Glasses,
  Plus,
  Search,
  Tag,
  Layers,
  AlertTriangle,
  ImageIcon,
  Eye,
  Edit3,
  Globe,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/server/actions/inventory";
import { formatCurrency } from "@/lib/utils";
import { ProductCategory } from "@/types";
import { ProductFormModal } from "@/components/inventory/product-form-modal";

export const dynamic = "force-dynamic";

export default function InventarioPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    const categoryParam = selectedCategory === "ALL" ? undefined : selectedCategory;
    const data = await getProducts(categoryParam, searchQuery || undefined);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Catálogo e Inventario
          </h2>
          <p className="text-sm text-slate-500">
            Control de stock de monturas con fotografía, cristales/lunas graduadas y lentes de contacto.
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700 shadow-sm gap-2 text-white"
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            <Button
              variant={selectedCategory === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("ALL")}
              className="text-xs"
            >
              Todos
            </Button>
            <Button
              variant={selectedCategory === "FRAME" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("FRAME")}
              className="text-xs"
            >
              Monturas
            </Button>
            <Button
              variant={selectedCategory === "OPHTHALMIC_LENS" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("OPHTHALMIC_LENS")}
              className="text-xs"
            >
              Cristales / Lunas
            </Button>
            <Button
              variant={selectedCategory === "CONTACT_LENS" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("CONTACT_LENS")}
              className="text-xs"
            >
              Lentes de Contacto
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por SKU, Nombre o Color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Productos Registrados ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Cargando catálogo...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Glasses className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No hay productos en esta categoría
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Agrega productos al inventario con fotografía para usarlos en el POS, taller y tienda web.
              </p>
              <Button
                onClick={handleOpenCreateModal}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" /> Agregar Producto
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
                    <th className="py-3 px-4 w-16 text-center">FOTO</th>
                    <th className="py-3 px-4">SKU / CÓDIGO</th>
                    <th className="py-3 px-4">PRODUCTO</th>
                    <th className="py-3 px-4">CATEGORÍA</th>
                    <th className="py-3 px-4">MEDIDAS / DETALLE</th>
                    <th className="py-3 px-4 text-right">COSTO</th>
                    <th className="py-3 px-4 text-right">P. VENTA</th>
                    <th className="py-3 px-4 text-center">STOCK</th>
                    <th className="py-3 px-4 text-center">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.map((product: any) => {
                    const stock = Number(product.stock ?? 0);
                    const minStock = Number(product.minStock ?? 0);
                    const isLowStock = stock <= minStock;
                    const costPrice = Number(product.costPrice ?? 0);
                    const salePrice = Number(product.salePrice ?? 0);

                    return (
                      <tr
                        key={product.id}
                        onClick={() => handleOpenEditModal(product)}
                        className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                      >
                        {/* Foto Thumbnail Clickable */}
                        <td className="py-2.5 px-4 text-center">
                          {product.imageUrl ? (
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200 bg-white dark:border-slate-700 mx-auto shadow-xs group-hover:scale-105 transition-transform">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                          ) : (
                            <div
                              title="Haz clic para subir fotografía"
                              className="h-12 w-12 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500 flex flex-col items-center justify-center mx-auto dark:border-slate-800 dark:bg-slate-900 transition-colors"
                            >
                              <Upload className="h-4 w-4" />
                              <span className="text-[9px] font-semibold mt-0.5">Subir</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono text-xs font-bold text-blue-600 group-hover:underline">
                          {product.sku}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {product.name}
                          </p>
                          {product.description && (
                            <p className="text-xs text-slate-400 truncate max-w-xs">
                              {product.description}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-[11px]">
                            {product.category}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                          {product.category === "FRAME" && (
                            <span>
                              {product.frameEyeSize ? `${product.frameEyeSize}□` : ""}
                              {product.frameBridge ? `${product.frameBridge}-` : ""}
                              {product.frameTemple || ""} • {product.frameColor || "-"}
                            </span>
                          )}
                          {product.category === "OPHTHALMIC_LENS" && (
                            <span>Lunas Graduadas</span>
                          )}
                          {product.category === "CONTACT_LENS" && (
                            <span>
                              CB: {product.baseCurve || "-"} • DIA: {product.diameter || "-"}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-slate-500">
                          {formatCurrency(costPrice)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(salePrice)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={isLowStock ? "warning" : "success"}
                            className="font-mono font-bold text-xs"
                          >
                            {stock} un.
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(product);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                            title="Editar Producto y Foto"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Creation / Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
}
