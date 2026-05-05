import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, 
  XCircle, Search, Filter, Calendar, Building2, Eye, RefreshCw,
  ChevronDown, ChevronUp, Activity, Award
} from 'lucide-react';

interface RiskCheck {
  id: number;
  company_id: number;
  checked_by: number | null;
  score_at_check: number;
  risk_level: string;
  risk_factors: string[];
  created_at: string;
  company?: {
    trust_code: string;
    commercial_name: string;
    verification_status: string;
  };
  checker?: {
    name: string;
  };
}

interface Company {
  id: number;
  trust_code: string;
  commercial_name: string;
  trust_score: number;
  risk_level: string;
  verification_status: string;
  completed_transactions: number;
  disputes_count: number;
  created_at: string;
}

export default function AdminRiskCheckPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [riskChecks, setRiskChecks] = useState<RiskCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingChecks, setLoadingChecks] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [expandedCheck, setExpandedCheck] = useState<number | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${API_URL}/api/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data.data?.data || response.data.data || response.data || [];
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement entreprises:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyChecks = async (companyId: number) => {
    try {
      setLoadingChecks(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(
        `${API_URL}/api/risk-checks/company/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const checksData = response.data.data.checks?.data || response.data.data.checks || [];
        setRiskChecks(Array.isArray(checksData) ? checksData : []);
      }
    } catch (error) {
      console.error('Erreur chargement risk checks:', error);
      setRiskChecks([]);
    } finally {
      setLoadingChecks(false);
    }
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    loadCompanyChecks(company.id);
  };

  const performRiskCheck = async (companyId: number) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.post(
        `${API_URL}/api/risk-checks`,
        { company_id: companyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Recharger les checks
      loadCompanyChecks(companyId);
      loadCompanies();
    } catch (error) {
      console.error('Erreur vérification de risque:', error);
      alert('Erreur lors de la vérification de risque');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-700';
    if (score >= 50) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'faible':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Faible</span>;
      case 'moyen':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">Moyen</span>;
      case 'eleve':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Élevé</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">Inconnu</span>;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verifie':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Vérifié</span>
        </span>;
      case 'en_attente':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">En attente</span>;
      case 'signale':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center space-x-1">
          <XCircle className="w-3 h-3" />
          <span>Signalé</span>
        </span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">Non vérifié</span>;
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.commercial_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.trust_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRisk === 'all' || company.risk_level === filterRisk;
    return matchesSearch && matchesFilter;
  });

  // Statistiques globales
  const stats = {
    total: companies.length,
    faible: companies.filter(c => c.risk_level === 'faible').length,
    moyen: companies.filter(c => c.risk_level === 'moyen').length,
    eleve: companies.filter(c => c.risk_level === 'eleve').length,
    avgScore: companies.length > 0 
      ? Math.round(companies.reduce((sum, c) => sum + (c.trust_score || 0), 0) / companies.length)
      : 0,
  };

  if (loading) {
    return (
      <div className="glass p-12 rounded-2xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative glass p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 gradient-text">
                Risk Check - Administration
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Gestion des vérifications de risque</span>
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="glass p-6 rounded-2xl card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-slate-600">Total</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
        </div>

        <div className="glass p-6 rounded-2xl card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-600">Risque Faible</span>
          </div>
          <div className="text-3xl font-bold text-emerald-600">{stats.faible}</div>
        </div>

        <div className="glass p-6 rounded-2xl card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-slate-600">Risque Moyen</span>
          </div>
          <div className="text-3xl font-bold text-amber-600">{stats.moyen}</div>
        </div>

        <div className="glass p-6 rounded-2xl card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-slate-600">Risque Élevé</span>
          </div>
          <div className="text-3xl font-bold text-red-600">{stats.eleve}</div>
        </div>

        <div className="glass p-6 rounded-2xl card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-slate-600">Score Moyen</span>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(stats.avgScore)}`}>{stats.avgScore}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Liste des entreprises */}
        <div className="lg:col-span-1 glass p-6 rounded-3xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Entreprises</h2>
            
            {/* Recherche */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Filtre */}
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-4 h-4 text-slate-600" />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="all">Tous les niveaux</option>
                <option value="faible">Risque faible</option>
                <option value="moyen">Risque moyen</option>
                <option value="eleve">Risque élevé</option>
              </select>
            </div>
          </div>

          {/* Liste */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredCompanies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                  selectedCompany?.id === company.id
                    ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300'
                    : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{company.commercial_name}</p>
                    <p className="text-xs text-slate-500">{company.trust_code}</p>
                  </div>
                  <div className={`text-2xl font-bold ml-2 ${getScoreColor(company.trust_score || 0)}`}>
                    {company.trust_score || 0}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getRiskLevelBadge(company.risk_level)}
                  {getVerificationBadge(company.verification_status)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Détails et historique */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCompany ? (
            <>
              {/* Détails de l'entreprise */}
              <div className="glass p-8 rounded-3xl card-hover">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedCompany.commercial_name}</h2>
                  <button
                    onClick={() => performRiskCheck(selectedCompany.id)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Nouvelle vérification</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Score actuel */}
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                    <div className={`text-6xl font-bold mb-2 ${getScoreColor(selectedCompany.trust_score || 0)}`}>
                      {selectedCompany.trust_score || 0}
                    </div>
                    <p className="text-sm font-semibold text-slate-600 mb-2">Score Actuel</p>
                    {getRiskLevelBadge(selectedCompany.risk_level)}
                  </div>

                  {/* Statistiques */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-semibold text-slate-600">Statut</span>
                      {getVerificationBadge(selectedCompany.verification_status)}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-semibold text-slate-600">Transactions</span>
                      <span className="text-sm font-bold text-slate-900">{selectedCompany.completed_transactions || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-semibold text-slate-600">Litiges</span>
                      <span className="text-sm font-bold text-slate-900">{selectedCompany.disputes_count || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-semibold text-slate-600">Créé le</span>
                      <span className="text-sm font-bold text-slate-900">
                        {new Date(selectedCompany.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historique des vérifications */}
              <div className="glass p-8 rounded-3xl card-hover">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                  <Activity className="w-6 h-6 text-blue-600" />
                  <span>Historique des vérifications</span>
                </h2>

                {loadingChecks ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Chargement...</p>
                  </div>
                ) : riskChecks.length > 0 ? (
                  <div className="space-y-3">
                    {riskChecks.map((check) => (
                      <div key={check.id} className="border-2 border-slate-200 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                          className="w-full p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getScoreBgColor(check.score_at_check)}`}>
                              <span className="text-xl font-bold">{check.score_at_check}</span>
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-slate-900">
                                {new Date(check.created_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              <p className="text-sm text-slate-600">
                                {check.checker ? `Par ${check.checker.name}` : 'Vérification automatique'}
                              </p>
                            </div>
                          </div>
                          {expandedCheck === check.id ? (
                            <ChevronUp className="w-5 h-5 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-600" />
                          )}
                        </button>

                        {expandedCheck === check.id && (
                          <div className="p-4 bg-white border-t-2 border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-3">Facteurs de risque détectés</h4>
                            {check.risk_factors && check.risk_factors.length > 0 ? (
                              <div className="space-y-2">
                                {check.risk_factors.map((factor, index) => (
                                  <div key={index} className="flex items-start space-x-2 p-3 bg-amber-50 rounded-xl">
                                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-slate-700">{factor}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-start space-x-2 p-3 bg-emerald-50 rounded-xl">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-slate-700">Aucun facteur de risque détecté</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">Aucune vérification effectuée</p>
                    <button
                      onClick={() => performRiskCheck(selectedCompany.id)}
                      className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                    >
                      Effectuer une vérification
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="glass p-12 rounded-3xl text-center">
              <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Sélectionnez une entreprise</h3>
              <p className="text-slate-600">Choisissez une entreprise dans la liste pour voir ses détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
