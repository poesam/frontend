import { useState, useEffect } from 'react';
import { companyService } from '../../services/api';
import { useNotifications } from '../../hooks/useNotifications';
import { Building2, Search, Filter, Eye, RefreshCw, Check, X, AlertTriangle, Phone, Mail, Globe, MapPin, Calendar, Star, Download, BarChart3, History } from 'lucide-react';

interface Company {
  id: number;
  commercial_name: string;
  legal_name?: string;
  business_type: string;
  trust_code: string;
  phone: string;
  phone_masked: string;
  city: string;
  country_code: string;
  address?: string;
  description?: string;
  website?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  trust_score: number;
  verification_status: string;
  risk_level: string;
  activity_start_date?: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verifie' | 'en_attente' | 'signale'>('all');
  const [filterBusinessType, setFilterBusinessType] = useState<string>('all');
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  
  // États pour les modals
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Hook pour les notifications
  const { showSuccessNotification, showErrorNotification, showInfoNotification } = useNotifications();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        verification_status: filterVerified !== 'all' ? filterVerified : undefined,
        business_type: filterBusinessType !== 'all' ? filterBusinessType : undefined,
        risk_level: filterRiskLevel !== 'all' ? filterRiskLevel : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      
      const response = await companyService.getAll(params);
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
      setActionLoading(true);
      await companyService.recalculateScore(id);
      loadCompanies();
      showSuccessNotification('Score de confiance recalculé avec succès');
    } catch (error) {
      console.error('Erreur recalcul score:', error);
      showErrorNotification('Erreur lors du recalcul du score');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = async (company: Company) => {
    try {
      const response = await companyService.getById(company.id);
      setSelectedCompany(response.data.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Erreur chargement détails:', error);
      showErrorNotification('Erreur lors du chargement des détails');
    }
  };

  const handleChangeStatus = async (id: number, status: string) => {
    const statusLabels: { [key: string]: string } = {
      'verifie': 'approuver',
      'refuse': 'refuser', 
      'signale': 'signaler'
    };
    
    const action = statusLabels[status] || 'modifier le statut de';
    if (!confirm(`Êtes-vous sûr de vouloir ${action} cette entreprise ?`)) return;

    try {
      setActionLoading(true);
      
      // Utiliser les services spécialisés
      switch (status) {
        case 'verifie':
          await companyService.approve(id);
          showSuccessNotification('Entreprise approuvée avec succès');
          break;
        case 'refuse':
          await companyService.reject(id);
          showSuccessNotification('Entreprise refusée');
          break;
        case 'signale':
          await companyService.flag(id);
          showSuccessNotification('Entreprise signalée');
          break;
        default:
          await companyService.update(id, { verification_status: status });
          showSuccessNotification('Statut mis à jour');
      }
      
      loadCompanies();
    } catch (error) {
      console.error('Erreur changement statut:', error);
      showErrorNotification('Erreur lors du changement de statut');
    } finally {
      setActionLoading(false);
    }
  };

  // Gestion de la sélection
  const handleSelectCompany = (id: number) => {
    setSelectedCompanies(prev => 
      prev.includes(id) 
        ? prev.filter(companyId => companyId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCompanies.length === filteredCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(filteredCompanies.map(c => c.id));
    }
  };

  // Actions en lot
  const handleBulkAction = async (action: string) => {
    if (selectedCompanies.length === 0) {
      showErrorNotification('Aucune entreprise sélectionnée');
      return;
    }

    const actionLabels: { [key: string]: string } = {
      'verifie': 'approuver',
      'refuse': 'refuser',
      'signale': 'signaler'
    };

    const actionLabel = actionLabels[action] || action;
    if (!confirm(`Êtes-vous sûr de vouloir ${actionLabel} ${selectedCompanies.length} entreprise(s) ?`)) return;

    try {
      setActionLoading(true);
      
      // Traiter chaque entreprise sélectionnée
      const promises = selectedCompanies.map(id => {
        switch (action) {
          case 'verifie':
            return companyService.approve(id);
          case 'refuse':
            return companyService.reject(id);
          case 'signale':
            return companyService.flag(id);
          default:
            return companyService.update(id, { verification_status: action });
        }
      });

      await Promise.all(promises);
      
      setSelectedCompanies([]);
      setShowBulkActions(false);
      loadCompanies();
      showSuccessNotification(`${selectedCompanies.length} entreprise(s) ${actionLabel}(s) avec succès`);
    } catch (error) {
      console.error('Erreur action en lot:', error);
      showErrorNotification('Erreur lors de l\'action en lot');
    } finally {
      setActionLoading(false);
    }
  };

  // Tri des colonnes
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Rechargement avec les nouveaux filtres
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadCompanies();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterVerified, filterBusinessType, filterRiskLevel, sortBy, sortOrder]);

  // Export des données
  const handleExport = (format: 'csv' | 'excel') => {
    try {
      const dataToExport = filteredCompanies.map(company => ({
        'Code TrustRail': company.trust_code,
        'Nom Commercial': company.commercial_name,
        'Raison Sociale': company.legal_name || '',
        'Type d\'Activité': company.business_type,
        'Ville': company.city,
        'Pays': company.country_code,
        'Téléphone': company.phone_masked,
        'Score de Confiance': company.trust_score,
        'Niveau de Risque': company.risk_level,
        'Statut de Vérification': company.verification_status,
        'Date d\'Inscription': new Date(company.created_at).toLocaleDateString('fr-FR'),
        'Propriétaire': company.user?.name || '',
        'Email': company.user?.email || ''
      }));

      if (format === 'csv') {
        exportToCSV(dataToExport, 'entreprises-trustrail');
      } else {
        exportToExcel(dataToExport, 'entreprises-trustrail');
      }

      showSuccessNotification(`Export ${format.toUpperCase()} généré avec succès`);
    } catch (error) {
      console.error('Erreur export:', error);
      showErrorNotification('Erreur lors de l\'export');
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToExcel = (data: any[], filename: string) => {
    // Simulation d'export Excel (nécessiterait une bibliothèque comme xlsx)
    showInfoNotification('Export Excel disponible prochainement');
  };

  // Filtrage des entreprises
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.commercial_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.business_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.trust_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerification = filterVerified === 'all' || company.verification_status === filterVerified;
    const matchesBusinessType = filterBusinessType === 'all' || company.business_type === filterBusinessType;
    const matchesRiskLevel = filterRiskLevel === 'all' || company.risk_level === filterRiskLevel;
    
    return matchesSearch && matchesVerification && matchesBusinessType && matchesRiskLevel;
  });

  // Statistiques avancées
  const advancedStats = {
    total: filteredCompanies.length,
    verified: filteredCompanies.filter(c => c.verification_status === 'verifie').length,
    pending: filteredCompanies.filter(c => c.verification_status === 'en_attente').length,
    flagged: filteredCompanies.filter(c => c.verification_status === 'signale').length,
    rejected: filteredCompanies.filter(c => c.verification_status === 'refuse').length,
    avgScore: filteredCompanies.length > 0 
      ? Math.round(filteredCompanies.reduce((acc, c) => acc + (c.trust_score || 0), 0) / filteredCompanies.length) 
      : 0,
    highRisk: filteredCompanies.filter(c => c.risk_level === 'eleve').length,
    lowRisk: filteredCompanies.filter(c => c.risk_level === 'faible').length,
    byBusinessType: filteredCompanies.reduce((acc, c) => {
      acc[c.business_type] = (acc[c.business_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

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
      attention: { label: 'Attention', class: 'bg-orange-100 text-orange-700' },
    };
    const badge = badges[status] || { label: status, class: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  const getRiskBadge = (riskLevel: string) => {
    const badges: { [key: string]: { label: string; class: string } } = {
      faible: { label: 'Faible', class: 'bg-green-100 text-green-700' },
      moyen: { label: 'Moyen', class: 'bg-yellow-100 text-yellow-700' },
      eleve: { label: 'Élevé', class: 'bg-red-100 text-red-700' },
    };
    const badge = badges[riskLevel] || { label: riskLevel, class: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.class}`}>
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
          <p className="text-slate-600">{companies.length} entreprises enregistrées • {filteredCompanies.length} affichées</p>
        </div>
        
        {/* Boutons d'actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center space-x-2"
            title="Exporter en CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
          
          <button
            onClick={() => handleExport('excel')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center space-x-2"
            title="Exporter en Excel"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>
          
          <button
            onClick={loadCompanies}
            disabled={loading}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white font-semibold rounded-xl transition-colors flex items-center space-x-2"
            title="Actualiser"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        </div>
      </div>

      {/* Filtres et recherche améliorés */}
      <div className="glass p-6 rounded-2xl mb-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
              <option value="all">Tous les statuts</option>
              <option value="verifie">Vérifiées</option>
              <option value="en_attente">En attente</option>
              <option value="signale">Signalées</option>
              <option value="refuse">Refusées</option>
            </select>
          </div>

          <select
            value={filterBusinessType}
            onChange={(e) => setFilterBusinessType(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          >
            <option value="all">Tous les secteurs</option>
            <option value="boutique">Boutique</option>
            <option value="livreur">Livreur</option>
            <option value="prestataire">Prestataire</option>
            <option value="artisan">Artisan</option>
            <option value="marketplace">Marketplace</option>
            <option value="fintech">Fintech</option>
            <option value="autre">Autre</option>
          </select>

          <select
            value={filterRiskLevel}
            onChange={(e) => setFilterRiskLevel(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          >
            <option value="all">Tous les niveaux de risque</option>
            <option value="faible">Risque faible</option>
            <option value="moyen">Risque moyen</option>
            <option value="eleve">Risque élevé</option>
          </select>
        </div>

        {/* Actions en lot */}
        {selectedCompanies.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-blue-700 font-medium">
              {selectedCompanies.length} entreprise(s) sélectionnée(s)
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('verifie')}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Approuver</span>
              </button>
              <button
                onClick={() => handleBulkAction('refuse')}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Refuser</span>
              </button>
              <button
                onClick={() => handleBulkAction('signale')}
                disabled={actionLoading}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Signaler</span>
              </button>
              <button
                onClick={() => setSelectedCompanies([])}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats rapides améliorées */}
      <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold gradient-text">{advancedStats.total}</div>
          <div className="text-sm text-slate-600">Total affiché</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-emerald-600">{advancedStats.verified}</div>
          <div className="text-sm text-slate-600">Vérifiées</div>
          <div className="text-xs text-emerald-600">
            {advancedStats.total > 0 ? Math.round((advancedStats.verified / advancedStats.total) * 100) : 0}%
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-amber-600">{advancedStats.pending}</div>
          <div className="text-sm text-slate-600">En attente</div>
          <div className="text-xs text-amber-600">
            {advancedStats.total > 0 ? Math.round((advancedStats.pending / advancedStats.total) * 100) : 0}%
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-red-600">{advancedStats.flagged}</div>
          <div className="text-sm text-slate-600">Signalées</div>
          <div className="text-xs text-red-600">
            {advancedStats.total > 0 ? Math.round((advancedStats.flagged / advancedStats.total) * 100) : 0}%
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{advancedStats.avgScore}</div>
          <div className="text-sm text-slate-600">Score moyen</div>
          <div className="text-xs text-blue-600">
            Risque élevé: {advancedStats.highRisk}
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-purple-600">{Object.keys(advancedStats.byBusinessType).length}</div>
          <div className="text-sm text-slate-600">Secteurs</div>
          <div className="text-xs text-purple-600">
            {Object.entries(advancedStats.byBusinessType)
              .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
          </div>
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
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.length === filteredCompanies.length && filteredCompanies.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('commercial_name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Entreprise</span>
                      {sortBy === 'commercial_name' && (
                        <span className="text-blue-600">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('business_type')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Secteur</span>
                      {sortBy === 'business_type' && (
                        <span className="text-blue-600">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Contact</th>
                  <th 
                    className="px-6 py-4 text-center text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('trust_score')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Score</span>
                      {sortBy === 'trust_score' && (
                        <span className="text-blue-600">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-center text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('verification_status')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Statut</span>
                      {sortBy === 'verification_status' && (
                        <span className="text-blue-600">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className={`hover:bg-slate-50 transition-colors ${selectedCompanies.includes(company.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.includes(company.id)}
                        onChange={() => handleSelectCompany(company.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
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
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleViewDetails(company)}
                          className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                          title="Voir détails"
                          disabled={actionLoading}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Actions de statut uniquement */}
                        {company.verification_status === 'en_attente' && (
                          <>
                            <button
                              onClick={() => handleChangeStatus(company.id, 'verifie')}
                              className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                              title="Approuver"
                              disabled={actionLoading}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleChangeStatus(company.id, 'refuse')}
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                              title="Refuser"
                              disabled={actionLoading}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {company.verification_status !== 'signale' && (
                          <button
                            onClick={() => handleChangeStatus(company.id, 'signale')}
                            className="p-2 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors"
                            title="Signaler"
                            disabled={actionLoading}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {showDetailsModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-dark max-w-4xl w-full rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Détails de l'entreprise</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Informations générales */}
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-3">Informations générales</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Nom commercial:</span>
                      <span className="text-white font-medium">{selectedCompany.commercial_name}</span>
                    </div>
                    {selectedCompany.legal_name && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Raison sociale:</span>
                        <span className="text-white font-medium">{selectedCompany.legal_name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-white/60">Code TrustRail:</span>
                      <span className="text-white font-mono">{selectedCompany.trust_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Type d'activité:</span>
                      <span className="text-white font-medium capitalize">{selectedCompany.business_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Localisation:</span>
                      <span className="text-white font-medium">{selectedCompany.city}, {selectedCompany.country_code}</span>
                    </div>
                    {selectedCompany.address && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Adresse:</span>
                        <span className="text-white font-medium">{selectedCompany.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="p-4 bg-white/10 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-white/60" />
                      <span className="text-white">{selectedCompany.phone}</span>
                    </div>
                    {selectedCompany.user?.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-white/60" />
                        <span className="text-white">{selectedCompany.user.email}</span>
                      </div>
                    )}
                    {selectedCompany.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-white/60" />
                        <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200">
                          {selectedCompany.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Statuts et scores */}
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-3">Statuts et scores</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Statut de vérification:</span>
                      {getStatusBadge(selectedCompany.verification_status)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Score de confiance:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(selectedCompany.trust_score || 0)}`}>
                        {selectedCompany.trust_score || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Niveau de risque:</span>
                      {getRiskBadge(selectedCompany.risk_level)}
                    </div>
                  </div>
                </div>

                {/* Dates importantes */}
                <div className="p-4 bg-white/10 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-3">Dates importantes</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-white/60" />
                      <span className="text-white/60">Inscription:</span>
                      <span className="text-white">{new Date(selectedCompany.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {selectedCompany.activity_start_date && (
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-white/60" />
                        <span className="text-white/60">Début d'activité:</span>
                        <span className="text-white">{new Date(selectedCompany.activity_start_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {selectedCompany.description && (
                  <div className="p-4 bg-white/10 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                    <p className="text-white/80 text-sm">{selectedCompany.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
