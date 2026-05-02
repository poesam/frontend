import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Building2, ShoppingBag, MessageSquare, Calendar } from 'lucide-react';

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getStats();
      setStats(response.data.data || response.data || {});
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      // Stats par défaut pour la démo
      setStats({
        companies: { total: 30, growth: 15 },
        transactions: { total: 156, growth: 23 },
        disputes: { total: 3, growth: -40 },
        avgScore: { value: 87, growth: 5 },
        revenue: { total: 45000000, growth: 18 },
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-success-600' : 'text-danger-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? TrendingUp : TrendingDown;
  };

  if (loading) {
    return (
      <div className="glass p-12 rounded-2xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Statistiques & Analytics</h1>
          <p className="text-slate-600">Vue d'ensemble des performances de la plateforme</p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
        >
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
        </select>
      </div>

      {/* KPIs Principaux */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Entreprises */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {stats.companies && (
              <div className={`flex items-center space-x-1 ${getGrowthColor(stats.companies.growth)}`}>
                {(() => {
                  const Icon = getGrowthIcon(stats.companies.growth);
                  return <Icon className="w-4 h-4" />;
                })()}
                <span className="text-sm font-semibold">{formatPercent(stats.companies.growth)}</span>
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{stats.companies?.total || 0}</div>
          <div className="text-sm text-slate-600">Entreprises</div>
        </div>

        {/* Transactions */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-success-600 to-success-700 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            {stats.transactions && (
              <div className={`flex items-center space-x-1 ${getGrowthColor(stats.transactions.growth)}`}>
                {(() => {
                  const Icon = getGrowthIcon(stats.transactions.growth);
                  return <Icon className="w-4 h-4" />;
                })()}
                <span className="text-sm font-semibold">{formatPercent(stats.transactions.growth)}</span>
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{stats.transactions?.total || 0}</div>
          <div className="text-sm text-slate-600">Transactions</div>
        </div>

        {/* Litiges */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-warning-600 to-warning-700 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            {stats.disputes && (
              <div className={`flex items-center space-x-1 ${getGrowthColor(stats.disputes.growth)}`}>
                {(() => {
                  const Icon = getGrowthIcon(stats.disputes.growth);
                  return <Icon className="w-4 h-4" />;
                })()}
                <span className="text-sm font-semibold">{formatPercent(stats.disputes.growth)}</span>
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{stats.disputes?.total || 0}</div>
          <div className="text-sm text-slate-600">Litiges</div>
        </div>

        {/* Score Moyen */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-600 to-accent-700 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            {stats.avgScore && (
              <div className={`flex items-center space-x-1 ${getGrowthColor(stats.avgScore.growth)}`}>
                {(() => {
                  const Icon = getGrowthIcon(stats.avgScore.growth);
                  return <Icon className="w-4 h-4" />;
                })()}
                <span className="text-sm font-semibold">{formatPercent(stats.avgScore.growth)}</span>
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{stats.avgScore?.value || 0}</div>
          <div className="text-sm text-slate-600">Score Moyen</div>
        </div>
      </div>

      {/* Revenus */}
      {stats.revenue && (
        <div className="glass p-8 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Volume des Transactions</h2>
              <p className="text-slate-600">Montant total traité sur la plateforme</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex items-end space-x-4">
            <div className="text-5xl font-bold gradient-text">{formatAmount(stats.revenue.total)}</div>
            <div className={`flex items-center space-x-2 mb-2 ${getGrowthColor(stats.revenue.growth)}`}>
              {(() => {
                const Icon = getGrowthIcon(stats.revenue.growth);
                return <Icon className="w-6 h-6" />;
              })()}
              <span className="text-2xl font-bold">{formatPercent(stats.revenue.growth)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Graphiques */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Croissance des Entreprises */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Croissance des Entreprises</h3>
          <div className="space-y-4">
            {[
              { month: 'Janvier', value: 5, max: 10 },
              { month: 'Février', value: 8, max: 10 },
              { month: 'Mars', value: 12, max: 15 },
              { month: 'Avril', value: 18, max: 20 },
              { month: 'Mai', value: 30, max: 30 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{item.month}</span>
                  <span className="text-sm font-bold text-primary-600">{item.value}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-accent-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par Secteur */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Répartition par Secteur</h3>
          <div className="space-y-4">
            {[
              { sector: 'Technologie', count: 8, color: 'from-blue-600 to-blue-700', percent: 27 },
              { sector: 'Restauration', count: 6, color: 'from-orange-600 to-orange-700', percent: 20 },
              { sector: 'Mode', count: 5, color: 'from-pink-600 to-pink-700', percent: 17 },
              { sector: 'Électronique', count: 4, color: 'from-purple-600 to-purple-700', percent: 13 },
              { sector: 'Autres', count: 7, color: 'from-slate-600 to-slate-700', percent: 23 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{item.sector}</span>
                  <span className="text-sm font-bold text-slate-900">{item.count} ({item.percent}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${item.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activité Récente */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-6">Activité des 7 Derniers Jours</h3>
        <div className="grid grid-cols-7 gap-2">
          {[
            { day: 'Lun', transactions: 12, height: 60 },
            { day: 'Mar', transactions: 18, height: 90 },
            { day: 'Mer', transactions: 15, height: 75 },
            { day: 'Jeu', transactions: 22, height: 100 },
            { day: 'Ven', transactions: 20, height: 95 },
            { day: 'Sam', transactions: 8, height: 40 },
            { day: 'Dim', transactions: 5, height: 25 },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-full bg-slate-100 rounded-t-xl relative" style={{ height: '200px' }}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-primary-600 to-accent-600 rounded-t-xl transition-all duration-500 flex items-end justify-center pb-2"
                  style={{ height: `${item.height}%` }}
                >
                  <span className="text-white text-xs font-bold">{item.transactions}</span>
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
