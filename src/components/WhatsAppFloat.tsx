'use client';

import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@nextui-org/react";

export default function WhatsAppFloat() {
  const phoneNumber = "+2250709606286"; // Replace with your company's WhatsApp number
  const message = "Bonjour, je souhaite avoir plus d'informations sur UNIE-BTP."; // Default message

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      isIconOnly
      className="fixed bottom-8 right-8 z-50 w-16 h-16 text-3xl bg-[#25D366] hover:bg-[#20BA56] shadow-lg rounded-full"
      onClick={handleWhatsAppClick}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-white" />
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
    </Button>
  );
} 