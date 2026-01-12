import { Suspense } from "react";
import SetPasswordForm from "../components/SetPasswordForm";

export default function SetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FDF7F9] p-6">
            <Suspense fallback={
                <div className="text-[#E985A7] font-medium">Cargando formulario...</div>
            }>
                <SetPasswordForm />
            </Suspense>
        </div>
    );
}