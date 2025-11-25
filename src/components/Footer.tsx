"use client";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64;
      const elementPosition = element.offsetTop - navbarHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer id="footer" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">UNIE-BTP</h3>
            <p className="text-gray-400">
              Unis pour construire, aux service du progrès
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2 text-gray-400">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-left hover:text-white"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-left hover:text-white"
              >
                À propos
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-left hover:text-white"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-left hover:text-white"
              >
                Portfolio
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="text-gray-400">
              <p>contact@unie-btp.com</p>
              <p>+225 07 09 60 62 86</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400">
                Twitter
              </a>
              <a href="#" className="text-gray-400">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400">
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        © Conçu et développé par RETEL CONSULTING (AFRIKA NEW TENDENCY)
        </div>
      </div>
    </footer>
  );
}
