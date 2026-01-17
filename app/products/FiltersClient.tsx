"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FiltersClient({ categories }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();


  // Get total count from headers
  const totalProducts = 0


  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");

  const applyFilters = () => {
    const query = new URLSearchParams();
    if (selectedCategory) query.set("category", selectedCategory);
    if (minPrice) query.set("min_price", minPrice);
    if (maxPrice) query.set("max_price", maxPrice);
    query.set("page", '1')

    router.push(`/products?${query.toString()}`);
  };

  const filterByCategory = (e: any) => {
    console.log("Filtrando")
    const query = new URLSearchParams();
    if (minPrice) query.set("min_price", minPrice);
    if (maxPrice) query.set("max_price", maxPrice);
    query.set('page', '1')
    query.set("category", e);
    router.push(`/products?${query.toString()}`);
  }

  const clearFilters = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    router.push(`/products`);
  };

  return (
    <div className="space-y-6">
      <h2 className="translate-y-4 md:translate-y-0 md:text-xl font-bold">Categorías</h2>

      {/* Categorías */}
      <div>
        <nav className="md:block hidden">
          <ul className="divide-y divide-black">
            {categories
              .filter((cat: any) => cat.name !== "Uncategorized")
              .map((cat: any) => (
                <li key={cat.id} className="py-3">
                  <button
                    onClick={() => filterByCategory(cat.id)}
                    className="w-full text-left hover:text-blue-600"
                  >
                    {cat.name} ({cat.count})
                  </button>
                </li>
              ))}
            <li key={0} className="py-3">
              <button
                onClick={() => filterByCategory(0)}
                className="w-full text-left hover:text-blue-600"
              >
                Todos
              </button>
            </li>
          </ul>
        </nav>

        {/* Versión móvil - Menú desplegable */}
        <div className="md:hidden">
          <select 
            onChange={(e) => filterByCategory(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            defaultValue=""
          >
            <option value="" disabled>Selecciona una categoría</option>
            <option value={0}>Todos</option>
            {categories
              .filter((cat: any) => cat.name !== "Uncategorized")
              .map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.count})
                </option>
              ))}
          </select>
        </div>
      </div>


      {/* Precio */}
      {/* <div>
        <h3 className="font-semibold mb-2">Rango de precios</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <input
            type="number"
            placeholder="Máx"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-2 rounded w-1/2"
          />
        </div>
      </div> */}

      {/* <button
        onClick={applyFilters}
        className="w-full bg-pink-500 text-white rounded p-2 hover:bg-pink-600"
      >
        Aplicar filtros
      </button>

      <button
        onClick={clearFilters}
        className="w-full border border-gray-300 rounded p-2 mt-2 hover:bg-gray-100"
      >
        Limpiar
      </button> */}
    </div>
  );
}
