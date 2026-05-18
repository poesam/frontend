import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import { 
  LayoutDashboard, Building2, Users, FileCheck, AlertTriangle, BarChart3,
  LogOut, Menu, X, Settings, TrendingUp, ShoppingCart, MessageSquare,
  Bell, Search, ChevronRight, Activity, DollarSign, Package, Clock, CheckCircle2,
  XCircle, Zap, Target, Award, Sparkles, Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';
import dashboardService, { DashboardStats, Activity as ActivityType, Alert as AlertType } from '../../services/dashboardService';
import NotificationBell from '../../components/NotificationBell';
import notificationService from '../../services/notificationService';

// Import des pages
import CompaniesPage from './CompaniesPage';
import UsersPage from './UsersPage';
import VerificationsPage from './VerificationsPage';
import TransactionsPage from './TransactionsPage';
import DisputesPage from './DisputesPage';
import StatsPage from './StatsPage';
import SettingsPage from './SettingsPage';
import RiskCheckPage from './RiskCheckPage';

function Overview() {
  const { user } = useAuth();
  const { showSuccessNotification, showErrorNotification, showInfoNotification } = useNotifications();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData, alertsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities(4),
        dashboardService.getAlerts(),
      ]);
      setStats(statsData);
      setActivities(activitiesData);
      setAlerts(alertsData.alerts);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await notificationService.createTestNotification(
        'Test de notification',
        'Ceci est une notification de test depuis le dashboard admin'
      );
      showSuccessNotification('Notification de test envoyée');
    } catch (error) {
      console.error('Erreur test notification:', error);
      showErrorNotification('Erreur lors de l\'envoi de la notification de test');
    }
  };

  const getActivityIcon = (type: string) => {
    if (type.includes('company')) return CheckCircle2;
    if (type.includes('transaction')) return Package;
    if (type.includes('dispute')) return AlertTriangle;
    if (type.includes('verification')) return FileCheck;
    return Activity;
  };

  const getActivityColor = (type: string) => {
    if (type.includes('company')) return 'from-emerald-500 to-teal-500';
    if (type.includes('transaction')) return 'from-cyan-500 to-blue-500';
    if (type.includes('dispute')) return 'from-amber-500 to-orange-500';
    if (type.includes('verification_approuve')) return 'from-blue-500 to-cyan-500';
    if (type.includes('verification_refuse')) return 'from-red-500 to-pink-500';
    return 'from-slate-500 to-gray-500';
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    if (diffInHours > 0) return `Il y a ${diffInHours}h`;
    return 'À l\'instant';
  };

  const getAlertIcon = (category: string) => {
    if (category === 'disputes') return MessageSquare;
    if (category === 'verifications') return FileCheck;
    if (category === 'companies') return Building2;
    if (category === 'risk') return Target;
    if (category === 'transactions') return ShoppingCart;
    return AlertTriangle;
  };

  const getAlertColorClasses = (type: string) => {
    if (type === 'danger') return {
      bg: 'from-red-50 to-pink-50',
      border: 'border-red-200',
      icon: 'from-red-500 to-pink-500',
      text: 'text-red-900',
      subtext: 'text-red-700'
    };
    if (type === 'warning') return {
      bg: 'from-amber-50 to-orange-50',
      border: 'border-amber-200',
      icon: 'from-amber-500 to-orange-500',
      text: 'text-amber-900',
      subtext: 'text-amber-700'
    };
    return {
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      icon: 'from-blue-500 to-cyan-500',
      text: 'text-blue-900',
      subtext: 'text-blue-700'
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Erreur lors du chargement des statistiques</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header avec animation */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative glass p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 gradient-text">
                Tableau de bord Admin
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>Bienvenue, <span className="font-semibold text-slate-900">{user?.name}</span></span>
              </p>
            </div>
            
            {/* Bouton test notification */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleTestNotification}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                title="Tester les notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Test Notification</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats principales avec design premium - Données réelles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Entreprises */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">+{stats.trends.new_companies}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Entreprises</p>
            <p className="text-4xl font-bold text-slate-900">{stats.companies.total}</p>
            <p className="text-sm text-slate-500">{stats.companies.verified} vérifiées</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">+{stats.trends.new_transactions}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Transactions</p>
            <p className="text-4xl font-bold text-slate-900">{stats.transactions.total}</p>
            <p className="text-sm text-slate-500">{stats.transactions.completed} complétées</p>
          </div>
        </div>

        {/* Litiges */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            {stats.disputes.open > 0 && (
              <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-1 rounded-full">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-bold">{stats.disputes.open}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Litiges</p>
            <p className="text-4xl font-bold text-slate-900">{stats.disputes.total}</p>
            <p className="text-sm text-slate-500">{stats.disputes.resolved} résolus</p>
          </div>
        </div>

        {/* Score Moyen */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">Excellent</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Score Moyen</p>
            <p className="text-4xl font-bold text-slate-900">{stats.average_trust_score || 0}</p>
            <p className="text-sm text-slate-500">De confiance</p>
          </div>
        </div>
      </div>

      {/* Graphiques et activités */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activités Récentes */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <Activity className="w-6 h-6 text-blue-600" />
              <span>Activités Récentes</span>
            </h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1">
              <span>Voir tout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl hover:shadow-md transition-all duration-300 group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                      <p className="text-sm text-slate-600">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <p className="text-xs text-slate-500">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>

        {/* Alertes */}
        <div className="glass p-8 rounded-3xl card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <Zap className="w-6 h-6 text-amber-600" />
              <span>Alertes</span>
            </h2>
          </div>
          <div className="space-y-4">
            {alerts.length > 0 ? (
              alerts.slice(0, 3).map((alert, index) => {
                const Icon = getAlertIcon(alert.category);
                const colors = getAlertColorClasses(alert.type);
                return (
                  <div key={index} className={`p-5 bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-2xl hover:shadow-lg transition-all duration-300`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.icon} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${colors.text} mb-1`}>{alert.title}</h3>
                        <p className={`text-sm ${colors.subtext}`}>{alert.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
                <p className="font-semibold text-emerald-600">Tout va bien !</p>
                <p className="text-sm">Aucune alerte</p>
              </div>
            )}
            
            {/* Objectif mensuel */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900 mb-1">Objectif mensuel</h3>
                  <p className="text-sm text-blue-700">
                    {stats.companies.total} / 50 entreprises
                  </p>
                  <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min((stats.companies.total / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass p-8 rounded-3xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <span>Actions Rapides</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Building2, label: 'Gérer Entreprises', color: 'from-blue-500 to-blue-600', link: '/admin/companies' },
            { icon: FileCheck, label: 'Vérifications', color: 'from-cyan-500 to-blue-600', link: '/admin/verifications' },
            { icon: MessageSquare, label: 'Résoudre Litiges', color: 'from-amber-500 to-orange-600', link: '/admin/disputes' },
            { icon: BarChart3, label: 'Voir Statistiques', color: 'from-indigo-500 to-blue-600', link: '/admin/stats' },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="group p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {action.label}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
    { name: 'Entreprises', href: '/admin/companies', icon: Building2, color: 'text-cyan-600' },
    { name: 'Utilisateurs', href: '/admin/users', icon: Users, color: 'text-indigo-600' },
    { name: 'Vérifications', href: '/admin/verifications', icon: FileCheck, color: 'text-blue-500' },
    { name: 'Risk Check', href: '/admin/risk-check', icon: Shield, color: 'text-purple-600' },
    { name: 'Transactions', href: '/admin/transactions', icon: ShoppingCart, color: 'text-cyan-500' },
    { name: 'Litiges', href: '/admin/disputes', icon: AlertTriangle, color: 'text-amber-600' },
    { name: 'Statistiques', href: '/admin/stats', icon: BarChart3, color: 'text-blue-700' },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings, color: 'text-slate-600' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar premium */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 glass-dark transform transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="TrustRail MEA" className="h-12 w-auto" />
              <div>
                <div className="font-bold text-white text-lg">TrustRail MEA</div>
                <div className="text-xs text-white/60 font-semibold">Administration</div>
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

          {/* User profile */}
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

      {/* Main content */}
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
              <NotificationBell />
              <span className="text-sm text-slate-600 hidden sm:block font-medium">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8">
          <Routes>
            <Route path="dashboard" element={<Overview />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="verifications" element={<VerificationsPage />} />
            <Route path="risk-check" element={<RiskCheckPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="disputes" element={<DisputesPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
