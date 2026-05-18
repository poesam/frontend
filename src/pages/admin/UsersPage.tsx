import { useState, useEffect } from 'react';
import { Users, Search, Shield, UserCheck, Building2, Mail, Phone, Calendar, X, MapPin, Globe, Star, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  country_code: string;
  language: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  company?: {
    id: number;
    commercial_name: string;
    trust_code: string;
    trust_score: number;
    verification_status: string;
    business_type: string;
    city: string;
    phone: string;
    website?: string;
    completed_transactions: number;
    disputes_count: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'verificateur' | 'entreprise'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        const data = result.data?.data || result.data || [];
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = async (user: User) => {
    try {
      setProfileLoading(true);
      setShowProfileModal(true);
      
      // Charger les détails complets de l'utilisateur
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Si c'est une entreprise, charger aussi les détails de l'entreprise
      if (user.role === 'entreprise' && user.company) {
        const companyResponse = await fetch(`${API_URL}/api/companies/${user.company.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        
        const companyResult = await companyResponse.json();
        if (companyResult.success) {
          setSelectedUser({
            ...user,
            company: companyResult.data
          });
        } else {
          setSelectedUser(user);
        }
      } else {
        setSelectedUser(user);
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      setSelectedUser(user);
    } finally {
      setProfileLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5" />;
      case 'verificateur':
        return <UserCheck className="w-5 h-5" />;
      case 'entreprise':
        return <Building2 className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'bg-accent-100 text-accent-700',
      verificateur: 'bg-success-100 text-success-700',
      entreprise: 'bg-primary-100 text-primary-700',
    };
    const labels = {
      admin: 'Administrateur',
      verificateur: 'Vérificateur',
      entreprise: 'Entreprise',
    };
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${badges[role as keyof typeof badges]}`}>
        {getRoleIcon(role)}
        <span>{labels[role as keyof typeof labels]}</span>
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Gestion des Utilisateurs</h1>
          <p className="text-slate-600">{users.length} utilisateurs enregistrés</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="glass p-6 rounded-2xl mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateurs</option>
            <option value="verificateur">Vérificateurs</option>
            <option value="entreprise">Entreprises</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold gradient-text">{users.length}</div>
          <div className="text-sm text-slate-600">Total</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-accent-600">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-sm text-slate-600">Admins</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-success-600">
            {users.filter(u => u.role === 'verificateur').length}
          </div>
          <div className="text-sm text-slate-600">Vérificateurs</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-2xl font-bold text-primary-600">
            {users.filter(u => u.role === 'entreprise').length}
          </div>
          <div className="text-sm text-slate-600">Entreprises</div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des utilisateurs...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucun utilisateur trouvé</h3>
          <p className="text-slate-600">Essayez de modifier vos filtres de recherche</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="glass p-6 rounded-2xl hover:shadow-xl transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    user.role === 'admin' ? 'bg-gradient-to-br from-accent-600 to-pink-600' :
                    user.role === 'verificateur' ? 'bg-gradient-to-br from-success-600 to-emerald-600' :
                    'bg-gradient-to-br from-primary-600 to-accent-600'
                  }`}>
                    <span className="text-white text-xl font-bold">{user.name.charAt(0)}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                      {getRoleBadge(user.role)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {user.company && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-medium text-slate-700">{user.company.commercial_name}</span>
                          </div>
                          <span className="text-sm font-bold text-primary-600">
                            Score: {user.company.trust_score}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewProfile(user)}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-xl hover:bg-primary-200 transition-colors font-medium"
                  >
                    Voir profil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Profil Utilisateur */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-dark max-w-4xl w-full rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Profil Utilisateur</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {profileLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
                <p className="text-white/60">Chargement du profil...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* En-tête du profil */}
                <div className="flex items-start space-x-6 p-6 bg-white/10 rounded-xl">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                    selectedUser.role === 'admin' ? 'bg-gradient-to-br from-accent-600 to-pink-600' :
                    selectedUser.role === 'verificateur' ? 'bg-gradient-to-br from-success-600 to-emerald-600' :
                    'bg-gradient-to-br from-primary-600 to-accent-600'
                  }`}>
                    <span className="text-white text-3xl font-bold">{selectedUser.name.charAt(0)}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedUser.name}</h3>
                    <div className="flex items-center space-x-3 mb-3">
                      {getRoleBadge(selectedUser.role)}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedUser.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {selectedUser.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2 text-white/80">
                        <Mail className="w-4 h-4" />
                        <span>{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center space-x-2 text-white/80">
                          <Phone className="w-4 h-4" />
                          <span>{selectedUser.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-white/80">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedUser.country_code}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-white/80">
                        <Globe className="w-4 h-4" />
                        <span>{selectedUser.language}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations générales */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white/10 rounded-xl">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Dates importantes</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Inscription:</span>
                        <span className="text-white font-medium">
                          {new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {selectedUser.last_login_at && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Dernière connexion:</span>
                          <span className="text-white font-medium">
                            {new Date(selectedUser.last_login_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                      <Activity className="w-5 h-5" />
                      <span>Statistiques</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">ID Utilisateur:</span>
                        <span className="text-white font-mono">#{selectedUser.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Statut:</span>
                        <span className={`font-medium ${selectedUser.is_active ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedUser.is_active ? 'Compte actif' : 'Compte inactif'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations de l'entreprise (si applicable) */}
                {selectedUser.role === 'entreprise' && selectedUser.company && (
                  <div className="p-6 bg-white/10 rounded-xl">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <Building2 className="w-5 h-5" />
                      <span>Entreprise associée</span>
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-white/60 text-sm mb-1">Nom commercial</div>
                          <div className="text-white font-semibold">{selectedUser.company.commercial_name}</div>
                        </div>
                        <div>
                          <div className="text-white/60 text-sm mb-1">Code TrustRail</div>
                          <div className="text-white font-mono">{selectedUser.company.trust_code}</div>
                        </div>
                        <div>
                          <div className="text-white/60 text-sm mb-1">Type d'activité</div>
                          <div className="text-white capitalize">{selectedUser.company.business_type}</div>
                        </div>
                        <div>
                          <div className="text-white/60 text-sm mb-1">Localisation</div>
                          <div className="text-white">{selectedUser.company.city}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-white/60 text-sm mb-1">Score de confiance</div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span className="text-white font-bold text-xl">{selectedUser.company.trust_score}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60 text-sm mb-1">Statut de vérification</div>
                          <div className="text-white capitalize">{selectedUser.company.verification_status}</div>
                        </div>
                        <div>
                          <div className="text-white/60 text-sm mb-1">Transactions complétées</div>
                          <div className="text-white font-semibold">{selectedUser.company.completed_transactions}</div>
                        </div>
                        <div>
                          <div className="text-white/60 text-sm mb-1">Litiges</div>
                          <div className="flex items-center space-x-2">
                            <AlertCircle className={`w-4 h-4 ${selectedUser.company.disputes_count > 0 ? 'text-red-400' : 'text-green-400'}`} />
                            <span className="text-white font-semibold">{selectedUser.company.disputes_count}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedUser.company.website && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-white/60" />
                          <a 
                            href={selectedUser.company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-200 underline"
                          >
                            {selectedUser.company.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
