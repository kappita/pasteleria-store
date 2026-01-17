"use client";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: "simple" | "grouped" | "external" | "variable";
  status: "draft" | "pending" | "private" | "publish";
  featured: boolean;
  catalog_visibility: "visible" | "catalog" | "search" | "hidden";
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: "taxable" | "shipping" | "none";
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: "instock" | "outofstock" | "onbackorder";
  backorders: "no" | "notify" | "yes";
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: Dimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: ProductCategory[];
  tags: ProductTag[];
  images: ProductImage[];
  attributes: any[];
  default_attributes: any[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  meta_data: any[];
}

interface ProductImage {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

interface ProductTag {
  id: number;
  name: string;
  slug: string;
}

interface Dimensions {
  length: string;
  width: string;
  height: string;
}

type bruh = {
  product: Product;
  variations: any;
};

function transformToWooVariation(rawAttributes: any, useGlobalPrefix = false) {
  return Object.entries(rawAttributes).map(([key, value]) => {
    let attributeKey = key;
    if (useGlobalPrefix) {
      attributeKey = `pa_${key.toLowerCase().replace(/\s+/g, '-')}`;
    }

    let attributeValue: string = value as string;
    if (useGlobalPrefix) {
      attributeValue = (value as string).toLowerCase().replace(/\s+/g, '-');
    }

    return {
      attribute: attributeKey,
      value: attributeValue
    };
  });
}

export default function ProductDetailsClient({ product, variations }: bruh) {
  const [selectedAttrs, setSelectedAttrs] = useState<{ [key: string]: string }>({});
  const [currentVariation, setCurrentVariation] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const router = useRouter();

  // Actualiza la variación actual cuando cambian los selects
  useEffect(() => {
    if (product.type !== "variable") return;

    const match = variations.find((v: any) =>
      v.attributes.every(
        (a: any) =>
          selectedAttrs[a.name] &&
          selectedAttrs[a.name].toLowerCase() === a.option.toLowerCase()
      )
    );

    setCurrentVariation(match || null);
  }, [selectedAttrs, variations, product.type]);

  // Manejador genérico para cada atributo (ej: Tamaño, Sabor)
  const handleSelectChange = (attrName: string, value: string) => {
    setSelectedAttrs((prev) => ({
      ...prev,
      [attrName]: value,
    }));
  };

  // Precio actual
  const currentPrice = currentVariation?.price || product.price || "N/A";

  // Agregar al carrito
  const handleAddToCart = async () => {
    if (product.type === "variable" && !currentVariation) {
      setMessage("⚠️ Debes seleccionar todas las opciones antes de agregar al carrito.");
      return false;
    }

    if (quantity < 1) {
      setMessage("⚠️ La cantidad debe ser al menos 1.");
      return false;
    }

    const item = currentVariation || product;
    const variation = transformToWooVariation(selectedAttrs);

    const addRes = await fetch("/api/store/cart/addItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: item.id,
        quantity: quantity,
        variation: variation,
      }),
    });

    if (!addRes.ok) {
      setMessage("❌ Error al agregar al carrito. Intenta nuevamente.");
      return false;
    }

    setAddedSuccess(true);
    setMessage(null);
    return true;
  };

  const handleBuyNow = async () => {
    const res = await handleAddToCart();
    if (res) {
      router.push("/cart");
    }
  };

  const areAttributesSelected = product.type !== "variable" || 
    product.attributes.every((attr) => selectedAttrs[attr.name]);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs responsive */}
      <nav className="text-sm text-gray-500 mb-6 hidden sm:block">
        <p>{`Productos > ${product.categories[0]?.name} > ${product.name}`}</p>
      </nav>

      {/* Grid responsive: Móvil stack, Desktop side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
        {/* Imagen */}
        <div className="w-full">
          <img
            src={currentVariation?.image?.src || product.images[0]?.src}
            alt={product.name}
            className="w-full h-80 sm:h-96 lg:h-[500px] rounded-2xl object-cover shadow-lg"
          />
        </div>

        {/* Contenido */}
        <div className="w-full flex flex-col lg:pl-0 xl:pl-12 space-y-6">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            {product.name}
          </h1>

          {/* Precio */}
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">
            ${(parseFloat(currentPrice) * quantity).toFixed(2)}
          </p>

          {/* Descripción */}
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {product.description.replace(/<[^>]+>/g, "")}
          </p>

          {/* Atributos variables */}
          {product.type === "variable" &&
            product.attributes.map((attr: any) => (
              <div key={attr.name} className="space-y-2">
                <label className="block text-sm sm:text-base font-medium text-gray-900">
                  Selecciona {attr.name.toLowerCase()}:
                </label>
                <select
                  onChange={(e) => handleSelectChange(attr.name, e.target.value)}
                  value={selectedAttrs[attr.name] || ""}
                  className="w-full max-w-sm sm:max-w-md border border-gray-300 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-[#E985A7] focus:border-[#E985A7] bg-white shadow-sm"
                >
                  <option value="">Selecciona una opción</option>
                  {attr.options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}

          {/* Cantidad */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <label htmlFor="quantity" className="text-sm sm:text-base font-medium text-gray-900">
                Cantidad:
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={10}
                value={quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val < 1) setQuantity(1);
                  else setQuantity(val);
                }}
                className="border rounded-xl p-3 w-20 sm:w-24 text-center font-medium text-lg focus:ring-2 focus:ring-[#E985A7]"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-3 lg:space-y-4 w-full lg:w-auto">
            {!addedSuccess ? (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={product.type === "variable" && !areAttributesSelected}
                  className="w-full lg:w-auto bg-transparent border-2 border-[#E985A7] text-[#E985A7] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-[#E985A7] hover:text-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.type === "variable" && !areAttributesSelected 
                    ? "Selecciona opciones" 
                    : "Agregar al carrito"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.type === "variable" && !areAttributesSelected}
                  className="w-full sm:translate-x-4 lg:w-auto text-gray-500 underline hover:text-[#E985A7] text-xs sm:text-sm disabled:opacity-50"
                >
                  O comprar ahora directamente
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center border border-green-200">
                  ✅ ¡Agregado al carrito con éxito!
                </div>
                <button
                  onClick={() => router.push("/cart")}
                  className="w-full bg-[#E985A7] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-pink-400 transition-all shadow-lg"
                >
                  Ir al carrito
                </button>
                <button
                  onClick={() => router.push('/products')}
                  className="w-full bg-gray-100 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium hover:bg-gray-200 transition-all"
                >
                  Seguir comprando
                </button>
              </div>
            )}
          </div>

          {/* Mensajes */}
          {message && !addedSuccess && (
            <div className="p-4 rounded-xl bg-yellow-100 text-yellow-700 text-sm text-center border border-yellow-200">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
