export default function Footer() {
  return (
    <footer className="bg-[#e991b5] py-10 w-full text-white flex flex-col items-center justify-center">
      {/* Logo central grande */}
      <img
        src="/assets/logo.png" // Usa tu logo en blanco aquí
        alt="Tortas con Diseños"
        className="w-96 max-w-xs mx-auto mb-10 filter grayscale"
      />

      {/* Menú horizontal central */}
      <nav className="flex space-x-12 mb-8">
        <a href="#inicio" className="font-medium text-lg underline underline-offset-4 hover:text-[#faecd8] transition">Inicio</a>
        <a href="/products?page=1&category=33" className="font-medium text-lg underline underline-offset-4 hover:text-[#faecd8] transition">Pastelería</a>
        <a href="/products?page=1&category=34" className="font-medium text-lg underline underline-offset-4 hover:text-[#faecd8] transition">Catering</a>
        <a href="/products?page=1&category=18" className="font-medium text-lg underline underline-offset-4 hover:text-[#faecd8] transition">Tortas</a>
      </nav>

    </footer>
  );
}
