// components/CartItemRow.tsx
"use client";

// Importamos el tipo que acabamos de exportar en el Paso 1
import { CartItem } from "../context/CartContext"; 

interface CartItemRowProps {
  item: any;
  increaseQuantity: (key: string, currentQuantity: number) => void;
  decreaseQuantity: (key: string, currentQuantity: number) => void;
  deleteItem: (key: string) => void;
}

export default function CartItemRow({
  item,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
}: CartItemRowProps) {
  
  
const handleIncrease = () => {
  increaseQuantity(item.key, item.quantity)
}

const handleDecrease = () => {
  decreaseQuantity(item.key, item.quantity)
}

const handleDelete = () => {
  deleteItem(item.key)
}




  return (
    <li className="flex items-center justify-between border rounded-xl p-4 shadow-sm bg-white">
      <div className="flex items-center gap-4">
        {item.images[0] && (
          <img
            src={item.images[0].src}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}
        <div>
          <h2 className="font-semibold">{item.name}</h2>
          <p className="text-gray-600">${item.prices.price}</p>

        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Botón RESTAR */}
        <button
          onClick={handleDecrease}
          className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
        >
          −
        </button>

        <span className="font-medium w-6 text-center">{item.quantity}</span>

        {/* Botón SUMAR (Con lógica de bloqueo) */}
        <button
          onClick={handleIncrease}
          className={`w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100`}
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="font-semibold">${item.totals.line_subtotal}</p>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:underline text-sm mt-1"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}