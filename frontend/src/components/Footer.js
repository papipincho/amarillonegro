import React from "react";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-white border-t-4 border-[#FFCC00]" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold text-[#FFCC00] mb-4 tracking-tight">
              TAXI BARCELONA
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              El portal de referencia para servicios profesionales del sector del taxi en Barcelona.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 tracking-tight">
              ENLACES RÁPIDOS
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-zinc-400 hover:text-[#FFCC00] transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/publicar-servicio" className="text-zinc-400 hover:text-[#FFCC00] transition-colors">
                  Publicar Servicio
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 tracking-tight">
              CONTACTO
            </h4>
            <div className="flex items-center gap-2 text-zinc-400">
              <Mail className="w-5 h-5 text-[#FFCC00]" />
              <a href="mailto:info@taxis.cat" className="hover:text-[#FFCC00] transition-colors">
                info@taxis.cat
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} Portal Taxi Barcelona. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
