import api from "../lib/woocommerce";
import FiltersClient from "./FiltersClient";
import ProductGrid from "./ProductGrid";

export default async function ProductsPage(props: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
  }>;
}) {

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;
  const perPage = 12;

  // Traer categorías desde WooCommerce
  const { data: categories } = await api.get("products/categories", {
    per_page: 50,
  });

  // Armar filtros según searchParams
  const params: any = { per_page: perPage, page: currentPage };
  if (searchParams.category) params.category = searchParams.category;
  if (searchParams.min_price) params.min_price = searchParams.min_price;
  if (searchParams.max_price) params.max_price = searchParams.max_price;
  if (searchParams.page) params.page = searchParams.page;

  const response = await api.get("products", params);
  const products = response.data;
  const totalPages = Number(response.headers["x-wp-totalpages"]);
  const totalItems = response.headers['x-wp-total'];
  const itemsShown =  response.data.length
  const nonNegativeCurrent = currentPage > 1 ? currentPage - 1 : 0

  return (
    <main className="w-full py-6 px-4">
      {/* 🔹 Contador responsive */}
      <p className="md:ml-[20%] md:pl-6 text-lg md:text-xl font-semibold text-center md:text-left mb-6">
        Mostrando {1 + (nonNegativeCurrent) * perPage}-{perPage * nonNegativeCurrent + itemsShown} de {totalItems} resultados
      </p>

      <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-6">
        {/* 🔹 Filtros - Lateral en desktop, oculto en móvil (usa select en ProductGrid) */}
        <aside className="-translate-y-8 md:translate-y-0 lg:w-[20%] border-r p-6 top-6 h-fit">
          <FiltersClient categories={categories}/>
        </aside>

        {/* 🔹 Productos - Full width en móvil */}
        <section className="w-full lg:flex-1 p-0 lg:p-6">
          <ProductGrid
            products={products}
            categories={categories}
            currentPage={currentPage}
            totalPages={totalPages}
            productsPerPage={perPage}
            totalItems={totalItems}
            nonNegativeCurrent={nonNegativeCurrent}
            itemsShown={itemsShown}
          />
        </section>
      </div>
    </main>

  );
}
