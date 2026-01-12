"use client";

import Form from "next/form";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function EditAccountPage() {
  const [user, setUser] = useState<{
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/viewer");
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.viewer);
      } catch {
        // No hay sesión o error
      }
    }
    fetchUser();
  }, []);

  async function handleSubmit(formData: FormData) {
    setMessage("");
    setLoading(true);

    const firstName = formData.get("firstName")?.toString().trim();
    const lastName = formData.get("lastName")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const actualPass = formData.get("actualPass")?.toString().trim();
    const newPass = formData.get("newPass")?.toString().trim();
    const newPass2 = formData.get("newPass2")?.toString().trim();

    // Validaciones
    if (newPass || newPass2) {
      if (!actualPass) {
        setMessage("Debes ingresar tu contraseña actual para cambiarla.");
        setLoading(false);
        return;
      }
      if (newPass !== newPass2) {
        setMessage("Las contraseñas nuevas no coinciden.");
        setLoading(false);
        return;
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]).{8,}$/;

      if (!passwordRegex.test(newPass!)) {
        setMessage(
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
        );
        setLoading(false);
        return;
      }
    }

    if (actualPass && !newPass) {
      setMessage(
        "Si solo quieres cambiar otros datos, deja en blanco el campo de la contraseña actual."
      );
      setLoading(false);
      return;
    }

    // Construir payload
    const payload: any = {};
    payload.username = user?.username;
    if (firstName && firstName !== user?.firstName)
      payload.firstName = firstName;
    if (lastName && lastName !== user?.lastName) payload.lastName = lastName;
    if (email && email !== user?.email) payload.email = email;
    if (newPass) {
      payload.newPass = newPass;
      payload.password = actualPass;
    }

    if (Object.keys(payload).length <= 1) {
      setMessage("No hiciste ningún cambio.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar los datos.");
      }

      setMessage("Datos actualizados correctamente");
      window.location.reload();
    } catch (err: any) {
      setMessage(err.message || "Error al actualizar el usuario.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex p-2 -mt-12 items-center justify-center">
      <div className="w-[600px]">
        <div className="rounded-[16px] p-8">
          <Form action={handleSubmit} className="space-y-6">
            {/* Usuario no editable */}
            <div className="flex flex-col items-center mb-4 -translate-x-4">
              <div className="flex items-center gap-3 w-[90%].rounded-2xl p-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-3xl  text-black-700">
                    {user?.firstName?.charAt(0)?.toUpperCase() || 'N'}
                    {user?.lastName?.charAt(0)?.toUpperCase() || 'N'}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-lg  text-gray-800 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-lg text-black mt-1">
                    {user?.username}
                  </p>
                  <p className="text-md text-black ">(no editable)</p>
                </div>
              </div>
            </div>

            {/* Nombre */}
            <div className="flex flex-col items-center">
              <div className="w-[90%]">
                <label className="block text-sm  text-gray-700 mb-1 pl-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  defaultValue={user?.firstName}
                  required
                  className="w-full px-5 py-4 border-1 border-black  rounded-[12px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300 "
                />
              </div>
            </div>

            {/* Apellido */}
            <div className="flex flex-col items-center">
              <div className="w-[90%]">
                <label className="block text-sm  text-gray-700 mb-1 pl-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  defaultValue={user?.lastName}
                  required
                  className="w-full px-5 py-4 border-1 border-black  rounded-[12px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300 "
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center">
              <div className="w-[90%]">
                <label className="block text-sm  text-gray-700 mb-1 pl-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user?.email}
                  required
                  className="w-full px-5 py-4 border-1 border-black  rounded-[12px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300 "
                />
              </div>
            </div>

            {/* Sección Cambiar Contraseña */}
            <div className="w-[100%] mx-auto p-6 space-y-6 -mt-6 ">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Cambiar Contraseña
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm  text-gray-700 mb-1 pl-1">
                    Contraseña Actual (opcional)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="actualPass"
                      placeholder="Contraseña actual"
                      className="w-full px-5 py-4 pr-12 border-1 border-black  rounded-[12px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300 "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm  text-gray-700 mb-1 pl-1">
                    Nueva Contraseña (opcional)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword2 ? "text" : "password"}
                      name="newPass"
                      placeholder="Nueva contraseña"
                      className="w-full px-5 py-4 pr-12 border-1 border-black  rounded-[12px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300 "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword2(!showPassword2)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      {showPassword2 ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1 pl-1">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword3 ? "text" : "password"}
                      name="newPass2"
                      placeholder="Confirmar nueva contraseña"
                      className="w-full px-5 py-4 pr-12 border-1 border-black  rounded-[12px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-300 "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword3(!showPassword3)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      {showPassword3 ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <p className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-2xl border w-[80%] mx-auto">
                {message}
              </p>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                className="flex-1 bg-[#FFC05B] hover:bg-[#E6A943] text-white py-4 px-8 rounded-[24px] shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFC05B]/50"
              >
                Revertir cambios
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#E985A7] hover:bg-[#D6779C] text-white  py-4 px-8 rounded-[24px] shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E985A7]/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
