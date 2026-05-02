import { useState, useEffect } from 'react';
import { verificationService } from '../../services/api';
import { 
  BarChart3, TrendingUp, Award, Clock, CheckCircle2, XCircle, 
  Calendar, Sparkles, Activity
} from 'lucide-react';

export default function StatsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getAll();
      const data = response.data.data || response.data || [];
      setVerifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      setVerifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Calcul des statistiques
  const stats = {
    total: verifications.length,
    pending: verifications.filter(v => v.status === 'pending').length,
    approved: verifications.filter(v => v.status === 'approved').length,
    rejected: verifications.filter(v => v.status === 'rejected').length,
    approvalRate: verifications.length > 0 
      ? Math.round((verifications.filter(v => v.status === 'approved').length / verifications.filter(v => v.status !== 'pending').length) * 100) || 0
      : 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-cyan-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative glass p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 gradient-text">
                Mes Statistiques
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Performance et activité de vérification</span>
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Principaux */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total</p>
            <p className="text-4xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-500">Vérifications</p>
          </div>
        </div>

        {/* En attente */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">En attente</p>
            <p className="text-4xl font-bold text-slate-900">{stats.pending}</p>
            <p className="text-sm text-slate-500">À traiter</p>
          </div>
        </div>

        {/* Approuvées */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">+15%</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Approuvées</p>
            <p className="text-4xl font-bold text-slate-900">{stats.approved}</p>
            <p className="text-sm text-slate-500">Validées</p>
          </div>
        </div>

        {/* Taux d'approbation */}
        <div className="stat-card card-glow group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <span className="text-sm font-bold">Excellent</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Taux d'approbation</p>
            <p className="text-4xl font-bold text-slate-900">{stats.approvalRate}%</p>
            <p className="text-sm text-slate-500">Performance</p>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Répartition par statut */}
        <div className="glass p-8 rounded-3xl card-hover">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Répartition par Statut</span>
          </h2>

          <div className="space-y-6">
            {/* Approuvées */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">Approuvées</span>
                </div>
                <span className="text-sm font-bold text-emerald-600">{stats.approved}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* En attente */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-slate-700">En attente</span>
                </div>
                <span className="text-sm font-bold text-amber-600">{stats.pending}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Refusées */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-semibold text-slate-700">Refusées</span>
                </div>
                <span className="text-sm font-bold text-red-600">{stats.rejected}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="glass p-8 rounded-3xl card-hover">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
            <Award className="w-6 h-6 text-blue-600" />
            <span>Performance</span>
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-emerald-700 font-semibold">Taux d'approbation</div>
                    <div className="text-3xl font-bold text-emerald-900">{stats.approvalRate}%</div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                  style={{ width: `${stats.approvalRate}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-semibold text-slate-700">Vérifications totales</span>
                <span className="text-lg font-bold text-slate-900">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-semibold text-slate-700">Temps moyen</span>
                <span className="text-lg font-bold text-slate-900">2.5h</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-semibold text-slate-700">Ce mois-ci</span>
                <span className="text-lg font-bold text-slate-900">{stats.approved + stats.rejected}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="glass p-8 rounded-3xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <span>Activité des 7 Derniers Jours</span>
        </h2>

        <div className="grid grid-cols-7 gap-2">
          {[
            { day: 'Lun', count: 3, height: 60 },
            { day: 'Mar', count: 5, height: 100 },
            { day: 'Mer', count: 4, height: 80 },
            { day: 'Jeu', count: 6, height: 120 },
            { day: 'Ven', count: 5, height: 100 },
            { day: 'Sam', count: 2, height: 40 },
            { day: 'Dim', count: 1, height: 20 },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-full bg-slate-100 rounded-t-xl relative" style={{ height: '150px' }}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-xl transition-all duration-500 flex items-end justify-center pb-2"
                  style={{ height: `${item.height}%` }}
                >
                  <span className="text-white text-xs font-bold">{item.count}</span>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-600 mt-2">{item.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
