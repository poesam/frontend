import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Building2, QrCode, FileText, AlertCircle, 
  LogOut, Menu, X, TrendingUp, ShoppingBag, MessageSquare,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

// Import des pages
import TrustPassPage from './TrustPassPage';
import TransactionsPage from './TransactionsPage';
import VerificationsPage from './VerificationsPage';
import DisputesPage from './DisputesPage';
import ProfilePage from './ProfilePage';
import ReceiptPage from './ReceiptPage';

// Pages du dashboard entreprise
function Overview() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8">
      {/* Header Premium */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative glass p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 gradient-text">
                Tableau de bord Entreprise
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Bienvenue, <span className="font-semibold text-slate-900">{user?.name}</span></span>
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Principales */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Score de Confiance */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">+5</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Score de Confiance</p>
            <p className="text-4xl font-bold text-slate-900">85</p>
            <p className="text-sm text-slate-500">Excellent niveau</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">+8</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Transactions</p>
            <p className="text-4xl font-bold text-slate-900">12</p>
            <p className="text-sm text-slate-500">Ce mois-ci</p>
          </div>
        </div>

        {/* Vérifications */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-bold">OK</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Vérifications</p>
            <p className="text-4xl font-bold text-slate-900">3</p>
            <p className="text-sm text-slate-500">Approuvées</p>
          </div>
        </div>

        {/* Litiges */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">0</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Litiges</p>
            <p className="text-4xl font-bold text-slate-900">0</p>
            <p className="text-sm text-slate-500">En cours</p>
          </div>
        </div>
      </div>

      {/* TrustPass et Transactions Récentes */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mon TrustPass */}
        <div className="glass p-8 rounded-3xl card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <QrCode className="w-6 h-6 text-blue-600" />
              <span>Mon TrustPass</span>
            </h2>
          </div>
          
          <div className="text-center mb-6">
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
              <QrCode className="w-32 h-32 text-blue-600" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-600">Code TrustPass</p>
              <p className="text-2xl font-bold text-blue-600">TP-2024-001</p>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>Vérifié</span>
              </div>
            </div>
          </div>

          <Link
            to="/entreprise/trustpass"
            className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Voir les détails
          </Link>
        </div>

        {/* Transactions Récentes */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl card-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <span>Transactions Récentes</span>
            </h2>
            <Link to="/entreprise/transactions" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1">
              <span>Voir tout</span>
              <FileText className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 1,
                description: 'Vente de produits électroniques',
                amount: 45000,
                status: 'completed',
                date: 'Il y a 2h',
              },
              {
                id: 2,
                description: 'Service de livraison',
                amount: 15000,
                status: 'pending',
                date: 'Il y a 5h',
              },
              {
                id: 3,
                description: 'Achat de fournitures',
                amount: 28000,
                status: 'completed',
                date: 'Il y a 1 jour',
              },
            ].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                    transaction.status === 'completed'
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                      : 'bg-gradient-to-br from-amber-500 to-orange-500'
                  }`}>
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{transaction.description}</p>
                    <p className="text-xs text-slate-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{transaction.amount.toLocaleString()} XOF</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    transaction.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {transaction.status === 'completed' ? 'Complétée' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions Rapides */}
      <div className="glass p-8 rounded-3xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
          <LayoutDashboard className="w-6 h-6 text-blue-600" />
          <span>Actions Rapides</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: QrCode, label: 'Mon TrustPass', color: 'from-blue-500 to-blue-600', link: '/entreprise/trustpass' },
            { icon: ShoppingBag, label: 'Nouvelle Transaction', color: 'from-cyan-500 to-blue-600', link: '/entreprise/transactions' },
            { icon: FileText, label: 'Demander Vérification', color: 'from-indigo-500 to-blue-600', link: '/entreprise/verifications' },
            { icon: Building2, label: 'Mon Profil', color: 'from-blue-700 to-cyan-600', link: '/entreprise/company' },
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

export default function EntrepriseDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Tableau de bord', href: '/entreprise/dashboard', icon: LayoutDashboard },
    { name: 'Mon Entreprise', href: '/entreprise/company', icon: Building2 },
    { name: 'Mon TrustPass', href: '/entreprise/trustpass', icon: QrCode },
    { name: 'Transactions', href: '/entreprise/transactions', icon: ShoppingBag },
    { name: 'Vérifications', href: '/entreprise/verifications', icon: FileText },
    { name: 'Litiges', href: '/entreprise/disputes', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 glass-dark transform transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="TrustRail MEA" className="h-12 w-auto" />
              <div>
                <div className="font-bold text-white text-lg">TrustRail MEA</div>
                <div className="text-xs text-white/60 font-semibold">Entreprise</div>
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

          {/* User */}
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
        {/* Top bar */}
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

        {/* Page content */}
        <main className="p-6 lg:p-8">
          <Routes>
            <Route path="dashboard" element={<Overview />} />
            <Route path="company" element={<ProfilePage />} />
            <Route path="trustpass" element={<TrustPassPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="transactions/:id/receipt" element={<ReceiptPage />} />
            <Route path="verifications" element={<VerificationsPage />} />
            <Route path="disputes" element={<DisputesPage />} />
            <Route path="*" element={<Navigate to="/entreprise/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
