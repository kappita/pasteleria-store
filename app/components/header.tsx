"use client";
import { useState } from "react";
import UserMenu from "./UserMenu";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="py-3 md:py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo centrado responsive */}
            <div className="xl:hidden xl:block xl:w-24"></div>
            
            <div className="flex-1 max-w-xs">
              <Link href="/">
                <img
                  src="/assets/logo.png"
                  alt="Tortas con Diseños"
                  className="-translate-x-30 xl:translate-x-0 h-20 md:h-24 lg:h-40 w-auto object-contain ml-auto md:ml-0"
                />
              </Link>
            </div>


            {/* Derecha: redes, carrito, user */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-full hover:bg-white/20 transition"
              >
                <img 
                  src="/assets/instagram.png" 
                  alt="Instagram"
                  className="w-6 h-6 md:w-10 md:h-10"
                />
              </a>

              <Link
                href="/cart"
                className="p-1 rounded-full hover:bg-white/20 transition"
              >
                <img
                  src="/assets/cart.png"
                  alt="Carrito"
                  className="w-6 h-6 md:w-10 md:h-10"
                />
              </Link>
              <div className="translate-x-2">
                <UserMenu />
              </div>
              
            </div>
          </div>
        </div>
      </header>

      {/* Nav Desktop */}
      <nav className="bg-[#E985A7] shadow-md">
        <div className="hidden md:flex justify-center items-center py-2 gap-4 lg:gap-8 text-sm lg:text-base">
          <Link
            href="/"
            className="flex items-center justify-center text-white hover:text-pink-100 font-medium transition px-4 py-2 rounded h-10 lg:h-12 lg:w-32 lg:px-6"
          >
            Inicio
          </Link>
          <Link
            href="/products?page=1&category=33"
            className="flex items-center justify-center text-white hover:text-pink-100 font-medium transition px-4 py-2 rounded h-10 lg:h-12 lg:w-32 lg:px-6"
          >
            Pastelería
          </Link>
          <Link
            href="/products?page=1&category=34"
            className="flex items-center justify-center text-white hover:text-pink-100 font-medium transition px-4 py-2 rounded h-10 lg:h-12 lg:w-32 lg:px-6"
          >
            Catering
          </Link>
          <Link
            href="/products?page=1&category=18"
            className="flex items-center justify-center text-white hover:text-pink-100 font-medium transition px-4 py-2 rounded h-10 lg:h-12 lg:w-32 lg:px-6"
          >
            Tortas
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Hamburger */}
      <div className="md:hidden bg-[#E985A7] shadow-md">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col items-center space-y-1 p-2 ml-auto text-white hover:bg-white/20 rounded transition"
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
        
        {/* Mobile Menu Links */}
        {isMenuOpen && (
          <div className="bg-[#E985A7] border-t border-white/20">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center text-white hover:text-pink-100 font-medium py-3 px-6 rounded-lg hover:bg-white/10 transition"
              >
                Inicio
              </Link>
              <Link
                href="/products?page=1&category=33"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center text-white hover:text-pink-100 font-medium py-3 px-6 rounded-lg hover:bg-white/10 transition"
              >
                Pastelería
              </Link>
              <Link
                href="/products?page=1&category=34"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center text-white hover:text-pink-100 font-medium py-3 px-6 rounded-lg hover:bg-white/10 transition"
              >
                Catering
              </Link>
              <Link
                href="/products?page=1&category=18"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center text-white hover:text-pink-100 font-medium py-3 px-6 rounded-lg hover:bg-white/10 transition"
              >
                Tortas
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
