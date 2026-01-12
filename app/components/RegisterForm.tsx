"use client";

import { useState } from "react";
import Form from "next/form";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          firstName,
          lastName,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Se ha enviado un correo para que establezca su contraseña`);
      } else {
        if (data.message === "fetch failed") {
          setMessage(
            "Error en el servidor. Por favor, inténtalo de nuevo más tarde."
          );
        } else {
          setMessage(data.message || "Error al registrar el usuario.");
        }
      }
    } catch (error: any) {
      setMessage(error || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex p-24 items-center justify-center">
      <div className="w-[600px]">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#E985A7]">
          Registrate
        </h1>
        <div className="bg-white shadow-2xl rounded-[16px] p-8 border border-pink-100/50 backdrop-blur-sm">
          <Form action={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-[90%]">
                <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="Nombre"
                  className="w-full px-5 py-4 border-1 border-black rounded-[12px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[90%]">
                <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Apellido"
                  className="w-full px-5 py-4 border-1 border-black rounded-[12px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[90%]">
                <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                  Usuario (no se puede cambiar)
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Usuario"
                  className="w-full px-5 py-4 border-1 border-black rounded-[12px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300 "
                />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[90%]">
                <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                  Correo
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Correo"
                  className="w-full px-5 py-4 border-1 border-black rounded-[12px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300 "
                />
              </div>
            </div>

            {message && (
              <p className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-2xl border w-[80%] mx-auto">
                {message}
              </p>
            )}

            <div className="flex gap-4 pt-6 w-[40%] mx-auto">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#E985A7] hover:bg-[#D6779C] text-white py-4 px-8 rounded-[24px] transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E985A7]/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Cargando..." : "Registrarse"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
