import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, Mail, Calendar, ArrowLeft, LogOut, Trash2, FileText, Building2 } from "lucide-react";

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("submissions"); // submissions or subscribers
  const [loadingData, setLoadingData] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = btoa(`admin:${password}`);
      await axios.post(
        `${API}/admin/verify`,
        {},
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );
      
      sessionStorage.setItem('adminAuth', auth);
      setAuthenticated(true);
      fetchData(auth);
    } catch (err) {
      setError("Contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (auth = null) => {
    setLoadingData(true);
    try {
      const authHeader = auth || sessionStorage.getItem('adminAuth');
      
      // Fetch subscribers
      const subsResponse = await axios.get(`${API}/admin/newsletter-subscriptions`, {
        headers: { Authorization: `Basic ${authHeader}` },
      });
      setSubscribers(subsResponse.data);
      
      // Fetch service submissions
      const submissionsResponse = await axios.get(`${API}/admin/contact-submissions`, {
        headers: { Authorization: `Basic ${authHeader}` },
      });
      setSubmissions(submissionsResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta solicitud?")) {
      return;
    }

    try {
      const authHeader = sessionStorage.getItem('adminAuth');
      await axios.delete(`${API}/admin/contact-submissions/${submissionId}`, {
        headers: { Authorization: `Basic ${authHeader}` },
      });
      
      // Update local state
      setSubmissions(submissions.filter(s => s.id !== submissionId));
      alert("Solicitud eliminada correctamente");
    } catch (err) {
      console.error("Error deleting submission:", err);
      alert("Error al eliminar la solicitud");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setAuthenticated(false);
    setPassword("");
    setSubscribers([]);
    setSubmissions([]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const auth = sessionStorage.getItem('adminAuth');
    if (auth) {
      setAuthenticated(true);
      fetchData(auth);
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center py-12 px-4">
        <div className="brutalist-card max-w-md w-full p-8 bg-white" data-testid="admin-login">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-black hover:text-[#FFCC00] mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>

          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">
            PANEL ADMIN
          </h1>
          <p className="text-zinc-600 mb-8">Acceso restringido a administradores</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-black mb-2 uppercase">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full brutalist-input px-4"
                placeholder="Introduce la contraseña"
                data-testid="admin-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-500 p-4" data-testid="login-error">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
              data-testid="login-submit"
            >
              {loading ? "Verificando..." : "Acceder"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2 tracking-tight" data-testid="dashboard-title">
              PANEL DE ADMINISTRACIÓN
            </h1>
            <p className="text-zinc-600">Gestión del portal</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 border-2 border-black font-bold uppercase hover:bg-red-700 transition-colors"
            data-testid="logout-button"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="brutalist-card p-8 bg-[#FFCC00]">
            <div className="flex items-center gap-4">
              <FileText className="w-12 h-12 text-black" />
              <div>
                <p className="text-sm text-black uppercase font-bold">Servicios Pendientes</p>
                <p className="text-5xl font-bold text-black" data-testid="submissions-count">
                  {submissions.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="brutalist-card p-8 bg-white border-2 border-black">
            <div className="flex items-center gap-4">
              <Users className="w-12 h-12 text-[#FFCC00]" />
              <div>
                <p className="text-sm text-black uppercase font-bold">Taxistas Suscritos</p>
                <p className="text-5xl font-bold text-black" data-testid="subscriber-count">
                  {subscribers.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-6 py-3 font-bold uppercase border-2 border-black transition-all ${
              activeTab === "submissions" 
                ? "bg-[#FFCC00] text-black shadow-[4px_4px_0px_0px_#000000]" 
                : "bg-white text-black hover:bg-zinc-50"
            }`}
            data-testid="tab-submissions"
          >
            Servicios Publicados
          </button>
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`px-6 py-3 font-bold uppercase border-2 border-black transition-all ${
              activeTab === "subscribers" 
                ? "bg-[#FFCC00] text-black shadow-[4px_4px_0px_0px_#000000]" 
                : "bg-white text-black hover:bg-zinc-50"
            }`}
            data-testid="tab-subscribers"
          >
            Newsletter
          </button>
        </div>

        {/* Content */}
        {loadingData ? (
          <div className="brutalist-card p-12 bg-white text-center">
            <p className="text-xl text-zinc-600">Cargando datos...</p>
          </div>
        ) : activeTab === "submissions" ? (
          <div className="brutalist-card overflow-hidden bg-white" data-testid="submissions-table">
            <div className="bg-black p-6 border-b-4 border-[#FFCC00]">
              <h2 className="text-2xl font-bold text-[#FFCC00] tracking-tight">
                SERVICIOS PUBLICADOS (PENDIENTES DE APROBACIÓN)
              </h2>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-xl text-zinc-600">No hay solicitudes pendientes</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase">#</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase">Negocio</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase">Categoría</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase">Contacto</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase">Descripción</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase">Fecha</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-black uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black">
                    {submissions.map((submission, index) => (
                      <tr key={submission.id} className="hover:bg-zinc-50" data-testid={`submission-row-${submission.id}`}>
                        <td className="px-6 py-4 text-sm font-mono">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <Building2 className="w-4 h-4 text-[#FFCC00] mt-1" />
                            <div>
                              <p className="font-bold text-black">{submission.business_name}</p>
                              {submission.website && (
                                <a href={submission.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                  {submission.website}
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-[#FFCC00] text-black px-3 py-1 text-xs font-bold uppercase">
                            {CATEGORY_NAMES[submission.service_category] || submission.service_category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium">{submission.name}</p>
                          <p className="text-xs text-zinc-600">{submission.email}</p>
                          <p className="text-xs text-zinc-600 mono">{submission.phone}</p>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm text-zinc-700 line-clamp-3">{submission.description}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600">
                          {formatDate(submission.submitted_at)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDeleteSubmission(submission.id)}
                            className="inline-flex items-center gap-1 bg-red-600 text-white px-3 py-2 border-2 border-black hover:bg-red-700 transition-colors"
                            data-testid={`delete-submission-${submission.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="brutalist-card overflow-hidden bg-white" data-testid="subscribers-table">
            <div className="bg-black p-6 border-b-4 border-[#FFCC00]">
              <h2 className="text-2xl font-bold text-[#FFCC00] tracking-tight">
                TAXISTAS SUSCRITOS AL NEWSLETTER
              </h2>
            </div>

            {subscribers.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-xl text-zinc-600">No hay suscriptores aún</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase">#</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase">Nombre</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black">
                    {subscribers.map((subscriber, index) => (
                      <tr key={subscriber.id} className="hover:bg-zinc-50" data-testid={`subscriber-row-${subscriber.id}`}>
                        <td className="px-6 py-4 text-sm font-mono">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#FFCC00]" />
                            <span className="font-medium text-black">{subscriber.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-zinc-500" />
                            <a href={`mailto:${subscriber.email}`} className="text-zinc-700 hover:text-[#FFCC00] hover:underline">
                              {subscriber.email}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm text-zinc-600">{formatDate(subscriber.subscribed_at)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button onClick={() => navigate("/")} className="btn-secondary">
            Volver al Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
