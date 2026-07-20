import { MessageCircle } from "lucide-react";
import { whatsappLink, whatsappMessages } from "@/lib/constants";

export function WhatsappButton({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <a
      href={whatsappLink(whatsappMessages.assessment, whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_2px_4px_rgba(19,36,46,0.15),0_16px_32px_-10px_rgba(37,211,102,0.65)] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 active:scale-95 sm:bottom-8 sm:right-8"
      aria-label="Chat with Grainy Palace Tech on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" fill="currentColor" strokeWidth={0} />
    </a>
  );
}
