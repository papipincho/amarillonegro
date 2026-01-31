import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-[#0A0A0A] border-b-4 border-[#FFCC00] sticky top-0 z-50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center gap-3"
            data-testid="logo"
          >
            <div className="bg-[#FFCC00] p-2 border-2 border-white">
              <span className="text-2xl font-bold text-black">TB</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">TAXI BCN</h1>
              <p className="text-xs text-zinc-400">Portal de Servicios</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="text-white hover:text-[#FFCC00] font-medium transition-colors"
              data-testid="nav-home"
            >
              Inicio
            </button>
            <button
              onClick={() => navigate("/publicar-servicio")}
              className="bg-[#FFCC00] text-black px-6 py-2 border-2 border-white font-bold uppercase text-sm hover:bg-white transition-colors"
              data-testid="nav-publish"
            >
              Publicar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#FFCC00] p-2"
            data-testid="mobile-menu-button"
          >
            <Menu className="w-6 h-6" />
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
                className="text-white hover:text-[#FFCC00] font-medium text-left"
              >
                Inicio
              </button>
              <button
                onClick={() => {
                  navigate("/publicar-servicio");
                  setMobileMenuOpen(false);
                }}
                className="bg-[#FFCC00] text-black px-6 py-2 border-2 border-white font-bold uppercase text-sm"
              >
                Publicar Servicio
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
