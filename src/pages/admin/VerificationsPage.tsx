import { useState, useEffect } from 'react';
import { verificationService } from '../../services/api';
import axios from 'axios';
import { 
  FileText, Search, Clock, CheckCircle, XCircle, Eye, AlertCircle, 
  Building2, Calendar, User, FileCheck, TrendingUp, Shield, History,
  ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';

interface Company {
  id: number;
  commercial_name: string;
  trust_code: string;
  business_type: string;
  city: string;
  trust_score: number;
  verification_status: string;
  user?: {
    name: string;
    email: string;
  };
}

interface VerificationRequest {
  id: number;
  company_id: number;
  company: Company;
  status: string;
  business_proof: string;
  additional_info?: string;
  reviewed_by?: number;
  review_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewer?: {
    name: string;
  };
  documents?: any[];
}

interface Verification {
  id: number;
  company_id: number;
  verified_by: number;
  verification_type: string;
  result: string;
  notes?: string;
  score_before: number;
  score_after: number;
  verified_at: string;
  verifier?: {
    name: string;
  };
}

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [verificationHistory, setVerificationHistory] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getAll();
      const data = response.data.data?.data || response.data.data || response.data || [];
      setVerifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement vérifications:', error);
      setVerifications([]);
    } finally {
      setLoading(false);
    }
  };

  const loadVerificationHistory = async (companyId: number) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(
        `${API_URL}/api/companies/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Récupérer l'historique des vérifications depuis la company
      const company = response.data.data;
      setVerificationHistory(company.verifications || []);
      setShowHistoryModal(true);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      setVerificationHistory([]);
    }
  };

  const handleOpenModal = (verification: VerificationRequest, type: 'approve' | 'reject') => {
    setSelectedVerification(verification);
    setActionType(type);
    setActionNotes('');
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedVerification || !actionType) return;

    // Validation
    if (actionType === 'reject' && !actionNotes.trim()) {
      alert('Veuillez fournir une justification pour le refus');
      return;
    }

    try {
      setProcessing(true);
      
      if (actionType === 'approve') {
        await verificationService.approve(selectedVerification.id, actionNotes || undefined);
      } else {
        await verificationService.reject(selectedVerification.id, actionNotes);
      }

      setShowModal(false);
      setActionNotes('');
      setSelectedVerification(null);
      setActionType(null);
      await loadVerifications();
      
      // Notification de succès
      alert(actionType === 'approve' ? 'Demande approuvée avec succès !' : 'Demande refusée');
    } catch (error: any) {
      console.error('Erreur action:', error);
      alert(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setProcessing(false);
    }
  };

  const filteredVerifications = verifications.filter(v => {
    const matchesSearch = 
      v.company?.commercial_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.company?.trust_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, any> = {
      en_attente: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock, label: 'En attente' },
      en_cours: { bg: 'bg-blue-100', text: 'text-blue-700', icon: FileCheck, label: 'En cours' },
      approuve: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle, label: 'Approuvée' },
      refuse: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Refusée' },
    };
    const badge = badges[status] || badges.en_attente;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    );
  };

  const getVerificationStatusBadge = (status: string) => {
    const badges: Record<string, any> = {
      verifie: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle, label: 'Vérifié' },
      en_attente: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock, label: 'En attente' },
      refuse: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Refusé' },
      signale: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Signalé' },
    };
    const badge = badges[status] || badges.en_attente;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    );
  };

  const stats = {
    total: verifications.length,
    pending: verifications.filter(v => v.status === 'en_attente').length,
    approved: verifications.filter(v => v.status === 'approuve').length,
    rejected: verifications.filter(v => v.status === 'refuse').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative glass p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 gradient-text">
                Vérifications
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>Gestion des demandes de vérification</span>
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl">
                <FileCheck className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-slate-600">Total</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
        </div>

        <div className="glass p-6 rounded-2xl card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-slate-600">En attente</span>
          </div>
          <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
        </div>

        <div className="glass p-6 rounded-2xl card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-600">Approuvées</span>
          </div>
          <div className="text-3xl font-bold text-emerald-600">{stats.approved}</div>
        </div>

        <div className="glass p-6 rounded-2xl card-hover">
          <div className="flex items-center space-x-3 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-slate-600">Refusées</span>
          </div>
          <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="glass p-6 rounded-3xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou Trust Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="approuve">Approuvées</option>
            <option value="refuse">Refusées</option>
          </select>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des vérifications...</p>
        </div>
      ) : filteredVerifications.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucune vérification trouvée</h3>
          <p className="text-slate-600">Essayez de modifier vos filtres</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVerifications.map((verification) => (
            <div key={verification.id} className="glass p-6 rounded-3xl card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      {verification.company?.commercial_name || 'Entreprise inconnue'}
                    </h3>
                    {getStatusBadge(verification.status)}
                    {verification.company && getVerificationStatusBadge(verification.company.verification_status)}
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-slate-500">Trust Code:</span>
                        <span className="ml-2 font-medium text-slate-700">
                          {verification.company?.trust_code || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-slate-500">Activité:</span>
                        <span className="ml-2 font-medium text-slate-700">
                          {verification.company?.business_type || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-slate-500">Score:</span>
                        <span className="ml-2 font-bold text-blue-600">
                          {verification.company?.trust_score || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-slate-500">Soumis:</span>
                        <span className="ml-2 font-medium text-slate-700">
                          {new Date(verification.submitted_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bouton pour voir les détails */}
                  <button
                    onClick={() => setExpandedRequest(expandedRequest === verification.id ? null : verification.id)}
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {expandedRequest === verification.id ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span>Masquer les détails</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>Voir les détails</span>
                      </>
                    )}
                  </button>

                  {/* Détails expandables */}
                  {expandedRequest === verification.id && (
                    <div className="mt-4 space-y-3">
                      {verification.business_proof && (
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <div className="flex items-start space-x-2">
                            <FileText className="w-4 h-4 text-slate-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-slate-600 mb-1">Preuve d'activité:</div>
                              <div className="text-sm text-slate-700">{verification.business_proof}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {verification.additional_info && (
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-blue-600 mb-1">Informations supplémentaires:</div>
                              <div className="text-sm text-slate-700">{verification.additional_info}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {verification.review_notes && (
                        <div className="p-4 bg-amber-50 rounded-xl">
                          <div className="flex items-start space-x-2">
                            <User className="w-4 h-4 text-amber-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-amber-600 mb-1">
                                Notes de révision {verification.reviewer && `(par ${verification.reviewer.name})`}:
                              </div>
                              <div className="text-sm text-slate-700">{verification.review_notes}</div>
                              {verification.reviewed_at && (
                                <div className="text-xs text-slate-500 mt-1">
                                  Le {new Date(verification.reviewed_at).toLocaleDateString('fr-FR')} à{' '}
                                  {new Date(verification.reviewed_at).toLocaleTimeString('fr-FR')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {verification.company?.user && (
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <div className="flex items-start space-x-2">
                            <User className="w-4 h-4 text-slate-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-slate-600 mb-1">Propriétaire:</div>
                              <div className="text-sm text-slate-700">
                                {verification.company.user.name} ({verification.company.user.email})
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2 ml-4">
                  {verification.status === 'en_attente' && (
                    <>
                      <button
                        onClick={() => handleOpenModal(verification, 'approve')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approuver</span>
                      </button>
                      <button
                        onClick={() => handleOpenModal(verification, 'reject')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Refuser</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => loadVerificationHistory(verification.company_id)}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold transition-colors flex items-center space-x-2"
                  >
                    <History className="w-4 h-4" />
                    <span>Historique</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmation d'action */}
      {showModal && selectedVerification && actionType && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="glass max-w-2xl w-full rounded-3xl p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
              {actionType === 'approve' ? (
                <>
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                  <span>Approuver la demande de vérification</span>
                </>
              ) : (
                <>
                  <XCircle className="w-7 h-7 text-red-600" />
                  <span>Refuser la demande de vérification</span>
                </>
              )}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-slate-600 text-sm mb-1">Entreprise</div>
                <div className="text-slate-900 font-semibold text-lg">
                  {selectedVerification.company?.commercial_name}
                </div>
                <div className="text-slate-500 text-sm">
                  {selectedVerification.company?.trust_code}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-slate-600 text-sm mb-1">Type d'activité</div>
                  <div className="text-slate-900 font-semibold">
                    {selectedVerification.company?.business_type}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-slate-600 text-sm mb-1">Score actuel</div>
                  <div className="text-blue-600 font-bold text-xl">
                    {selectedVerification.company?.trust_score || 0}
                  </div>
                </div>
              </div>

              {selectedVerification.business_proof && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-blue-600 text-sm font-semibold mb-2">Preuve d'activité</div>
                  <div className="text-slate-700 text-sm">{selectedVerification.business_proof}</div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-2">
                  {actionType === 'approve' ? 'Notes (optionnel)' : 'Justification (requis)'}
                  {actionType === 'reject' && <span className="text-red-600 ml-1">*</span>}
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                  placeholder={
                    actionType === 'approve'
                      ? 'Ajoutez des notes sur cette approbation (optionnel)...'
                      : 'Expliquez pourquoi cette demande est refusée (requis)...'
                  }
                />
                {actionType === 'reject' && !actionNotes.trim() && (
                  <p className="text-red-600 text-sm mt-1">La justification est obligatoire pour un refus</p>
                )}
              </div>

              {actionType === 'approve' && (
                <div className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-emerald-900 font-semibold mb-1">Conséquences de l'approbation</div>
                      <ul className="text-emerald-700 text-sm space-y-1">
                        <li>• Le statut de l'entreprise passera à "Vérifié"</li>
                        <li>• Le score de confiance sera recalculé</li>
                        <li>• L'entreprise recevra une notification</li>
                        <li>• Le TrustPass sera mis à jour</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {actionType === 'reject' && (
                <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-red-900 font-semibold mb-1">Conséquences du refus</div>
                      <ul className="text-red-700 text-sm space-y-1">
                        <li>• Le statut de l'entreprise passera à "Refusé"</li>
                        <li>• L'entreprise devra soumettre une nouvelle demande</li>
                        <li>• L'entreprise recevra une notification avec la justification</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleConfirmAction}
                disabled={processing || (actionType === 'reject' && !actionNotes.trim())}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  actionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-emerald-300'
                    : 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300'
                } disabled:cursor-not-allowed`}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Traitement...</span>
                  </>
                ) : (
                  <>
                    {actionType === 'approve' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Confirmer l'approbation</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        <span>Confirmer le refus</span>
                      </>
                    )}
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setActionNotes('');
                  setSelectedVerification(null);
                  setActionType(null);
                }}
                disabled={processing}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'historique */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass max-w-4xl w-full rounded-3xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
                <History className="w-7 h-7 text-blue-600" />
                <span>Historique des vérifications</span>
              </h2>
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setVerificationHistory([]);
                }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <XCircle className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {verificationHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Aucun historique de vérification</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verificationHistory.map((verification, index) => (
                  <div key={verification.id} className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          verification.result === 'approuve' ? 'bg-emerald-100' :
                          verification.result === 'refuse' ? 'bg-red-100' :
                          'bg-blue-100'
                        }`}>
                          {verification.result === 'approuve' ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          ) : verification.result === 'refuse' ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            <FileCheck className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            Vérification {verification.verification_type}
                          </div>
                          <div className="text-sm text-slate-600">
                            {new Date(verification.verified_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        verification.result === 'approuve' ? 'bg-emerald-100 text-emerald-700' :
                        verification.result === 'refuse' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {verification.result === 'approuve' ? 'Approuvé' :
                         verification.result === 'refuse' ? 'Refusé' :
                         verification.result}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-white rounded-xl">
                        <div className="text-xs text-slate-500 mb-1">Score avant</div>
                        <div className="text-lg font-bold text-slate-900">{verification.score_before}</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl">
                        <div className="text-xs text-slate-500 mb-1">Score après</div>
                        <div className="text-lg font-bold text-blue-600">{verification.score_after}</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl">
                        <div className="text-xs text-slate-500 mb-1">Changement</div>
                        <div className={`text-lg font-bold ${
                          verification.score_after > verification.score_before ? 'text-emerald-600' :
                          verification.score_after < verification.score_before ? 'text-red-600' :
                          'text-slate-600'
                        }`}>
                          {verification.score_after > verification.score_before ? '+' : ''}
                          {verification.score_after - verification.score_before}
                        </div>
                      </div>
                    </div>

                    {verification.verifier && (
                      <div className="p-3 bg-white rounded-xl mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-slate-600" />
                          <div className="text-sm">
                            <span className="text-slate-500">Vérifié par:</span>
                            <span className="ml-2 font-semibold text-slate-900">{verification.verifier.name}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {verification.notes && (
                      <div className="p-3 bg-white rounded-xl">
                        <div className="text-xs font-semibold text-slate-600 mb-1">Notes:</div>
                        <div className="text-sm text-slate-700">{verification.notes}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
