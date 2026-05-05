import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { verificationService } from '../../services/api';
import { 
  LayoutDashboard, CheckCircle2, Clock, FileCheck, BarChart3,
  LogOut, Menu, X, AlertCircle, TrendingUp, Award, Sparkles, Eye,
  XCircle, FileText, Calendar, Activity
} from 'lucide-react';

// Import des pages
import PendingPage from './PendingPage';
import HistoryPage from './HistoryPage';
import StatsPage from './StatsPage';

function Overview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentVerifications, setRecentVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getAll();
      const data = response.data.data || response.data || [];
      const verifications = Array.isArray(data) ? data : [];
      
      // Calculer les stats
      const pending = verifications.filter((v: any) => v.status === 'pending').length;
      const approved = verifications.filter((v: any) => v.status === 'approved').length;
      const rejected = verifications.filter((v: any) => v.status === 'rejected').length;
      const total = verifications.length;
      const approvalRate = total > 0 ? Math.round((approved / (approved + rejected)) * 100) || 0 : 0;
      
      setStats({ pending, approved, rejected, total, approvalRate });
      
      // Prendre les 4 dernières vérifications
      setRecentVerifications(verifications.slice(0, 4));
    } catch (error) {
      console.error('Erreur chargement données:', error);
      setStats({ pending: 0, approved: 0, rejected: 0, total: 0, approvalRate: 0 });
      setRecentVerifications([]);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="glass p-12 rounded-2xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header Premium */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative glass p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 gradient-text">
                Tableau de bord Vérificateur
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Bienvenue, <span className="font-semibold text-slate-900">{user?.name}</span></span>
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Principales */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* En attente */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-7 h-7 text-white" />
            </div>
            {stats.pending > 0 && (
              <div className="flex items-center space-x-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-bold">Urgent</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">En attente</p>
            <p className="text-4xl font-bold text-slate-900">{stats.pending}</p>
            <p className="text-sm text-slate-500">Demandes à traiter</p>
          </div>
        </div>

        {/* Approuvées */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            {stats.approved > 0 && (
              <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-bold">+{stats.approved}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Approuvées</p>
            <p className="text-4xl font-bold text-slate-900">{stats.approved}</p>
            <p className="text-sm text-slate-500">Total</p>
          </div>
        </div>

        {/* Refusées */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <XCircle className="w-7 h-7 text-white" />
            </div>
            {stats.rejected > 0 && (
              <div className="flex items-center space-x-1 text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                <span className="text-sm font-bold">{stats.rejected}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Refusées</p>
            <p className="text-4xl font-bold text-slate-900">{stats.rejected}</p>
            <p className="text-sm text-slate-500">Total</p>
          </div>
        </div>

        {/* Taux d'approbation */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Award className="w-7 h-7 text-white" />
            </div>
            {stats.approvalRate >= 90 && (
              <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-bold">Excellent</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Taux d'approbation</p>
            <p className="text-4xl font-bold text-slate-900">{stats.approvalRate}%</p>
            <p className="text-sm text-slate-500">Performance</p>
          </div>
        </div>
      </div>

      {/* Demandes Récentes et Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Demandes Récentes */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <Activity className="w-6 h-6 text-blue-600" />
              <span>Demandes Récentes</span>
            </h2>
            <Link to="/verificateur/pending" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1">
              <span>Voir tout</span>
              <Eye className="w-4 h-4" />
            </Link>
          </div>

          {recentVerifications.length === 0 ? (
            <div className="text-center py-8">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">Aucune demande récente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentVerifications.map((verification: any) => {
                const timeAgo = new Date(verification.created_at).toLocaleDateString('fr-FR');
                return (
                  <div key={verification.id} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl hover:shadow-md transition-all duration-300 group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                      verification.status === 'pending' 
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                        : verification.status === 'approved'
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-br from-red-500 to-pink-500'
                    }`}>
                      {verification.status === 'pending' ? (
                        <Clock className="w-6 h-6 text-white" />
                      ) : verification.status === 'approved' ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <XCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-slate-900">{verification.company?.name || 'Entreprise'}</h3>
                        {verification.status === 'pending' && (
                          <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                            En attente
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">Demande de vérification</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>{verification.documents_count || 0} documents</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    {verification.status === 'pending' && (
                      <Link
                        to="/verificateur/pending"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
                      >
                        Examiner
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions Rapides */}
        <div className="glass p-8 rounded-3xl card-hover">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span>Actions</span>
          </h2>

          <div className="space-y-4">
            <Link
              to="/verificateur/pending"
              className="block p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-900">Traiter les demandes</h3>
                  <p className="text-xs text-amber-700">{stats.pending} en attente</p>
                </div>
              </div>
            </Link>

            <Link
              to="/verificateur/history"
              className="block p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900">Voir l'historique</h3>
                  <p className="text-xs text-blue-700">{stats.total} vérifications</p>
                </div>
              </div>
            </Link>

            <Link
              to="/verificateur/stats"
              className="block p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-indigo-900">Mes statistiques</h3>
                  <p className="text-xs text-indigo-700">Performance</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Performance du mois */}
          <div className="mt-6 p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl">
            <div className="flex items-center space-x-3 mb-3">
              <Award className="w-6 h-6 text-emerald-600" />
              <h3 className="font-bold text-emerald-900">Performance</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-700">Vérifications</span>
                <span className="font-bold text-emerald-900">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-700">Taux d'approbation</span>
                <span className="font-bold text-emerald-900">{stats.approvalRate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-700">En attente</span>
                <span className="font-bold text-emerald-900">{stats.pending}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerificateurDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Tableau de bord', href: '/verificateur/dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
    { name: 'En attente', href: '/verificateur/pending', icon: Clock, color: 'text-amber-600' },
    { name: 'Historique', href: '/verificateur/history', icon: FileCheck, color: 'text-cyan-600' },
    { name: 'Statistiques', href: '/verificateur/stats', icon: BarChart3, color: 'text-indigo-600' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Premium */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 glass-dark transform transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="TrustRail MEA" className="h-12 w-auto" />
              <div>
                <div className="font-bold text-white text-lg">TrustRail MEA</div>
                <div className="text-xs text-white/60 font-semibold">Vérificateur</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`} />
                  <span className="font-semibold">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-3 p-3 bg-white/5 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{user?.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
                <div className="text-xs text-white/60 truncate">{user?.email}</div>
              </div>
            </div>
            <button 
              onClick={logout} 
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all duration-300 hover:scale-105 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Header */}
        <header className="glass border-b border-white/20 sticky top-0 z-40 backdrop-blur-2xl">
          <div className="flex items-center justify-between px-6 py-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden p-2 rounded-xl hover:bg-white/50 transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex-1 lg:flex-none"></div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 hidden sm:block font-medium">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          <Routes>
            <Route path="dashboard" element={<Overview />} />
            <Route path="pending" element={<PendingPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="*" element={<Navigate to="/verificateur/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
