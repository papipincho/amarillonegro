import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#0A0A0A] border-b-4 border-[#FFCC00] sticky top-0 z-50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Just the image */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer"
            data-testid="logo"
          >
            <img 
              src="/logo.jpg" 
              alt="AmarilloNegro" 
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className={`font-medium transition-colors ${
                isActive("/") ? "text-[#FFCC00]" : "text-white hover:text-[#FFCC00]"
              }`}
              data-testid="nav-home"
            >
              Inicio
            </button>
            <button
              onClick={() => navigate("/servicios")}
              className={`font-medium transition-colors ${
                isActive("/servicios") ? "text-[#FFCC00]" : "text-white hover:text-[#FFCC00]"
              }`}
              data-testid="nav-services"
            >
              Servicios
            </button>
            <button
              onClick={() => navigate("/noticias")}
              className={`font-medium transition-colors ${
                isActive("/noticias") ? "text-[#FFCC00]" : "text-white hover:text-[#FFCC00]"
              }`}
              data-testid="nav-news"
            >
              Noticias
            </button>
            <button
              onClick={() => navigate("/publicar-servicio")}
              className="bg-[#FFCC00] text-black px-6 py-2 border-2 border-white font-bold uppercase text-sm hover:bg-white transition-colors"
              data-testid="nav-publish"
            >
              Publicar Anuncio
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#FFCC00] p-2"
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-zinc-800 mt-2" data-testid="mobile-menu">
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
                className={`font-medium text-left ${
                  isActive("/") ? "text-[#FFCC00]" : "text-white"
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => {
                  navigate("/servicios");
                  setMobileMenuOpen(false);
                }}
                className={`font-medium text-left ${
                  isActive("/servicios") ? "text-[#FFCC00]" : "text-white"
                }`}
              >
                Servicios
              </button>
              <button
                onClick={() => {
                  navigate("/noticias");
                  setMobileMenuOpen(false);
                }}
                className={`font-medium text-left ${
                  isActive("/noticias") ? "text-[#FFCC00]" : "text-white"
                }`}
              >
                Noticias
              </button>
              <button
                onClick={() => {
                  navigate("/publicar-servicio");
                  setMobileMenuOpen(false);
                }}
                className="bg-[#FFCC00] text-black px-6 py-2 border-2 border-white font-bold uppercase text-sm"
              >
                Publicar Anuncio
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
