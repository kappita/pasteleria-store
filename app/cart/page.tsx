"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCookie } from 'cookies-next';
import CartItemRow from "../context/CartItemRow";
import { useEffect, useState } from "react";
import DeliveryDateSelector from "../components/DeliveryDateSelector";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [fechasDisponibles, setFechasDisponibles] = useState(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [maxProductsPerDay, setMaxProductsPerDay] = useState(999)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [maxForDay, setMaxForDay] = useState(999)

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/store/cart", { cache: "no-store" });
      const storeCart = await res.json();
      setCart(storeCart);

      const resFechas = await fetch('/api/deliveryDates', {
        method: 'GET'
      })
      
      const fechas = await resFechas.json()
      const fechasModificadas = fechas.map((e: any) => ({
        ... e,
        display: e.display.charAt(0).toUpperCase() + e.display.slice(1)
      }))
      setFechasDisponibles(fechasModificadas)
      
      const resLimite = await fetch("/api/deliveryDates/getLimit", { cache: "no-store" });
      const limite = await resLimite.json()
      setMaxProductsPerDay(limite.daily_limit)
      calculateTotalQuantity(storeCart);
    })();
  }, []);

  const calculateTotalQuantity = (cartData: any) => {
    const quantity = cartData.items.reduce((total: number, item: any) => {
      return total + item.quantity;
    }, 0);
    setTotalQuantity(quantity)
  }

  const decreaseQuantity = async (key: string, currentQuantity: number) => {
    if (currentQuantity == 1) return;
    const res = await fetch("/api/store/cart/updateItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: key,
        quantity: currentQuantity - 1,
      }),
    });
    const storeCart = await res.json();
    setCart(storeCart);
    calculateTotalQuantity(storeCart);
  };

  const increaseQuantity = async (key: string, currentQuantity: number) => {
    const res = await fetch("/api/store/cart/updateItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: key,
        quantity: currentQuantity + 1,
      }),
    });
    const storeCart = await res.json();
    setCart(storeCart);
    calculateTotalQuantity(storeCart);
  };

  const deleteItem = async (key: string) => {
    const res = await fetch("/api/store/cart/removeItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: key,
      }),
    });
    const storeCart = await res.json();
    setCart(storeCart);
    calculateTotalQuantity(storeCart);
  };

  const handleSelectDate = async (date: string, timestamp: string, slots: number) => {
    const cookieValue = JSON.stringify({
        date: date,
        timestamp: timestamp
    });
    setCookie('delivery_selection', cookieValue, { maxAge: 60 * 60 * 24 });
    setSelectedDate(date)
    setMaxForDay(slots)
  }

  const deleteCart = async () => {
    const res = await fetch("/api/store/cart/newCart", { cache: "no-store" });
    const storeCart = await res.json();
    setCart(storeCart);
  }

  if (!cart) return <div className="p-10 text-center">Cargando carrito...</div>;

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-16 p-getOrder6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center sm:text-left">Tu Carrito</h1>

      {cart && cart.items.length === 0 ? (
        <div className="text-center py-16 sm:py-24 mb-24">
          <p className="text-gray-600 mb-6 text-lg">Tu carrito está vacío 🛍️</p>
          <Link
            href="/products"
            className="w-full sm:w-1/2 bg-[#E985A7] text-white px-6 py-3 rounded-4xl font-semibold text-lg shadow-lg hover:shadow-[#E985A7]/40 hover:bg-[#d96b8f] hover:scale-[1.02] transition-all disabled:opacity-50 block mx-auto sm:mx-auto"
          >
            Ir a comprar
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 text-sm sm:text-base">
            <p>Considera que la pastelería de Mónica tiene un límite de {maxProductsPerDay} productos por día. Considera reducir el tamaño de tu carrito o solicitar un pedido personalizado al Whatsapp</p>
          </div>
          
          <ul className="space-y-4 mb-8">
            {cart && cart.items.map((item: any) => (
              <CartItemRow
                key={item.key}
                item={item}
                decreaseQuantity={decreaseQuantity}
                increaseQuantity={increaseQuantity}
                deleteItem={deleteItem}
              />
            ))}
          </ul>

          {/* Footer del carrito */}
          <div className="mt-8 border-t pt-8">
            {fechasDisponibles && (
              <div className="max-h-[30vh] sm:h-[30vh] overflow-y-auto mb-6">
                <DeliveryDateSelector
                  availableDates={fechasDisponibles}
                  cartQuantity={totalQuantity}
                  selectedDate={selectedDate}
                  onDateSelect={handleSelectDate}
                />
              </div>
            )}
            
            <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start sm:gap-4">
              <div className="flex-1">
                <button
                  onClick={deleteCart}
                  className="text-gray-400 hover:text-red-500 text-sm transition-colors mt-2"
                >
                  Vaciar carrito
                </button>
              </div>

              <div className="flex flex-col items-end gap-4 w-full sm:w-auto sm:max-w-md">
                <div className="flex justify-between w-full text-lg sm:text-xl">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-xl sm:text-xl">${cart.totals.total_items}</span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  disabled={!selectedDate || totalQuantity > maxForDay}
                  className="w-full bg-[#E985A7] text-white px-6 py-3 rounded-4xl font-semibold text-lg shadow-lg hover:shadow-[#E985A7]/40 hover:bg-[#d96b8f] hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {"Ir al pago →"}
                </button>

                <button
                  onClick={() => router.push("/products")}
                  className="text-pink-500 hover:text-pink-700 text-sm font-medium self-center sm:self-end"
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
