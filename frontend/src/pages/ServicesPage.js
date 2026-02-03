import React from "react";
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

const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header */}
      <div className="bg-[#FFCC00] py-16 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-black mb-4 tracking-tight" data-testid="services-title">
            SERVICIOS PARA TAXISTAS
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
            Encuentra todos los servicios profesionales que necesitas para tu actividad como taxista en Barcelona
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="py-16 px-4" data-testid="services-categories">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  onClick={() => navigate(`/categoria/${category.id}`)}
                  className="category-card h-64 rounded-sm"
                  data-testid={`service-category-${category.id}`}
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
    </div>
  );
};

export default ServicesPage;
