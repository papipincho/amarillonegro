import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, Mail, Calendar, ArrowLeft, LogOut } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create basic auth header
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
      
      // Store credentials in session
      sessionStorage.setItem('adminAuth', auth);
      setAuthenticated(true);
      fetchSubscribers(auth);
    } catch (err) {
      setError("Contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async (auth = null) => {
    setLoadingData(true);
    try {
      const authHeader = auth || sessionStorage.getItem('adminAuth');
      const response = await axios.get(`${API}/admin/newsletter-subscriptions`, {
        headers: {
          Authorization: `Basic ${authHeader}`,
        },
      });
      setSubscribers(response.data);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setAuthenticated(false);
    setPassword("");
    setSubscribers([]);
  };

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('adminAuth');
    if (auth) {
      setAuthenticated(true);
      fetchSubscribers(auth);
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
            <p className="text-zinc-600">Gestión de suscriptores del newsletter</p>
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

        {/* Stats Card */}
        <div className="brutalist-card p-8 mb-8 bg-[#FFCC00]">
          <div className="flex items-center gap-4">
            <Users className="w-12 h-12 text-black" />
            <div>
              <p className="text-sm text-black uppercase font-bold">Total Taxistas Suscritos</p>
              <p className="text-5xl font-bold text-black" data-testid="subscriber-count">
                {subscribers.length}
              </p>
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="brutalist-card overflow-hidden bg-white" data-testid="subscribers-table">
          <div className="bg-black p-6 border-b-4 border-[#FFCC00]">
            <h2 className="text-2xl font-bold text-[#FFCC00] tracking-tight">
              TAXISTAS SUSCRITOS
            </h2>
          </div>

          {loadingData ? (
            <div className="p-12 text-center">
              <p className="text-xl text-zinc-600">Cargando datos...</p>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-xl text-zinc-600">No hay suscriptores aún</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Fecha de Suscripción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black">
                  {subscribers.map((subscriber, index) => (
                    <tr key={subscriber.id} className="hover:bg-zinc-50" data-testid={`subscriber-row-${subscriber.id}`}>
                      <td className="px-6 py-4 text-sm font-mono text-zinc-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#FFCC00]" />
                          <span className="font-medium text-black">{subscriber.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-zinc-500" />
                          <a
                            href={`mailto:${subscriber.email}`}
                            className="text-zinc-700 hover:text-[#FFCC00] hover:underline"
                          >
                            {subscriber.email}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zinc-500" />
                          <span className="text-sm text-zinc-600">
                            {formatDate(subscriber.subscribed_at)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="btn-secondary"
          >
            Volver al Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
