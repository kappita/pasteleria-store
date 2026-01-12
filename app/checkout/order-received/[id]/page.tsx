"use client";

import { useParams } from 'next/navigation';

export default function OrderReceivedPage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-30 md:mb-20 w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
        ¡Orden recibida! #{params?.id}
      </h1>
      <p>Tu compra <strong>#{params?.id}</strong> ha sido realizada con éxito.</p>
      <p>Revisa tu correo para la confirmación de la orden.</p>
    </main>
  );
}
