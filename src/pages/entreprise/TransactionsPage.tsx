import { useState, useEffect } from 'react';
import { transactionService } from '../../services/api';
import { 
  ShoppingBag, Search, Plus, Filter, Calendar, TrendingUp, 
  CheckCircle2, Clock, XCircle, Eye, Download, DollarSign
} from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'delivered' | 'cancelled';
  created_at: string;
  buyer_company?: { name: string };
  seller_company?: { name: string };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    buyer_company_id: '',
    seller_company_id: '',
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getAll();
      const data = response.data.data || response.data || [];
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await transactionService.create({
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
      });
      setShowModal(false);
      setNewTransaction({ description: '', amount: '', buyer_company_id: '', seller_company_id: '' });
      loadTransactions();
    } catch (error) {
      console.error('Erreur création transaction:', error);
      alert('Erreur lors de la création de la transaction');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En attente', icon: Clock },
      paid: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Payée', icon: CheckCircle2 },
      delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Livrée', icon: CheckCircle2 },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Annulée', icon: XCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    );
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: transactions.length,
    pending: transactions.filter(t => t.status === 'pending').length,
    completed: transactions.filter(t => t.status === 'delivered').length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-cyan-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative glass p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 gradient-text">
                Mes Transactions
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-cyan-600" />
                <span><span className="font-semibold text-cyan-600">{stats.total}</span> transactions au total</span>
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="stat-card card-glow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
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
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">En attente</p>
            <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
          </div>
        </div>

        <div className="stat-card card-glow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Complétées</p>
            <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
          </div>
        </div>

        <div className="stat-card card-glow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Montant Total</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalAmount.toLocaleString()} XOF</p>
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
              placeholder="Rechercher une transaction..."
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
              <option value="pending">En attente</option>
              <option value="paid">Payées</option>
              <option value="delivered">Livrées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>

          {/* Bouton Nouvelle Transaction */}
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvelle Transaction</span>
          </button>
        </div>
      </div>

      {/* Liste des transactions */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des transactions...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucune transaction</h3>
          <p className="text-slate-600 mb-6">Commencez par créer votre première transaction</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Créer une transaction</span>
          </button>
        </div>
      ) : (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{transaction.description}</div>
                          <div className="text-xs text-slate-500">ID: #{transaction.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-bold text-slate-900">{transaction.amount.toLocaleString()} XOF</div>
                    </td>
                    <td>{getStatusBadge(transaction.status)}</td>
                    <td>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(transaction.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Voir détails">
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Télécharger reçu">
                          <Download className="w-4 h-4 text-slate-600" />
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

      {/* Modal Nouvelle Transaction */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass-dark max-w-2xl w-full rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Nouvelle Transaction</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                  placeholder="Ex: Vente de produits électroniques"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Montant (XOF) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all"
                  placeholder="Ex: 50000"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreateTransaction}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Créer la transaction</span>
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewTransaction({ description: '', amount: '', buyer_company_id: '', seller_company_id: '' });
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
