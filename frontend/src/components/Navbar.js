import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const TaxiLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Taxi body */}
    <rect x="15" y="45" width="70" height="30" fill="#FFCC00" stroke="#000" strokeWidth="3"/>
    {/* Taxi roof */}
    <path d="M 30 45 L 35 30 L 65 30 L 70 45" fill="#FFCC00" stroke="#000" strokeWidth="3"/>
    {/* Taxi sign on roof */}
    <rect x="40" y="20" width="20" height="8" fill="#000"/>
    <text x="50" y="27" fontSize="6" fill="#FFCC00" textAnchor="middle" fontWeight="bold">TAXI</text>
    {/* Windows */}
    <rect x="38" y="33" width="10" height="10" fill="#87CEEB" stroke="#000" strokeWidth="1.5"/>
    <rect x="52" y="33" width="10" height="10" fill="#87CEEB" stroke="#000" strokeWidth="1.5"/>
    {/* Wheels */}
    <circle cx="30" cy="75" r="8" fill="#000"/>
    <circle cx="30" cy="75" r="4" fill="#555"/>
    <circle cx="70" cy="75" r="8" fill="#000"/>
    <circle cx="70" cy="75" r="4" fill="#555"/>
    {/* Headlights */}
    <circle cx="82" cy="55" r="3" fill="#FFF" stroke="#000" strokeWidth="1"/>
    {/* Details */}
    <line x1="20" y1="60" x2="80" y2="60" stroke="#000" strokeWidth="2"/>
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

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
            <div className="bg-[#FFCC00] p-1 border-2 border-white rounded-sm">
              <TaxiLogo />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">AMARILLONEGRO</h1>
              <p className="text-xs text-zinc-400">Portal Taxi Barcelona</p>
            </div>
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
