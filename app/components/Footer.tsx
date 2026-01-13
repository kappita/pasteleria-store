export default function Footer() {
  return (
    <footer className="bg-[#e991b5] py-8 sm:py-10 w-full text-white">
      {/* Logo responsive */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10 flex justify-center">
        <img
          src="/assets/logo.png"
          alt="Tortas con Diseños"
          className="w-48 sm:w-64 md:w-80 lg:w-96 max-w-[90vw] filter grayscale object-contain"
        />
      </div>

      {/* Menú responsive */}
      <nav className="px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        {/* Desktop: Horizontal */}
        <div className="hidden md:flex justify-center space-x-8 sm:space-x-12">
          <a href="#inicio" className="font-medium text-base sm:text-lg underline underline-offset-4 hover:text-[#faecd8] transition whitespace-nowrap">
            Inicio
          </a>
          <a href="/products?page=1&category=33" className="font-medium text-base sm:text-lg underline underline-offset-4 hover:text-[#faecd8] transition whitespace-nowrap">
            Pastelería
          </a>
          <a href="/products?page=1&category=34" className="font-medium text-base sm:text-lg underline underline-offset-4 hover:text-[#faecd8] transition whitespace-nowrap">
            Catering
          </a>
          <a href="/products?page=1&category=18" className="font-medium text-base sm:text-lg underline underline-offset-4 hover:text-[#faecd8] transition whitespace-nowrap">
            Tortas
          </a>
        </div>

        {/* Móvil/Tablet: Vertical centrado */}
        <div className="md:hidden flex flex-col items-center space-y-4 sm:space-y-6 text-center">
          <a href="#inicio" className="font-medium text-lg hover:text-[#faecd8] transition py-2">
            Inicio
          </a>
          <a href="/products?page=1&category=33" className="font-medium text-lg hover:text-[#faecd8] transition py-2">
            Pastelería
          </a>
          <a href="/products?page=1&category=34" className="font-medium text-lg hover:text-[#faecd8] transition py-2">
            Catering
          </a>
          <a href="/products?page=1&category=18" className="font-medium text-lg hover:text-[#faecd8] transition py-2">
            Tortas
          </a>
        </div>
      </nav>

      {/* Copyright responsive */}
      <div className="px-4 sm:px-6 lg:px-8 text-center text-sm sm:text-base border-t border-white/20 pt-6">
        <p>&copy; 2026 Tortas con Diseños. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
