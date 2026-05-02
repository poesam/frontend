import { useState, useEffect } from 'react';
import { disputeService } from '../../services/api';
import { MessageSquare, Search, AlertCircle, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';

interface Dispute {
  id: number;
  transaction: {
    id: number;
    description: string;
    amount: number;
  };
  complainant_company: {
    name: string;
  };
  defendant_company: {
    name: string;
  };
  reason: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  resolution?: string;
  created_at: string;
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'escalated'>('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      setLoading(true);
      const response = await disputeService.getAll();
      const data = response.data.data || response.data || [];
      setDisputes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement litiges:', error);
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: number) => {
    if (!resolution.trim()) {
      alert('Veuillez fournir une résolution');
      return;
    }

    try {
      await disputeService.resolve(id, resolution);
      setShowModal(false);
      setResolution('');
      setSelectedDispute(null);
      loadDisputes();
    } catch (error) {
      console.error('Erreur résolution:', error);
    }
  };

  const handleEscalate = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir escalader ce litige ?')) return;

    try {
      await disputeService.escalate(id);
      loadDisputes();
    } catch (error) {
      console.error('Erreur escalade:', error);
    }
  };

  const filteredDisputes = disputes.filter(d => {
    const matchesSearch = d.complainant_company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.defendant_company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || d.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      open: { bg: 'bg-warning-100', text: 'text-warning-700', icon: AlertCircle, label: 'Ouvert' },
      in_progress: { bg: 'bg-primary-100', text: 'text-primary-700', icon: Clock, label: 'En cours' },
      resolved: { bg: 'bg-success-100', text: 'text-success-700', icon: CheckCircle, label: 'Résolu' },
      escalated: { bg: 'bg-danger-100', text: 'text-danger-700', icon: TrendingUp, label: 'Escaladé' },
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = {
    total: disputes.length,
    open: disputes.filter(d => d.status === 'open').length,
    inProgress: disputes.filter(d => d.status === 'in_progress').length,
    resolved: disputes.filter(d => d.status === 'resolved').length,
    escalated: disputes.filter(d => d.status === 'escalated').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Gestion des Litiges</h1>
          <p className="text-slate-600">{disputes.length} litiges enregistrés</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="glass p-6 rounded-2xl mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un litige..."
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
            <option value="open">Ouverts</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolus</option>
            <option value="escalated">Escaladés</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold gradient-text">{stats.total}</div>
          <div className="text-sm text-slate-600">Total</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-warning-600">{stats.open}</div>
          <div className="text-sm text-slate-600">Ouverts</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-primary-600">{stats.inProgress}</div>
          <div className="text-sm text-slate-600">En cours</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-success-600">{stats.resolved}</div>
          <div className="text-sm text-slate-600">Résolus</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-danger-600">{stats.escalated}</div>
          <div className="text-sm text-slate-600">Escaladés</div>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des litiges...</p>
        </div>
      ) : filteredDisputes.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucun litige trouvé</h3>
          <p className="text-slate-600">Essayez de modifier vos filtres</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDisputes.map((dispute) => (
            <div key={dispute.id} className="glass p-6 rounded-2xl hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-bold text-slate-900">Litige #{dispute.id}</h3>
                    {getStatusBadge(dispute.status)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <div className="text-xs text-slate-500 mb-1">Plaignant</div>
                      <div className="font-semibold text-slate-900">{dispute.complainant_company.name}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <div className="text-xs text-slate-500 mb-1">Défendeur</div>
                      <div className="font-semibold text-slate-900">{dispute.defendant_company.name}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-warning-50 border border-warning-200 rounded-xl mb-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-warning-700 mb-1">Raison du litige:</div>
                        <div className="text-sm text-warning-900">{dispute.reason}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Transaction:</span>
                      <span className="ml-2 font-medium text-slate-700">#{dispute.transaction.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Montant:</span>
                      <span className="ml-2 font-bold text-slate-900">{formatAmount(dispute.transaction.amount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Date:</span>
                      <span className="ml-2 font-medium text-slate-700">
                        {new Date(dispute.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  {dispute.resolution && (
                    <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-xl">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-success-600 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-success-700 mb-1">Résolution:</div>
                          <div className="text-sm text-success-900">{dispute.resolution}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {(dispute.status === 'open' || dispute.status === 'in_progress') && (
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setShowModal(true);
                      }}
                      className="px-4 py-2 bg-success-600 hover:bg-success-700 text-white rounded-xl font-medium transition-colors"
                    >
                      Résoudre
                    </button>
                    <button
                      onClick={() => handleEscalate(dispute.id)}
                      className="px-4 py-2 bg-danger-600 hover:bg-danger-700 text-white rounded-xl font-medium transition-colors"
                    >
                      Escalader
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de résolution */}
      {showModal && selectedDispute && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-dark max-w-2xl w-full rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Résoudre le litige #{selectedDispute.id}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-white/10 rounded-xl">
                <div className="text-white/60 text-sm mb-1">Plaignant</div>
                <div className="text-white font-semibold">{selectedDispute.complainant_company.name}</div>
              </div>

              <div className="p-4 bg-white/10 rounded-xl">
                <div className="text-white/60 text-sm mb-1">Défendeur</div>
                <div className="text-white font-semibold">{selectedDispute.defendant_company.name}</div>
              </div>

              <div className="p-4 bg-white/10 rounded-xl">
                <div className="text-white/60 text-sm mb-1">Raison</div>
                <div className="text-white">{selectedDispute.reason}</div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Résolution (obligatoire)
                </label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                  placeholder="Décrivez la résolution du litige..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleResolve(selectedDispute.id)}
                className="flex-1 px-6 py-3 bg-success-600 hover:bg-success-700 text-white rounded-xl font-semibold transition-colors"
              >
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Résoudre
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setResolution('');
                  setSelectedDispute(null);
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
