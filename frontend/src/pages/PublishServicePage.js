import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, CheckCircle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CATEGORIES = [
  { id: "licencias", name: "Licencias de Taxi" },
  { id: "gestorias", name: "Gestorías" },
  { id: "talleres", name: "Talleres Mecánicos" },
  { id: "elementos", name: "Elementos del Taxi" },
  { id: "escuelas", name: "Escuelas de Taxistas" },
  { id: "bolsa_trabajo", name: "Bolsa de Trabajo" },
  { id: "emisoras", name: "Emisoras y Apps" },
  { id: "seguros", name: "Seguros para Taxistas" }
];

const PublishServicePage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service_category: "",
    business_name: "",
    description: "",
    website: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    if (success) {
      window.scrollTo(0, 0);
    }
  }, [success]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API}/contact-submission`, formData);
      console.log("Submission successful:", response.data);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service_category: "",
        business_name: "",
        description: "",
        website: ""
      });
    } catch (err) {
      console.error("Submission error:", err);
      setError("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center py-12 px-4">
        <div className="brutalist-card max-w-2xl w-full p-8 text-center" data-testid="success-message">
          <CheckCircle className="w-16 h-16 text-[#FFCC00] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-black mb-4 tracking-tight">
            ¡SOLICITUD ENVIADA!
          </h2>
          <p className="text-lg text-zinc-700 mb-6 leading-relaxed">
            Gracias por tu interés. Hemos recibido tu solicitud y nos pondremos en contacto contigo pronto para informarte sobre las condiciones y precios de publicación.
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn-primary"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#FFCC00] hover:underline mb-6 font-medium"
          data-testid="back-button"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </button>

        <div className="brutalist-card p-8 bg-white" data-testid="publish-form-container">
          <h1 className="text-4xl font-bold text-black mb-4 tracking-tight">
            PUBLICAR SERVICIO
          </h1>
          <p className="text-zinc-700 mb-8 leading-relaxed">
            Completa el formulario y nos pondremos en contacto contigo para informarte sobre las condiciones y precios de publicación en el portal.
          </p>

          {error && (
            <div className="bg-red-50 border-2 border-red-500 p-4 mb-6" data-testid="error-message">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-black mb-2 uppercase">
                Tu nombre *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full brutalist-input px-4"
                data-testid="input-name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-black mb-2 uppercase">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full brutalist-input px-4"
                data-testid="input-email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-black mb-2 uppercase">
                Teléfono *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full brutalist-input px-4 mono"
                data-testid="input-phone"
              />
            </div>

            <div>
              <label htmlFor="service_category" className="block text-sm font-bold text-black mb-2 uppercase">
                Categoría del servicio *
              </label>
              <select
                id="service_category"
                name="service_category"
                value={formData.service_category}
                onChange={handleChange}
                required
                className="w-full brutalist-input px-4"
                data-testid="select-category"
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="business_name" className="block text-sm font-bold text-black mb-2 uppercase">
                Nombre del negocio/servicio *
              </label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                required
                className="w-full brutalist-input px-4"
                data-testid="input-business-name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-black mb-2 uppercase">
                Descripción del servicio *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full brutalist-input px-4 py-3"
                data-testid="textarea-description"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-bold text-black mb-2 uppercase">
                Sitio web (opcional)
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full brutalist-input px-4"
                data-testid="input-website"
                placeholder="https://"
              />
            </div>

            <div className="bg-zinc-100 border-2 border-black p-4">
              <p className="text-sm text-zinc-700">
                * Campos obligatorios. Al enviar este formulario, recibiremos tu solicitud en <strong>info@taxis.cat</strong> y nos pondremos en contacto contigo para proporcionarte más información sobre precios y condiciones de publicación.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="submit-button"
            >
              {loading ? "Enviando..." : "Enviar solicitud"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublishServicePage;
