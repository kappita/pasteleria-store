"use client";

import { useState } from "react";
import Form from "next/form";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMessage = data.message || "Ocurrió un error inesperado.";

        if (res.status === 401) {
          errorMessage = data.message || "Las credenciales no son válidas.";
        } else if (res.status === 403) {
          errorMessage = data.message || "Debes verificar tu correo.";
        } else if (res.status >= 500) {
          errorMessage = "El servicio no está disponible. Reintenta en unos minutos.";
        }

        throw new Error(errorMessage);
      }

      window.location.href = "/";
    } catch (error: any) {
      setMessage(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex p-24 items-center justify-center ">
      <div className="w-[600px]">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#E985A7]">
            Ingresa a tu cuenta
        </h1>
        <div className="bg-white shadow-2xl rounded-[16px] p-8 border border-pink-100/50 backdrop-blur-sm">
          
        <Form action={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-[90%]">
              <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                name="username"
                required
                placeholder="Nombre de usuario"
                className="w-full px-5 py-4 border-2 border-pink-200 rounded-[12px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl"
              />
            </div>
          </div>


          <div className="flex flex-col items-center">
            <div className="w-[90%]">
              <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">
                Contraseña
              </label>
              <div className="relative mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="contraseña"
                  className="w-full px-5 py-4 pr-12 border-2 border-pink-200 rounded-[12px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
              <p className="text-xs text-center text-gray-400 font-medium pl-2 hover:underline cursor-pointer transition-colors">
                ¿Has olvidado contraseña?
              </p>
            </div>
          </div>
          
            {message && (
              <p className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-2xl border">{message}</p>
            )}

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#E985A7] hover:bg-[#D6779C] text-white py-4 px-8 rounded-[24px] shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E985A7]/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Cargando..." : "Ingresar"}
              </button>
              <Link
                href="/register"
                type="button"
                className="flex-1 bg-[#FFC05B] hover:bg-[#E6A943] text-white py-4 px-8 rounded-[24px] shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 text-center focus:ring-[#FFC05B]/50"
              >
                Registrarse
              </Link>
            </div>


          </Form>
        </div>
      </div>
    </div>
  );
}
