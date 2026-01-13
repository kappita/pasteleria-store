"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ProductGrid({ products, currentPage, totalPages }: any) {
  const searchParams = useSearchParams();
  const queryPrevious = new URLSearchParams(searchParams.toString());
  queryPrevious.set('page', (Number(queryPrevious.get('page')) - 1).toString())
  const queryNext = new URLSearchParams(searchParams.toString());
  queryNext.set('page', (Number(queryNext.get('page')) + 1).toString())

  return (
    <div className="">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-2xl flex-col items-center shadow-[2px_3px_8.9px_0px_rgba(0,0,0,0.25)] pb-4 hover:shadow-lg transition block h-[40vh]"
          >
            <div className="relative w-full h-[80%]">
              <Image
                src={product.images[0]?.src}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 500vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-t-2xl"
              />
            </div>
            <h2 className="text-sm md:text-lg font-medium mt-3 w-full text-center">{product.name}</h2>
            <p className="text-black font-medium text-sm md:text-lg text-center">Desde <span className="text-md font-semibold md:text-xl">${product.price} CLP</span></p>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-10 gap-4">
        {currentPage > 1 && (
          <Link href={`/products?${queryPrevious.toString()}`} className="px-4 py-2 bg-gray-200 rounded-lg">
            ← Anterior
          </Link>
        )}
        <span className="px-4 py-2">Página {currentPage} de {totalPages}</span>
        {currentPage < totalPages && (
          <Link href={`/products?${queryNext.toString()}`} className="px-4 py-2 bg-gray-200 rounded-lg">
            Siguiente →
          </Link>
        )}
      </div>
    </div>
  );
}
