import { useState, useEffect } from 'react';
import { companyService } from '../../services/api';
import { Building2, Search, Filter, Eye, Edit, Trash2, TrendingUp, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  sector: string;
  email: string;
  phone: string;
  trust_score: number;
  is_verified: boolean;
  created_at: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getAll();
      // Gérer différents formats de réponse
      const data = response.data.data || response.data || [];
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement entreprises:', error);
      setCompanies([]); // Initialiser avec un tableau vide en cas d'erreur
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
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterVerified === 'all' ||
                         (filterVerified === 'verified' && company.is_verified) ||
                         (filterVerified === 'unverified' && !company.is_verified);
    return matchesSearch && matchesFilter;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600 bg-success-100';
    if (score >= 60) return 'text-primary-600 bg-primary-100';
    if (score >= 40) return 'text-warning-600 bg-warning-100';
    return 'text-danger-600 bg-danger-100';
  };

  // Stats sécurisées
  const stats = {
    total: companies.length,
    verified: companies.filter(c => c.is_verified).length,
    unverified: companies.filter(c => !c.is_verified).length,
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value as any)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            >
              <option value="all">Toutes les entreprises</option>
              <option value="verified">Vérifiées uniquement</option>
              <option value="unverified">Non vérifiées</option>
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
          <div className="text-2xl font-bold text-success-600">{stats.verified}</div>
          <div className="text-sm text-slate-600">Vérifiées</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-warning-600">{stats.unverified}</div>
          <div className="text-sm text-slate-600">En attente</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-primary-600">{stats.avgScore}</div>
          <div className="text-sm text-slate-600">Score moyen</div>
        </div>
      </div>

      {/* Liste des entreprises */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mx-auto mb-4"></div>
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
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{company.name}</div>
                          <div className="text-sm text-slate-500">ID: {company.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                        {company.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-slate-900">{company.email}</div>
                        <div className="text-slate-500">{company.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(company.trust_score)}`}>
                          {company.trust_score}
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
                      {company.is_verified ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-success-100 text-success-700">
                          <CheckCircle className="w-3 h-3" />
                          <span>Vérifiée</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-warning-100 text-warning-700">
                          <XCircle className="w-3 h-3" />
                          <span>En attente</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className="p-2 hover:bg-primary-100 text-primary-600 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-accent-100 text-accent-600 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="p-2 hover:bg-danger-100 text-danger-600 rounded-lg transition-colors"
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
