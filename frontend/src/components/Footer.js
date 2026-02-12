import React, { useState } from "react";
import { Mail } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Footer = () => {
  const navigate = useNavigate();
  const [newsletterData, setNewsletterData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API}/newsletter-subscribe`, newsletterData);
      setMessageType("success");
      setMessage(response.data.message);
      setNewsletterData({ name: "", email: "", phone: "" });
    } catch (error) {
      setMessageType("error");
      setMessage("Error al suscribirte. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <footer className="bg-[#0A0A0A] text-white border-t-4 border-[#FFCC00]" data-testid="footer">
      {/* Newsletter Section */}
      <div className="bg-[#FFCC00] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-black mb-4 text-center tracking-tight">
            RECIBE LAS NOVEDADES
          </h3>
          <p className="text-center text-black mb-6">
            Suscríbete para estar al día de todas las noticias del sector del taxi en Barcelona
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Tu nombre *"
                value={newsletterData.name}
                onChange={(e) => setNewsletterData({ ...newsletterData, name: e.target.value })}
                required
                className="brutalist-input px-4 bg-white text-black placeholder-zinc-500"
                data-testid="newsletter-name"
              />
              <input
                type="email"
                placeholder="Tu email *"
                value={newsletterData.email}
                onChange={(e) => setNewsletterData({ ...newsletterData, email: e.target.value })}
                required
                className="brutalist-input px-4 bg-white text-black placeholder-zinc-500"
                data-testid="newsletter-email"
              />
              <input
                type="tel"
                placeholder="Tu móvil"
                value={newsletterData.phone}
                onChange={(e) => setNewsletterData({ ...newsletterData, phone: e.target.value })}
                className="brutalist-input px-4 bg-white text-black placeholder-zinc-500 mono"
                data-testid="newsletter-phone"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0A0A0A] text-[#FFCC00] border-2 border-black font-bold uppercase px-6 py-3 hover:bg-black transition-colors disabled:opacity-50"
                data-testid="newsletter-submit"
              >
                {loading ? "Enviando..." : "Suscribirse"}
              </button>
            </div>
            <p className="mt-3 text-center text-black text-sm">
              📱 Si quieres que te añadamos al canal de WhatsApp, introduce tu móvil
            </p>
            {message && (
              <p
                className={`mt-4 text-center font-medium ${
                  messageType === "success" ? "text-green-800" : "text-red-800"
                }`}
                data-testid="newsletter-message"
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold text-[#FFCC00] mb-4 tracking-tight">
              AMARILLONEGRO.COM
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
                <button onClick={() => handleNavigate("/")} className="text-zinc-400 hover:text-[#FFCC00] transition-colors">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("/servicios")} className="text-zinc-400 hover:text-[#FFCC00] transition-colors">
                  Servicios
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("/noticias")} className="text-zinc-400 hover:text-[#FFCC00] transition-colors">
                  Noticias
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("/publicar-servicio")} className="text-zinc-400 hover:text-[#FFCC00] transition-colors">
                  Publicar Anuncio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate("/admin")}
                  className="text-zinc-400 hover:text-[#FFCC00] transition-colors"
                  data-testid="admin-link"
                >
                  Admin
                </button>
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
          <p>© {new Date().getFullYear()} AmarilloNegro.com - Portal Taxi Barcelona. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
