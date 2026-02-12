import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Phone, Globe, MapPin, ArrowLeft } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API}/services/${category}`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category]);

  return (
    <div className="min-h-screen bg-zinc-100 py-8">
      {/* Header */}
      <div className="bg-[#FFCC00] py-12 mb-8 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate("/")}
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
        ) : services.length === 0 ? (
          <div className="text-center py-12 brutalist-card p-8 max-w-2xl mx-auto" data-testid="no-services-message">
            <p className="text-xl text-zinc-600 mb-4">No hay servicios publicados en esta categoría todavía.</p>
            <button
              onClick={() => navigate("/publicar-servicio")}
              className="btn-primary"
            >
              Ser el primero en publicar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {services.map((service) => (
              <div
                key={service.id}
                className="brutalist-card overflow-hidden rounded-sm"
                data-testid={`service-card-${service.id}`}
              >
                {service.image_url && (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-black mb-3 tracking-tight" data-testid={`service-name-${service.id}`}>
                    {service.name}
                  </h3>
                  <p className="text-zinc-700 mb-4 leading-relaxed" data-testid={`service-description-${service.id}`}>
                    {service.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    {service.contact_name && (
                      <p className="text-zinc-600">
                        <strong>Contacto:</strong> {service.contact_name}
                      </p>
                    )}
                    {service.email && (
                      <div className="flex items-center gap-2 text-zinc-700" data-testid={`service-email-${service.id}`}>
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${service.email}`} className="hover:underline">
                          {service.email}
                        </a>
                      </div>
                    )}
                    {service.phone && (
                      <div className="flex items-center gap-2 text-zinc-700 mono" data-testid={`service-phone-${service.id}`}>
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${service.phone}`} className="hover:underline">
                          {service.phone}
                        </a>
                      </div>
                    )}
                    {service.website && (
                      <div className="flex items-center gap-2 text-zinc-700" data-testid={`service-website-${service.id}`}>
                        <Globe className="w-4 h-4" />
                        <a
                          href={service.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline break-all"
                        >
                          Visitar web
                        </a>
                      </div>
                    )}
                    {service.address && (
                      <div className="flex items-start gap-2 text-zinc-700" data-testid={`service-address-${service.id}`}>
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span>{service.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
