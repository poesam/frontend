import { useState, useEffect } from 'react';
import { companyService } from '../../services/api';
import { useNotifications } from '../../hooks/useNotifications';
import { Building2, Search, Filter, Eye, Edit, Trash2, RefreshCw, Check, X, AlertTriangle, Phone, Mail, Globe, MapPin, Calendar, Star } from 'lucide-react';

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
  
  // États pour les modals
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Company>>({});
  const [actionLoading, setActionLoading] = useState(false);

  // Hook pour les notifications
  const { showSuccessNotification, showErrorNotification } = useNotifications();

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

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) return;
    
    try {
      setActionLoading(true);
      await companyService.delete(id);
      loadCompanies();
      showSuccessNotification('Entreprise supprimée avec succès');
    } catch (error) {
      console.error('Erreur suppression:', error);
      showErrorNotification('Erreur lors de la suppression');
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

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setEditForm({
      commercial_name: company.commercial_name,
      legal_name: company.legal_name,
      business_type: company.business_type,
      city: company.city,
      address: company.address,
      phone: company.phone,
      website: company.website,
      description: company.description,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCompany) return;

    try {
      setActionLoading(true);
      await companyService.update(selectedCompany.id, editForm);
      setShowEditModal(false);
      setSelectedCompany(null);
      setEditForm({});
      loadCompanies();
      showSuccessNotification('Entreprise mise à jour avec succès');
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      showErrorNotification('Erreur lors de la mise à jour');
    } finally {
      setActionLoading(false);
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
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleViewDetails(company)}
                          className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                          title="Voir détails"
                          disabled={actionLoading}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(company)}
                          className="p-2 hover:bg-cyan-100 text-cyan-600 rounded-lg transition-colors"
                          title="Modifier"
                          disabled={actionLoading}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        {/* Actions de statut */}
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
                        
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Supprimer"
                          disabled={actionLoading}
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

      {/* Modal Édition */}
      {showEditModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-dark max-w-2xl w-full rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Modifier l'entreprise</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Nom commercial</label>
                  <input
                    type="text"
                    value={editForm.commercial_name || ''}
                    onChange={(e) => setEditForm({...editForm, commercial_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Raison sociale</label>
                  <input
                    type="text"
                    value={editForm.legal_name || ''}
                    onChange={(e) => setEditForm({...editForm, legal_name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Type d'activité</label>
                  <select
                    value={editForm.business_type || ''}
                    onChange={(e) => setEditForm({...editForm, business_type: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                  >
                    <option value="boutique">Boutique</option>
                    <option value="livreur">Livreur</option>
                    <option value="prestataire">Prestataire</option>
                    <option value="artisan">Artisan</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="fintech">Fintech</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Ville</label>
                  <input
                    type="text"
                    value={editForm.city || ''}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Adresse</label>
                <input
                  type="text"
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Site web</label>
                  <input
                    type="url"
                    value={editForm.website || ''}
                    onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleSaveEdit}
                disabled={actionLoading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-colors"
              >
                {actionLoading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
