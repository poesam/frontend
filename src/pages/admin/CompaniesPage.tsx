import { useState, useEffect } from 'react';
import { companyService } from '../../services/api';
import { Building2, Search, Filter, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';

interface Company {
  id: number;
  commercial_name: string;
  business_type: string;
  trust_code: string;
  phone: string;
  phone_masked: string;
  city: string;
  country_code: string;
  trust_score: number;
  verification_status: string;
  created_at: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verifie' | 'en_attente' | 'signale'>('all');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getAll();
      // Gérer différents formats de réponse paginée
      const data = response.data.data?.data || response.data.data || response.data || [];
      console.log('Companies loaded:', data);
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement entreprises:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateScore = async (id: number) => {
    try {
      await companyService.recalculateScore(id);
      loadCompanies();
    } catch (error) {
      console.error('Erreur recalcul score:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) return;
    
    try {
      await companyService.delete(id);
      loadCompanies();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.commercial_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.business_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.trust_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterVerified === 'all' || company.verification_status === filterVerified;
    return matchesSearch && matchesFilter;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { label: string; class: string } } = {
      verifie: { label: 'Vérifié', class: 'bg-emerald-100 text-emerald-700' },
      en_attente: { label: 'En attente', class: 'bg-amber-100 text-amber-700' },
      signale: { label: 'Signalé', class: 'bg-red-100 text-red-700' },
      refuse: { label: 'Refusé', class: 'bg-gray-100 text-gray-700' },
    };
    const badge = badges[status] || { label: status, class: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  const stats = {
    total: companies.length,
    verified: companies.filter(c => c.verification_status === 'verifie').length,
    pending: companies.filter(c => c.verification_status === 'en_attente').length,
    avgScore: companies.length > 0 
      ? Math.round(companies.reduce((acc, c) => acc + (c.trust_score || 0), 0) / companies.length) 
      : 0
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Gestion des Entreprises</h1>
          <p className="text-slate-600">{companies.length} entreprises enregistrées</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="glass p-6 rounded-2xl mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value as any)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            >
              <option value="all">Toutes les entreprises</option>
              <option value="verifie">Vérifiées uniquement</option>
              <option value="en_attente">En attente</option>
              <option value="signale">Signalées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold gradient-text">{stats.total}</div>
          <div className="text-sm text-slate-600">Total</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-emerald-600">{stats.verified}</div>
          <div className="text-sm text-slate-600">Vérifiées</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          <div className="text-sm text-slate-600">En attente</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{stats.avgScore}</div>
          <div className="text-sm text-slate-600">Score moyen</div>
        </div>
      </div>

      {/* Liste des entreprises */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des entreprises...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucune entreprise trouvée</h3>
          <p className="text-slate-600">Essayez de modifier vos filtres de recherche</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Entreprise</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Secteur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Contact</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Score</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Statut</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{company.commercial_name}</div>
                          <div className="text-sm text-slate-500">{company.trust_code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 capitalize">{company.business_type}</div>
                      <div className="text-xs text-slate-500">{company.city}, {company.country_code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{company.phone_masked || company.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(company.trust_score || 0)}`}>
                          {company.trust_score || 0}
                        </span>
                        <button
                          onClick={() => handleRecalculateScore(company.id)}
                          className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Recalculer le score"
                        >
                          <RefreshCw className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(company.verification_status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-cyan-100 text-cyan-600 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
