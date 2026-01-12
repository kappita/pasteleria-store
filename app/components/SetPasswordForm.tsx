"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Form from "next/form";

export default function SetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const key = searchParams.get("key");
    const login = searchParams.get("login");

    async function handleAction(formData: FormData) {
        const password = formData.get("password") as string;
        const confirm = formData.get("confirmPassword") as string;

        if (password !== confirm) {
            setStatus({ type: "error", message: "Las contraseñas no coinciden." });
            return;
        }

        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, login, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({
                    type: "success",
                    message: "¡Cuenta activada! Redirigiendo al inicio..."
                });
                setTimeout(() => router.push("/login"), 2500);
            } else {
                setStatus({ type: "error", message: data.message });
            }
        } catch (error) {
            setStatus({ type: "error", message: "Error de conexión." });
        } finally {
            setLoading(false);
        }
    }

    if (!key || !login) {
        return <div className="text-red-400">Enlace de activación inválido.</div>;
    }

    return (
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-10 border border-pink-50">
            <h1 className="text-3xl font-bold text-[#E985A7] text-center mb-2">Activa tu cuenta</h1>
            <p className="text-gray-500 text-center mb-8">Crea tu contraseña para empezar</p>

            <Form action={handleAction} className="space-y-5">
                <input
                    name="password"
                    type="password"
                    required
                    placeholder="Nueva contraseña"
                    className="w-full px-5 py-4 border border-gray-100 bg-gray-50 rounded-[16px] focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
                <input
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirmar contraseña"
                    className="w-full px-5 py-4 border border-gray-100 bg-gray-50 rounded-[16px] focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />

                {status.message && (
                    <div className={`p-4 rounded-[16px] text-sm text-center ${status.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}>
                        {status.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#E985A7] hover:bg-[#D6779C] text-white font-bold py-4 rounded-full transition-all disabled:opacity-50"
                >
                    {loading ? "Procesando..." : "Guardar y Activar"}
                </button>
            </Form>
        </div>
    );
}