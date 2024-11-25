'use client'

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button
} from "@nextui-org/react";
import Image from 'next/image';

export default function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: "Accueil", href: "hero" },
    { name: "A Propos", href: "about" },
    { name: "Nos partenaires", href: "partners" },
    { name: "Portfolio", href: "portfolio" },
    { name: "Contacts", href: "footer" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64; // Adjust this value based on your navbar height
      const elementPosition = element.offsetTop - navbarHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      className="fixed top-0 w-screen bg-main backdrop-blur-md z-50"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <Image src="/logo.png" alt="UNIE-BTP" width={48} height={40} />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <button
              onClick={() => scrollToSection(item.href)}
              className="text-gray-300 hover:text-white cursor-pointer"
            >
              {item.name}
            </button>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Link href="https://www.facebook.com/profile.php?id=100095486700954" className="text-gray-300 hover:text-white hidden md:block">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button 
            as={Link} 
            href="/register" 
            className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200"
          >
            Intégrer UNIE BTP
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-primary">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <button
              onClick={() => scrollToSection(item.href)}
              className="w-full text-left text-gray-300 hover:text-white text-lg py-2"
            >
              {item.name}
            </button>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}