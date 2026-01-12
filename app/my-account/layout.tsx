import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import LogoutIcon from "@/app/components/LogoutIcon";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

return (
  <>
    <div className="flex min-h-screen mt-12 -translate-x-24">
      {/* Sidebar fijo */}
      <nav className="w-64 p-6 flex flex-col gap-2 min-h-screen sticky top-24 shrink-0">
        {/* Mi Perfil activo */}
        <Link 
          href="/my-account/orders" 
          className="flex items-center gap-3 p-4 text-3xl text-gray-800"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Mi perfil</span>
        </Link>

        <hr className="border-gray-300 mx-1 translate-x-2 -mt-2" />

        {/* Historial de pedidos */}
        <Link 
          href="/my-account/orders" 
          className="flex items-center gap-3 p-4 -mt-4 rounded-xl transition-all duration-200 text-gray-700 hover:text-gray-900"
        >
          <FiShoppingBag />
          <span>Historial de pedidos</span>
        </Link>

        <hr className="border-gray-300 mx-1 translate-x-2 -mt-4" />

        {/* Detalles de cuenta */}
        <Link 
          href="/my-account/edit-account" 
          className="flex items-center p-4 -mt-4 rounded-xl transition-all duration-200 text-gray-700 hover:text-gray-900"
        >
          <MdManageAccounts />
          <span className="translate-x-3">Detalles de cuenta</span>
        </Link>

        <hr className="border-gray-300 mx-1 translate-x-2 -mt-4" />

        {/* Cerrar sesión */}
        <div className="translate-x-4 ">
          <LogoutIcon />
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="flex-1 rounded-tr-xl rounded-br-xl p-6 bg-white/50">
        {children}
      </div>
    </div>
  </>
);
}