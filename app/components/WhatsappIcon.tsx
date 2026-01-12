import { getWhatsappNumber } from "../lib/graphql/queries/getWhatsappNumber";

export default async function WhatsappIcon() {
  const number = await getWhatsappNumber();
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed md:absolute bottom-6 right-6 md:-bottom-4 md:-right-8 z-50 bg-green-500 rounded-full shadow-2xl p-3 transition-transform hover:scale-110 flex items-center justify-center"
      aria-label="Whatsapp"
    >
      <img
        src="/assets/whatsapp.svg"
        alt="Whatsapp"
        className="w-16 h-16"
        draggable={false}
      />
    </a>
  );
}
