import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";

const NewsArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await fetch(`/news/${slug}.html`);
        if (response.ok) {
          const html = await response.text();
          setContent(html);
        } else {
          setContent("<p>Artículo no encontrado.</p>");
        }
      } catch (error) {
        console.error("Error loading article:", error);
        setContent("<p>Error al cargar el artículo.</p>");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  return (
    <div className="min-h-screen bg-zinc-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate("/noticias")}
          className="flex items-center gap-2 text-black hover:text-[#FFCC00] mb-8 font-medium transition-colors"
          data-testid="back-to-news"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a noticias
        </button>

        <div className="brutalist-card p-8 md:p-12 bg-white" data-testid="news-article-content">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-zinc-600">Cargando artículo...</p>
            </div>
          ) : (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsArticle;
