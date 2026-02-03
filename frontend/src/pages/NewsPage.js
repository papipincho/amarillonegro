import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";

const NEWS_ARTICLES = [
  {
    slug: "tarifas-taxi-barcelona-2026",
    title: "Nuevas Tarifas del Taxi en Barcelona para 2026",
    excerpt: "El Ayuntamiento de Barcelona ha aprobado la actualización de las tarifas del taxi que entrarán en vigor el próximo mes. Conoce todos los detalles del nuevo sistema de precios.",
    date: "28 de Enero, 2026",
    image: "https://images.unsplash.com/photo-1656062584198-13b035bd9754?w=800&h=500&fit=crop"
  },
  {
    slug: "flota-electrica-taxi-bcn",
    title: "Barcelona Impulsa la Renovación de la Flota de Taxis Eléctricos",
    excerpt: "La ciudad ofrece nuevas ayudas para la adquisición de vehículos eléctricos e híbridos. Subvenciones de hasta 15.000€ para taxistas que renueven su flota.",
    date: "15 de Enero, 2026",
    image: "https://images.unsplash.com/photo-1646772488020-0d37a2dbb43b?w=800&h=500&fit=crop"
  }
];

const NewsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header */}
      <div className="bg-[#FFCC00] py-16 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-black mb-4 tracking-tight" data-testid="news-title">
            NOTICIAS DEL SECTOR
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
            Las últimas novedades y actualidad del mundo del taxi en Barcelona
          </p>
        </div>
      </div>

      {/* News List */}
      <section className="py-16 px-4" data-testid="news-list">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8">
            {NEWS_ARTICLES.map((article) => (
              <div
                key={article.slug}
                className="brutalist-card overflow-hidden rounded-sm cursor-pointer"
                onClick={() => navigate(`/noticias/${article.slug}`)}
                data-testid={`news-article-${article.slug}`}
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center gap-2 text-zinc-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm mono">{article.date}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-black mb-4 tracking-tight hover:text-[#0A0A0A]">
                      {article.title}
                    </h2>
                    <p className="text-zinc-700 mb-6 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-[#0A0A0A] font-bold hover:text-[#FFCC00] transition-colors">
                      Leer más <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
