import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";

const CATEGORY_NAMES = {
  licencias: "Licencias de Taxi",
  gestorias: "Gestorías",
  talleres: "Talleres Mecánicos",
  elementos: "Elementos del Taxi",
  escuelas: "Escuelas de Taxistas",
  bolsa_trabajo: "Bolsa de Trabajo",
  emisoras: "Emisoras y Apps",
  seguros: "Seguros para Taxistas"
};

const STATIC_COMPANIES = {
  licencias: [
    {slug: "licencia-taxi-centro-bcn", name: "Licencia Taxi Centro Barcelona", phone: "+34 933 123 456", address: "Carrer de Balmes, 45", image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"},
    {slug: "licencias-premium-taxi", name: "Licencias Premium Taxi", phone: "+34 934 234 567", address: "Passeig de Gràcia, 78", image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"},
    {slug: "venta-licencias-eixample", name: "Venta Licencias Eixample", phone: "+34 935 345 678", address: "Carrer d'Aragó, 234", image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"},
    {slug: "taxi-licenses-barcelona", name: "Taxi Licenses Barcelona", phone: "+34 936 456 789", address: "Avinguda Diagonal, 456", image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"},
    {slug: "licencias-taxi-profesional", name: "Licencias Taxi Profesional", phone: "+34 937 567 890", address: "Gran Via, 567", image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"},
    {slug: "compraventa-licencias-bcn", name: "Compraventa Licencias BCN", phone: "+34 938 678 901", address: "Ronda de Sant Pere, 89", image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"},
  ],
  gestorias: [
    {slug: "gestoria-taxi-pro", name: "Gestoría Taxi Pro", phone: "+34 933 456 789", address: "Carrer de Balmes, 123", image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"},
    {slug: "administrativos-taxi-bcn", name: "Administrativos del Taxi BCN", phone: "+34 934 567 890", address: "Passeig de Gràcia, 45", image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"},
    {slug: "gestoria-integral-taxista", name: "Gestoría Integral Taxista", phone: "+34 935 678 901", address: "Carrer de Sants, 156", image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"},
    {slug: "tramites-taxi-barcelona", name: "Trámites Taxi Barcelona", phone: "+34 936 789 012", address: "Via Laietana, 78", image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"},
    {slug: "asesoria-legal-taxi", name: "Asesoría Legal Taxi", phone: "+34 937 890 123", address: "Carrer del Consell de Cent, 234", image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"},
    {slug: "gestoria-rapida-taxi", name: "Gestoría Rápida Taxi", phone: "+34 938 901 234", address: "Carrer de Provença, 345", image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"},
  ],
  talleres: [
    {slug: "taller-mecanico-autotaxi", name: "Taller Mecánico AutoTaxi", phone: "+34 932 345 678", address: "Carrer de Sants, 234", image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"},
    {slug: "mecanica-rapida-taxi-bcn", name: "Mecánica Rápida Taxi BCN", phone: "+34 933 234 567", address: "Avinguda Diagonal, 567", image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"},
    {slug: "taller-especializado-taxi", name: "Taller Especializado Taxi", phone: "+34 934 123 456", address: "Carrer de la Marina, 123", image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"},
    {slug: "reparaciones-express-taxi", name: "Reparaciones Express Taxi", phone: "+34 935 012 345", address: "Carrer de Badal, 89", image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"},
    {slug: "auto-servicio-taxi", name: "Auto Servicio Taxi", phone: "+34 936 123 456", address: "Carrer de Numància, 234", image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"},
    {slug: "taller-premium-taxi", name: "Taller Premium Taxi", phone: "+34 937 234 567", address: "Carrer de Tarragona, 156", image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"},
  ],
  elementos: [
    {slug: "taximetros-digitales-pro", name: "Taxímetros Digitales Pro", phone: "+34 931 234 567", address: "Carrer de la Marina, 89", image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"},
    {slug: "mamparas-equipamiento-taxi", name: "Mamparas y Equipamiento Taxi", phone: "+34 932 123 456", address: "Carrer del Consell de Cent, 345", image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"},
    {slug: "tecnologia-taxi-bcn", name: "Tecnología Taxi BCN", phone: "+34 933 012 345", address: "Carrer de Provença, 234", image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"},
    {slug: "instalaciones-taxi-pro", name: "Instalaciones Taxi Pro", phone: "+34 934 901 234", address: "Avinguda Meridiana, 123", image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"},
    {slug: "equipamiento-completo-taxi", name: "Equipamiento Completo Taxi", phone: "+34 935 890 123", address: "Carrer de Pallars, 156", image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"},
    {slug: "elementos-seguridad-taxi", name: "Elementos de Seguridad Taxi", phone: "+34 936 789 012", address: "Carrer del Bogatell, 89", image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"},
  ],
  escuelas: [
    {slug: "escuela-taxi-barcelona", name: "Escuela del Taxi Barcelona", phone: "+34 934 123 456", address: "Carrer d'Aragó, 234", image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"},
    {slug: "academia-profesional-taxista", name: "Academia Profesional del Taxista", phone: "+34 933 012 345", address: "Gran Via, 456", image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"},
    {slug: "formacion-taxi-integral", name: "Formación Taxi Integral", phone: "+34 935 234 567", address: "Carrer de Valencia, 345", image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"},
    {slug: "centro-estudios-taxi", name: "Centro de Estudios Taxi", phone: "+34 936 345 678", address: "Ronda Universitat, 123", image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"},
    {slug: "cursos-credencial-taxista", name: "Cursos Credencial Taxista", phone: "+34 937 456 789", address: "Carrer de Pau Claris, 234", image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"},
    {slug: "academia-taxi-express", name: "Academia Taxi Express", phone: "+34 938 567 890", address: "Passeig Sant Joan, 156", image: "https://images.unsplash.com/photo-1769427470237-1318b3e3e72e?w=600&h=400&fit=crop"},
  ],
  bolsa_trabajo: [
    {slug: "conductores-profesionales-bcn", name: "Conductores Profesionales BCN", phone: "+34 645 123 456", address: "Carrer de Balmes, 234", image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"},
    {slug: "taxistas-disponibles", name: "Taxistas Disponibles", phone: "+34 656 234 567", address: "Avinguda Diagonal, 345", image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"},
    {slug: "empleo-taxi-barcelona", name: "Empleo Taxi Barcelona", phone: "+34 667 345 678", address: "Gran Via, 234", image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"},
    {slug: "trabajo-conductor-taxi", name: "Trabajo Conductor Taxi", phone: "+34 678 456 789", address: "Carrer de Provença, 123", image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"},
    {slug: "taxistas-con-experiencia", name: "Taxistas con Experiencia", phone: "+34 689 567 890", address: "Passeig de Gràcia, 234", image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"},
    {slug: "bolsa-conductores-taxi", name: "Bolsa Conductores Taxi", phone: "+34 690 678 901", address: "Ronda Sant Pere, 156", image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=600&h=400&fit=crop"},
  ],
  emisoras: [
    {slug: "radio-taxi-barcelona", name: "Radio Taxi Barcelona", phone: "+34 933 033 033", address: "Carrer de Provença, 123", image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"},
    {slug: "taxiapp-barcelona", name: "TaxiApp Barcelona", phone: "+34 931 999 888", address: "Avinguda Diagonal, 234", image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"},
    {slug: "emisora-taxi-digital", name: "Emisora Taxi Digital", phone: "+34 934 888 777", address: "Carrer de Balmes, 345", image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"},
    {slug: "plataforma-taxi-pro", name: "Plataforma Taxi Pro", phone: "+34 935 777 666", address: "Gran Via, 456", image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"},
    {slug: "central-taxi-bcn", name: "Central Taxi BCN", phone: "+34 936 666 555", address: "Passeig Sant Joan, 234", image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"},
    {slug: "app-conductores-taxi", name: "App Conductores Taxi", phone: "+34 937 555 444", address: "Carrer de Sants, 123", image: "https://images.unsplash.com/photo-1737472441624-a7a800e9db94?w=600&h=400&fit=crop"},
  ],
  seguros: [
    {slug: "seguros-taxisegur", name: "Seguros TaxiSegur", phone: "+34 935 100 200", address: "Passeig de Sant Joan, 78", image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"},
    {slug: "mutua-taxi-barcelona", name: "Mutua del Taxi Barcelona", phone: "+34 934 200 300", address: "Ronda de Sant Pere, 23", image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"},
    {slug: "aseguradora-taxi-pro", name: "Aseguradora Taxi Pro", phone: "+34 936 300 400", address: "Carrer de Balmes, 156", image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"},
    {slug: "seguros-integrales-taxi", name: "Seguros Integrales Taxi", phone: "+34 937 400 500", address: "Avinguda Diagonal, 678", image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"},
    {slug: "proteccion-taxi-bcn", name: "Protección Taxi BCN", phone: "+34 938 500 600", address: "Gran Via, 789", image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"},
    {slug: "cobertura-total-taxi", name: "Cobertura Total Taxi", phone: "+34 939 600 700", address: "Carrer de Provença, 456", image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=600&h=400&fit=crop"},
  ],
};

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(false);
  }, [category]);

  const companies = STATIC_COMPANIES[category] || [];

  return (
    <div className="min-h-screen bg-zinc-100 py-8">
      {/* Header */}
      <div className="bg-[#FFCC00] py-12 mb-8 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-2 text-black hover:underline mb-4 font-medium"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold text-black tracking-tight" data-testid="category-title">
            {CATEGORY_NAMES[category] || category}
          </h1>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4" data-testid="services-container">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-zinc-600">Cargando servicios...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12 brutalist-card p-8 max-w-2xl mx-auto" data-testid="no-services-message">
            <p className="text-xl text-zinc-600 mb-4">No hay servicios en esta categoría todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {companies.map((company) => (
              <a
                key={company.slug}
                href={`/empresas/${category}/${company.slug}.html`}
                className="brutalist-card overflow-hidden rounded-sm block hover:shadow-[8px_8px_0px_0px_#000] transition-all"
                data-testid={`company-card-${company.slug}`}
              >
                <img
                  src={company.image}
                  alt={company.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-black mb-3 tracking-tight" data-testid={`company-name-${company.slug}`}>
                    {company.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <p className="text-zinc-700 mono">
                      📞 {company.phone}
                    </p>
                    <p className="text-zinc-600">
                      📍 {company.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[#0A0A0A] font-bold hover:text-[#FFCC00] transition-colors">
                    Ver ficha completa <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
