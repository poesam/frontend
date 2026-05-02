import { useState, useEffect } from 'react';
import { verificationService } from '../../services/api';
import { FileText, Search, Clock, CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';

interface VerificationRequest {
  id: number;
  company: {
    id: number;
    name: string;
    sector: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  documents_count: number;
  created_at: string;
  notes?: string;
}

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionNotes, setActionNotes] = useState('');

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getAll();
      const data = response.data.data || response.data || [];
      setVerifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement vérifications:', error);
      setVerifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await verificationService.approve(id, actionNotes);
      setShowModal(false);
      setActionNotes('');
      loadVerifications();
    } catch (error) {
      console.error('Erreur approbation:', error);
    }
  };

  const handleReject = async (id: number) => {
    if (!actionNotes.trim()) {
      alert('Veuillez fournir une raison pour le refus');
      return;
    }
    
    try {
      await verificationService.reject(id, actionNotes);
      setShowModal(false);
      setActionNotes('');
      loadVerifications();
    } catch (error) {
      console.error('Erreur refus:', error);
    }
  };

  const filteredVerifications = verifications.filter(v => {
    const matchesSearch = v.company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-warning-100', text: 'text-warning-700', icon: Clock, label: 'En attente' },
      approved: { bg: 'bg-success-100', text: 'text-success-700', icon: CheckCircle, label: 'Approuvée' },
      rejected: { bg: 'bg-danger-100', text: 'text-danger-700', icon: XCircle, label: 'Refusée' },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Vérifications</h1>
          <p className="text-slate-600">{verifications.length} demandes de vérification</p>
        </div>
      </div>

      {/* Filtres */}
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

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Refusées</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold gradient-text">{verifications.length}</div>
          <div className="text-sm text-slate-600">Total</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-warning-600">
            {verifications.filter(v => v.status === 'pending').length}
          </div>
          <div className="text-sm text-slate-600">En attente</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-success-600">
            {verifications.filter(v => v.status === 'approved').length}
          </div>
          <div className="text-sm text-slate-600">Approuvées</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-danger-600">
            {verifications.filter(v => v.status === 'rejected').length}
          </div>
          <div className="text-sm text-slate-600">Refusées</div>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des vérifications...</p>
        </div>
      ) : filteredVerifications.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucune vérification trouvée</h3>
          <p className="text-slate-600">Essayez de modifier vos filtres</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredVerifications.map((verification) => (
            <div key={verification.id} className="glass p-6 rounded-2xl hover:shadow-xl transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-bold text-slate-900">{verification.company.name}</h3>
                    {getStatusBadge(verification.status)}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-slate-500">Secteur:</span>
                      <span className="ml-2 font-medium text-slate-700">{verification.company.sector}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Documents:</span>
                      <span className="ml-2 font-medium text-slate-700">{verification.documents_count} fichiers</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Date:</span>
                      <span className="ml-2 font-medium text-slate-700">
                        {new Date(verification.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  {verification.notes && (
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-slate-600 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-slate-600 mb-1">Notes:</div>
                          <div className="text-sm text-slate-700">{verification.notes}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedVerification(verification);
                      setShowModal(true);
                    }}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-xl hover:bg-primary-200 transition-colors font-medium"
                  >
                    <Eye className="w-4 h-4 inline mr-2" />
                    Examiner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'examen */}
      {showModal && selectedVerification && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-dark max-w-2xl w-full rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Examiner la demande de vérification
            </h2>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-white/10 rounded-xl">
                <div className="text-white/60 text-sm mb-1">Entreprise</div>
                <div className="text-white font-semibold">{selectedVerification.company.name}</div>
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
                  Notes {selectedVerification.status === 'pending' && '(optionnel pour approbation, requis pour refus)'}
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                  placeholder="Ajoutez des notes sur cette vérification..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {selectedVerification.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedVerification.id)}
                    className="flex-1 px-6 py-3 bg-success-600 hover:bg-success-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    Approuver
                  </button>
                  <button
                    onClick={() => handleReject(selectedVerification.id)}
                    className="flex-1 px-6 py-3 bg-danger-600 hover:bg-danger-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    <XCircle className="w-5 h-5 inline mr-2" />
                    Refuser
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setShowModal(false);
                  setActionNotes('');
                  setSelectedVerification(null);
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
