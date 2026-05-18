import { useState, useEffect } from 'react';
import { disputeService } from '../../services/api';
import type { Dispute } from '../../types';
import { 
  MessageSquare, Search, Plus, Filter, Calendar, AlertCircle, 
  CheckCircle2, Clock, XCircle, Eye, TrendingUp
} from 'lucide-react';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ouvert' | 'en_cours' | 'resolu' | 'escalade'>('all');
  const [showModal, setShowModal] = useState(false);
  const [newDispute, setNewDispute] = useState({
    transaction_id: '',
    type: 'autre',
    description: '',
  });

  useEffect(() => {
    loadDisputes();
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Récupérer l'entreprise
      const companyResponse = await fetch(`${API_URL}/api/companies/my-company`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (companyResponse.ok) {
        const companyData = await companyResponse.json();
        if (companyData.success && companyData.data) {
          const companyId = companyData.data.id;
          
          // Charger les transactions de cette entreprise
          const response = await fetch(`${API_URL}/api/transactions?company_id=${companyId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            let transactionsData = [];
            
            if (data.data?.data) {
              transactionsData = data.data.data;
            } else if (data.data) {
              transactionsData = data.data;
            }
            
            setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
          }
        }
      }
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
      setTransactions([]);
    }
  };

  const loadDisputes = async () => {
    try {
      setLoading(true);
      console.log('🔍 Chargement des litiges...');
      
      const response = await disputeService.getAll();
      console.log('📋 Réponse litiges:', response.data);
      
      // L'API peut retourner une réponse paginée : { data: { data: [...], total: X, ... } }
      // Il faut extraire le tableau 'data' de l'objet de pagination
      let disputesData = [];
      
      if (response.data.data && Array.isArray(response.data.data.data)) {
        // Cas 1: response.data.data.data (pagination Laravel)
        disputesData = response.data.data.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Cas 2: response.data.data (tableau direct)
        disputesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Cas 3: response.data (tableau direct)
        disputesData = response.data;
      }
      
      console.log('✅ Litiges extraits:', disputesData);
      console.log('📊 Nombre de litiges:', disputesData.length);
      
      setDisputes(disputesData);
    } catch (error) {
      console.error('❌ Erreur chargement litiges:', error);
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDispute = async () => {
    if (!newDispute.transaction_id || !newDispute.description) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      console.log('📤 Données envoyées:', {
        transaction_id: parseInt(newDispute.transaction_id),
        type: newDispute.type,
        description: newDispute.description,
      });
      
      const response = await disputeService.create({
        transaction_id: parseInt(newDispute.transaction_id),
        type: newDispute.type,
        description: newDispute.description,
      });
      
      console.log('✅ Réponse:', response);
      
      setShowModal(false);
      setNewDispute({ transaction_id: '', type: 'autre', description: '' });
      loadDisputes();
    } catch (error: any) {
      console.error('❌ Erreur création litige:', error);
      console.error('❌ Détails erreur:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Erreur lors de la création du litige';
      alert(errorMessage);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ouvert: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Ouvert', icon: AlertCircle },
      en_cours: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'En cours', icon: Clock },
      resolu: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Résolu', icon: CheckCircle2 },
      escalade: { bg: 'bg-red-100', text: 'text-red-700', label: 'Escaladé', icon: TrendingUp },
    };
    const badge = badges[status as keyof typeof badges] || badges.ouvert;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    );
  };

  const filteredDisputes = disputes.filter(d => {
    const matchesSearch = d.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: disputes.length,
    ouvert: disputes.filter(d => d.status === 'ouvert').length,
    en_cours: disputes.filter(d => d.status === 'en_cours').length,
    resolu: disputes.filter(d => d.status === 'resolu').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-emerald-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative glass p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 gradient-text">
                Mes Litiges
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span><span className="font-semibold text-emerald-600">{stats.total}</span> litiges au total</span>
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-xl">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="stat-card card-glow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total</p>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card card-glow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Ouverts</p>
            <p className="text-3xl font-bold text-slate-900">{stats.ouvert}</p>
          </div>
        </div>

        <div className="stat-card card-glow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">En cours</p>
            <p className="text-3xl font-bold text-slate-900">{stats.en_cours}</p>
          </div>
        </div>

        <div className="stat-card card-glow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Résolus</p>
            <p className="text-3xl font-bold text-slate-900">{stats.resolu}</p>
          </div>
        </div>
      </div>

      {/* Filtres et Actions */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un litige..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Filtre par statut */}
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            >
              <option value="all">Tous les statuts</option>
              <option value="ouvert">Ouverts</option>
              <option value="en_cours">En cours</option>
              <option value="resolu">Résolus</option>
              <option value="escalade">Escaladés</option>
            </select>
          </div>

          {/* Bouton Nouveau Litige */}
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau Litige</span>
          </button>
        </div>
      </div>

      {/* Liste des litiges */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des litiges...</p>
        </div>
      ) : filteredDisputes.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucun litige</h3>
          <p className="text-slate-600 mb-6">Vous n'avez aucun litige en cours</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Créer un litige</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredDisputes.map((dispute) => (
            <div key={dispute.id} className="glass p-6 rounded-3xl hover:shadow-xl transition-all duration-300 card-hover">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">Litige #{dispute.id}</h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(dispute.created_at).toLocaleDateString('fr-FR')}</span>
                        </span>
                        {dispute.transaction && (
                          <span className="text-xs text-slate-500">
                            Transaction: {dispute.transaction.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(dispute.status)}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl mb-4">
                    <div className="text-xs font-semibold text-slate-500 mb-1">Description du litige</div>
                    <div className="text-sm text-slate-900">{dispute.description}</div>
                  </div>

                  {dispute.resolution && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-emerald-700 mb-1">Résolution</div>
                          <div className="text-sm text-emerald-900">{dispute.resolution}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-6">
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

      {/* Modal Nouveau Litige */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass-dark max-w-2xl w-full rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Nouveau Litige</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Transaction concernée <span className="text-red-400">*</span>
                </label>
                <select
                  value={newDispute.transaction_id}
                  onChange={(e) => setNewDispute({ ...newDispute, transaction_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                >
                  <option value="" className="bg-slate-800">Sélectionnez une transaction</option>
                  {transactions.map((transaction) => (
                    <option key={transaction.id} value={transaction.id} className="bg-slate-800">
                      {transaction.description} ({transaction.amount.toLocaleString('fr-FR')} FCFA)
                    </option>
                  ))}
                </select>
                {transactions.length === 0 && (
                  <p className="text-white/60 text-xs mt-1">
                    Aucune transaction disponible. Créez d'abord une transaction.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Type de litige <span className="text-red-400">*</span>
                </label>
                <select
                  value={newDispute.type}
                  onChange={(e) => setNewDispute({ ...newDispute, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                >
                  <option value="non_livraison" className="bg-slate-800">Non livraison</option>
                  <option value="produit_non_conforme" className="bg-slate-800">Produit non conforme</option>
                  <option value="arnaque" className="bg-slate-800">Arnaque</option>
                  <option value="mauvais_service" className="bg-slate-800">Mauvais service</option>
                  <option value="autre" className="bg-slate-800">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Description du litige <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={newDispute.description}
                  onChange={(e) => setNewDispute({ ...newDispute, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                  placeholder="Décrivez en détail la raison du litige..."
                />
              </div>

              <div className="p-4 bg-amber-500/20 border border-amber-400/30 rounded-xl">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                  <div className="text-white/80 text-sm">
                    <p className="font-semibold mb-1">Important:</p>
                    <p className="text-white/60">
                      Assurez-vous de fournir tous les détails nécessaires pour faciliter la résolution du litige.
                      Notre équipe examinera votre demande dans les plus brefs délais.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreateDispute}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Créer le litige</span>
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewDispute({ transaction_id: '', type: 'autre', description: '' });
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
