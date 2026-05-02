import { useState, useEffect } from 'react';
import { verificationService } from '../../services/api';
import { 
  FileCheck, Search, CheckCircle2, XCircle, Building2, Calendar, 
  Filter, Eye, Sparkles
} from 'lucide-react';

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
  updated_at: string;
  notes?: string;
}

export default function HistoryPage() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'rejected'>('all');
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getAll();
      const data = response.data.data || response.data || [];
      // Filtrer uniquement les demandes traitées
      const processedOnly = Array.isArray(data) 
        ? data.filter((v: VerificationRequest) => v.status !== 'pending') 
        : [];
      setVerifications(processedOnly);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      setVerifications([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredVerifications = verifications.filter(v => {
    const matchesSearch = v.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.company.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          <span>Approuvée</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200">
        <XCircle className="w-3 h-3" />
        <span>Refusée</span>
      </span>
    );
  };

  const stats = {
    total: verifications.length,
    approved: verifications.filter(v => v.status === 'approved').length,
    rejected: verifications.filter(v => v.status === 'rejected').length,
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
                Historique des Vérifications
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span><span className="font-semibold text-blue-600">{verifications.length}</span> vérifications traitées</span>
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

      {/* Filtres */}
      <div className="glass p-6 rounded-2xl">
        <div className="grid md:grid-cols-2 gap-4">
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

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          >
            <option value="all">Tous les statuts</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Refusées</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl">
          <div className="text-3xl font-bold gradient-text mb-2">{stats.total}</div>
          <div className="text-sm text-slate-600 font-semibold">Total</div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.approved}</div>
          <div className="text-sm text-slate-600 font-semibold">Approuvées</div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="text-3xl font-bold text-red-600 mb-2">{stats.rejected}</div>
          <div className="text-sm text-slate-600 font-semibold">Refusées</div>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement de l'historique...</p>
        </div>
      ) : filteredVerifications.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <FileCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucune vérification trouvée</h3>
          <p className="text-slate-600">Essayez de modifier vos filtres</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredVerifications.map((verification) => (
            <div key={verification.id} className="glass p-6 rounded-3xl hover:shadow-xl transition-all duration-300 card-hover">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                      verification.status === 'approved'
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-br from-red-500 to-pink-500'
                    }`}>
                      {verification.status === 'approved' ? (
                        <CheckCircle2 className="w-7 h-7 text-white" />
                      ) : (
                        <XCircle className="w-7 h-7 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{verification.company.name}</h3>
                        {getStatusBadge(verification.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          <span>{verification.company.sector}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Traitée le {new Date(verification.updated_at || verification.created_at).toLocaleDateString('fr-FR')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {verification.notes && (
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="text-xs font-semibold text-slate-600 mb-1">Notes :</div>
                      <div className="text-sm text-slate-700">{verification.notes}</div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedVerification(verification);
                    setShowModal(true);
                  }}
                  className="ml-6 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>Détails</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Détails */}
      {showModal && selectedVerification && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass-dark max-w-2xl w-full rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedVerification.status === 'approved'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-br from-red-500 to-pink-500'
              }`}>
                {selectedVerification.status === 'approved' ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-white">Détails de la vérification</h2>
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
                <div className="text-white/60 text-sm mb-1">Statut</div>
                <div className="text-white font-semibold">
                  {selectedVerification.status === 'approved' ? 'Approuvée' : 'Refusée'}
                </div>
              </div>

              <div className="p-4 bg-white/10 rounded-xl">
                <div className="text-white/60 text-sm mb-1">Date de traitement</div>
                <div className="text-white font-semibold">
                  {new Date(selectedVerification.updated_at || selectedVerification.created_at).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {selectedVerification.notes && (
                <div className="p-4 bg-white/10 rounded-xl">
                  <div className="text-white/60 text-sm mb-2">Notes</div>
                  <div className="text-white">{selectedVerification.notes}</div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                setSelectedVerification(null);
              }}
              className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
