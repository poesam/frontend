import { useState, useEffect } from 'react';
import { verificationService } from '../../services/api';
import { 
  Clock, Search, FileText, Building2, Calendar, Eye, CheckCircle2, 
  XCircle, AlertCircle, Download, Sparkles
} from 'lucide-react';

interface VerificationRequest {
  id: number;
  company: {
    id: number;
    name: string;
    sector: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  documents_count: number;
  created_at: string;
  notes?: string;
}

export default function PendingPage() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getAll();
      const data = response.data.data || response.data || [];
      // Filtrer uniquement les demandes en attente
      const pendingOnly = Array.isArray(data) ? data.filter((v: VerificationRequest) => v.status === 'pending') : [];
      setVerifications(pendingOnly);
    } catch (error) {
      console.error('Erreur chargement vérifications:', error);
      setVerifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedVerification) return;

    if (actionType === 'reject' && !actionNotes.trim()) {
      alert('Veuillez fournir une raison pour le refus');
      return;
    }

    try {
      if (actionType === 'approve') {
        await verificationService.approve(selectedVerification.id, actionNotes);
      } else {
        await verificationService.reject(selectedVerification.id, actionNotes);
      }
      setShowModal(false);
      setActionNotes('');
      setSelectedVerification(null);
      loadVerifications();
    } catch (error) {
      console.error('Erreur action:', error);
    }
  };

  const filteredVerifications = verifications.filter(v =>
    v.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.company.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-orange-600/10 to-amber-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative glass p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 gradient-text">
                Demandes en Attente
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span><span className="font-semibold text-amber-600">{verifications.length}</span> demandes à traiter</span>
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl">
                <Clock className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="glass p-6 rounded-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Liste des demandes */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des demandes...</p>
        </div>
      ) : filteredVerifications.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucune demande en attente</h3>
          <p className="text-slate-600">Toutes les demandes ont été traitées !</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredVerifications.map((verification) => (
            <div key={verification.id} className="glass p-6 rounded-3xl hover:shadow-xl transition-all duration-300 card-hover">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{verification.company.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          <span>{verification.company.sector}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(verification.created_at).toLocaleDateString('fr-FR')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="text-xs text-slate-500 mb-1">Email</div>
                      <div className="font-semibold text-slate-900">{verification.company.email}</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="text-xs text-slate-500 mb-1">Documents soumis</div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-slate-900">{verification.documents_count} fichiers</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-amber-700 mb-1">En attente de vérification</div>
                        <div className="text-sm text-amber-900">
                          Cette demande nécessite votre examen et validation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  <button
                    onClick={() => {
                      setSelectedVerification(verification);
                      setActionType('approve');
                      setShowModal(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Approuver</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVerification(verification);
                      setActionType('reject');
                      setShowModal(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Refuser</span>
                  </button>
                  <button className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Détails</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'action */}
      {showModal && selectedVerification && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass-dark max-w-2xl w-full rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              {actionType === 'approve' ? (
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-white">
                {actionType === 'approve' ? 'Approuver' : 'Refuser'} la demande
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-white/10 rounded-xl">
                <div className="text-white/60 text-sm mb-1">Entreprise</div>
                <div className="text-white font-semibold text-lg">{selectedVerification.company.name}</div>
              </div>

              <div className="p-4 bg-white/10 rounded-xl">
                <div className="text-white/60 text-sm mb-1">Secteur</div>
                <div className="text-white font-semibold">{selectedVerification.company.sector}</div>
              </div>

              <div className="p-4 bg-white/10 rounded-xl">
                <div className="text-white/60 text-sm mb-1">Documents soumis</div>
                <div className="text-white font-semibold">{selectedVerification.documents_count} fichiers</div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Notes {actionType === 'reject' && <span className="text-red-400">(obligatoire pour refus)</span>}
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                  placeholder={actionType === 'approve' 
                    ? "Ajoutez des notes sur cette vérification (optionnel)..." 
                    : "Expliquez la raison du refus (obligatoire)..."}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleAction}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 ${
                  actionType === 'approve'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                    : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                }`}
              >
                {actionType === 'approve' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Approuver</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span>Refuser</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setActionNotes('');
                  setSelectedVerification(null);
                }}
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
