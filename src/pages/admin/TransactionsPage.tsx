import { useState, useEffect } from 'react';
import { transactionService } from '../../services/api';
import { ShoppingBag, Search, DollarSign, CheckCircle, Clock, XCircle, Package, FileText } from 'lucide-react';

interface Transaction {
  id: number;
  buyer?: {
    name: string;
  };
  company?: {
    commercial_name: string;
  };
  buyer_name?: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'delivered' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getAll();
      // La réponse est paginée: response.data.data.data contient le tableau
      let data;
      if (response.data.data?.data) {
        data = response.data.data.data; // Pagination Laravel
      } else if (response.data.data) {
        data = response.data.data;
      } else {
        data = response.data;
      }
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const buyerName = t.buyer?.name || t.buyer_name || '';
    const sellerName = t.company?.commercial_name || '';
    const matchesSearch = buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || t.status === filterStatus || 
                         (filterStatus === 'pending' && t.status === 'en_attente') ||
                         (filterStatus === 'paid' && (t.status === 'paid' || t.status === 'paye')) ||
                         (filterStatus === 'delivered' && (t.status === 'delivered' || t.status === 'en_livraison'));
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, any> = {
      pending: { bg: 'bg-slate-100', text: 'text-slate-700', icon: Clock, label: 'En attente' },
      en_attente: { bg: 'bg-slate-100', text: 'text-slate-700', icon: Clock, label: 'En attente' },
      paid: { bg: 'bg-primary-100', text: 'text-primary-700', icon: DollarSign, label: 'Payée' },
      paye: { bg: 'bg-primary-100', text: 'text-primary-700', icon: DollarSign, label: 'Payée' },
      delivered: { bg: 'bg-warning-100', text: 'text-warning-700', icon: Package, label: 'Livrée' },
      en_livraison: { bg: 'bg-warning-100', text: 'text-warning-700', icon: Package, label: 'En livraison' },
      completed: { bg: 'bg-success-100', text: 'text-success-700', icon: CheckCircle, label: 'Complétée' },
      livre: { bg: 'bg-success-100', text: 'text-success-700', icon: CheckCircle, label: 'Livrée' },
      cancelled: { bg: 'bg-danger-100', text: 'text-danger-700', icon: XCircle, label: 'Annulée' },
      annule: { bg: 'bg-danger-100', text: 'text-danger-700', icon: XCircle, label: 'Annulée' },
    };
    const badge = badges[status] || badges.pending;
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

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Transactions</h1>
          <p className="text-slate-600">{transactions.length} transactions enregistrées</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="glass p-6 rounded-2xl mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une transaction..."
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
            <option value="paid">Payées</option>
            <option value="delivered">Livrées</option>
            <option value="completed">Complétées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold gradient-text">{transactions.length}</div>
          <div className="text-sm text-slate-600">Total</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-slate-600">
            {transactions.filter(t => t.status === 'pending' || t.status === 'en_attente').length}
          </div>
          <div className="text-sm text-slate-600">En attente</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-primary-600">
            {transactions.filter(t => t.status === 'paid' || t.status === 'paye').length}
          </div>
          <div className="text-sm text-slate-600">Payées</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-success-600">
            {transactions.filter(t => t.status === 'completed' || t.status === 'livre' || t.status === 'delivered').length}
          </div>
          <div className="text-sm text-slate-600">Complétées</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-lg font-bold text-accent-600">{formatAmount(totalAmount)}</div>
          <div className="text-sm text-slate-600">Volume total</div>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des transactions...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucune transaction trouvée</h3>
          <p className="text-slate-600">Essayez de modifier vos filtres</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Acheteur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Vendeur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Montant</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Statut</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-600">#{transaction.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{transaction.buyer?.name || transaction.buyer_name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{transaction.company?.commercial_name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 max-w-xs truncate">{transaction.description}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-900">{formatAmount(transaction.amount)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-slate-600">
                        {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className="p-2 hover:bg-primary-100 text-primary-600 rounded-lg transition-colors"
                          title="Voir reçu"
                        >
                          <FileText className="w-4 h-4" />
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
    </div>
  );
}
