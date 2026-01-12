import Link from "next/link";
import WhatsappIcon from "./components/WhatsappIcon";

const catalogItems = [
  {
    name: "Coctelería Salada",
    image: "/assets/canapes.JPEG",
  },
  {
    name: "Mini Tortas",
    image: "/assets/minitortas.JPEG",
  },
  {
    name: "Coctelería Dulce",
    image: "/assets/cocteleriaDulce.jpeg",
    featured: true,
  },
  {
    name: "Tortas",
    image: "/assets/torta.JPG",
    featured: true,
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center ">
      <section className="flex justify-center items-center relative mt-20">
        <div className="flex flex-col md:flex-row items-center w-[97%] max-w-6xl mx-auto">
          <div className="flex-shrink-0 flex items-center justify-center w-[430px] h-[430px] relative z-10">
            <div className="overflow-hidden rounded-full w-[500px] h-[500px]">
              <img
                src="/assets/landingPhoto.png"
                alt="Pastelera con torta"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="bg-[#fbbb5b] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] rounded-tl-[0px] p-24 flex-1 flex flex-col justify-center min-h-[350px] -ml-48 z-0">
            <h2 className="font-bold text-white text-4xl mb-4 translate-x-30 ">
              Tortas con Diseños
            </h2>
            <hr className="border-white/80 mb-3 translate-x-32 overflow-hidden w-[80%]" />
            <p className="text-white text-md translate-x-32 w-[80%]">
              Pastelería fina y coctelería tortas con diseño. Ofrecemos una
              amplia gama de productos, para todas tus celebraciones y eventos.
              Con productos de calidad, sin pre mezclas, 100% artesanal. Años de
              experiencia en el rubro. Chef Pastelera titulada. Especializada en
              pastelería nacional e internacional, capacitada para pastelería
              saludable, sin gluten, sin azúcar, sin lactosa, también en
              coctelería dulce y salada.
            </p>
          </div>
        </div>
        <WhatsappIcon />
      </section>

      <section className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#fbbb5b]">
          Conoce nuestro catálogo
        </h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto px-4">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src={catalogItems[0].image}
                alt={catalogItems[0].name}
                className="w-full h-full object-cover scale-150"
              />
              <div className="absolute bottom-0 left-0 w-full px-4 pb-3 text-white text-lg font-semibold bg-gradient-to-t from-black/50 to-transparent">
                {catalogItems[0].name}
                <div className="border-t border-white/40 mt-1 w-full" />
              </div>
            </div>
            {/* Tarjeta 4 */}
            <div className="relative aspect-[4/2] rounded-xl overflow-hidden">
              <img
                src={catalogItems[1].image}
                alt={catalogItems[1].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full px-4 pb-3 text-white text-lg font-semibold bg-gradient-to-t from-black/40 to-transparent">
                {catalogItems[1].name}
                <div className="border-t border-white/40 mt-1 w-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/2] rounded-xl overflow-hidden">
              <img
                src={catalogItems[2].image}
                alt={catalogItems[2].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full px-4 pb-3 text-white text-lg font-semibold bg-gradient-to-t from-black/40 to-transparent">
                {catalogItems[2].name}
                <div className="border-t border-white/40 mt-1 w-full" />
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src={catalogItems[3].image}
                alt={catalogItems[3].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full px-4 pb-3 text-white text-lg font-semibold bg-gradient-to-t from-black/40 to-transparent">
                {catalogItems[3].name}
                <div className="border-t border-white/40 mt-1 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center py-10 mb-40">
        <div className="w-[97%] max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-md flex flex-col md:flex-row">
          <div className="bg-[#E985A7] flex flex-col justify-center items-center px-8 py-14 md:py-0 md:w-1/2 text-center">
            <h2 className="text-white text-4xl font-bold leading-tight mb-2 w-[75%]">
              ¿Buscas sorprender a tu ser querido?
            </h2>
            <hr className="border-white w-4/5 my-4" />
            <p className="text-white text-md font-medium mb-10 w-[75%]">
              Reserva tu desayuno sorpresa personalizado para la ocasión
              especial, ya sea un cumpleaños o la celebración de algún logro,
              regala a tu familia, amigos, pareja, con nosotros!
            </p>
            <button className="border-2 border-white rounded-full px-12 py-4 text-white text-lg hover:bg-white hover:text-[#e991b5] transition font-medium">
              Comprar
            </button>
          </div>
          <div className="md:w-1/2 h-96 md:h-auto relative">
            <img
              src="/assets/felizdia.png"
              alt="Feliz Día Sorpresa"
              className="object-cover object-top w-full h-full brightness-80 aspect-[1.1/1]"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
