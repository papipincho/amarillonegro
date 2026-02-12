import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, FileText, Wrench, Gauge, GraduationCap, Users, Radio, Shield } from "lucide-react";

const CATEGORIES = [
  {
    id: "licencias",
    name: "Licencias de Taxi",
    description: "Compra y venta de licencias",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754"
  },
  {
    id: "gestorias",
    name: "Gestorías",
    description: "Servicios administrativos",
    icon: FileText,
    image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b"
  },
  {
    id: "talleres",
    name: "Talleres Mecánicos",
    description: "Reparación de vehículos",
    icon: Wrench,
    image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754"
  },
  {
    id: "elementos",
    name: "Elementos del Taxi",
    description: "Taxímetros, mamparas y más",
    icon: Gauge,
    image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94"
  },
  {
    id: "escuelas",
    name: "Escuelas de Taxistas",
    description: "Formación y credenciales",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e"
  },
  {
    id: "bolsa_trabajo",
    name: "Bolsa de Trabajo",
    description: "Conductores disponibles",
    icon: Users,
    image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b"
  },
  {
    id: "emisoras",
    name: "Emisoras y Apps",
    description: "Plataformas de operación",
    icon: Radio,
    image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94"
  },
  {
    id: "seguros",
    name: "Seguros",
    description: "Coberturas para taxistas",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754"
  }
];

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=1600&h=900&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
        data-testid="hero-section"
      >
        <div className="absolute inset-0 bg-[#0A0A0A] opacity-70"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            PORTAL DE SERVICIOS
          </h1>
          <div className="inline-block bg-[#FFCC00] px-8 py-3 border-2 border-black shadow-[6px_6px_0px_0px_#000000] mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
              TAXI BARCELONA
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-zinc-200 mb-8 leading-relaxed max-w-2xl mx-auto">
            El directorio completo de servicios profesionales para el sector del taxi en Barcelona
          </p>
          <button
            onClick={() => handleNavigate("/publicar-servicio")}
            className="btn-primary inline-block"
            data-testid="publish-service-cta"
          >
            Publicar mi Servicio
          </button>
        </div>
      </section>

      {/* Categories Grid - Bento Style */}
      <section className="py-16 px-4 bg-zinc-100" data-testid="categories-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A0A0A] mb-4 tracking-tight">
              SERVICIOS DISPONIBLES
            </h2>
            <div className="w-24 h-1 bg-[#FFCC00] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  onClick={() => handleNavigate(`/categoria/${category.id}`)}
                  className="category-card h-64 rounded-sm"
                  data-testid={`category-card-${category.id}`}
                >
                  <img 
                    src={`${category.image}?w=500&h=500&fit=crop`}
                    alt={category.name}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                    <Icon className="w-10 h-10 text-[#FFCC00] mb-3" />
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                      {category.name}
                    </h3>
                    <p className="text-sm text-zinc-300">{category.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#FFCC00]" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6 tracking-tight">
            ¿OFRECES SERVICIOS PARA TAXISTAS?
          </h2>
          <p className="text-lg text-black mb-8 leading-relaxed">
            Publica tu negocio en nuestro portal y llega a cientos de profesionales del taxi en Barcelona
          </p>
          <button
            onClick={() => handleNavigate("/publicar-servicio")}
            className="btn-secondary"
            data-testid="footer-cta-button"
          >
            Solicitar Información
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
