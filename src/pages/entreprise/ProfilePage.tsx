import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/api';
import { 
  Building2, Phone, MapPin, Globe, Edit2, Save, 
  X, TrendingUp, Shield, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    commercial_name: '',
    legal_name: '',
    business_type: '',
    city: '',
    phone: '',
    address: '',
    website: '',
    whatsapp: '',
    facebook: '',
    instagram: '',
    description: '',
  });

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      // Charger les données de l'entreprise
      const response = await companyService.getAll();
      
      // L'API retourne une structure paginée : response.data.data.data
      const data = response.data.data?.data || response.data.data || response.data || [];
      
      const myCompany = Array.isArray(data) ? data.find((c: any) => c.user_id === user?.id) : null;
      
      setCompany(myCompany);
      
      if (myCompany) {
        setFormData({
          commercial_name: myCompany.commercial_name || '',
          legal_name: myCompany.legal_name || '',
          business_type: myCompany.business_type || '',
          city: myCompany.city || '',
          phone: myCompany.phone || '',
          address: myCompany.address || '',
          website: myCompany.website || '',
          whatsapp: myCompany.whatsapp || '',
          facebook: myCompany.facebook || '',
          instagram: myCompany.instagram || '',
          description: myCompany.description || '',
        });

        // Charger les statistiques réelles
        try {
          const statsResponse = await fetch(`${API_URL}/api/companies/${myCompany.id}/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            if (statsData.success) {
              setStats(statsData.data);
            }
          }
        } catch (statsError) {
          console.error('Erreur chargement stats:', statsError);
          // Utiliser des stats par défaut
          setStats({
            transactions: { total: 0 },
            verifications: { approved: 0 },
            disputes: { open: 0 }
          });
        }
      }
    } catch (error) {
      console.error('Erreur chargement entreprise:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!company) return;

    try {
      await companyService.update(company.id, formData);
      setEditing(false);
      loadCompanyData();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (company) {
      setFormData({
        commercial_name: company.commercial_name || '',
        legal_name: company.legal_name || '',
        business_type: company.business_type || '',
        city: company.city || '',
        phone: company.phone || '',
        address: company.address || '',
        website: company.website || '',
        whatsapp: company.whatsapp || '',
        facebook: company.facebook || '',
        instagram: company.instagram || '',
        description: company.description || '',
      });
    }
  };

  if (loading) {
    return (
      <div className="glass p-12 rounded-2xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement du profil...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="glass p-12 rounded-2xl text-center">
        <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Profil non disponible</h3>
        <p className="text-slate-600">Impossible de charger vos informations</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative glass p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 gradient-text">
                Profil de l'Entreprise
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Gérez les informations de votre entreprise</span>
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score de Confiance */}
        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-3xl card-hover text-center">
            <div className="mb-6">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                company.verification_status === 'verifie' 
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>{company.verification_status === 'verifie' ? 'Vérifié' : 'En attente de vérification'}</span>
              </div>
            </div>

            {/* Score */}
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">{company.trust_score || 25}</div>
                <p className="text-sm font-semibold text-slate-600">Score de Confiance</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-semibold text-slate-600">Niveau</span>
                <span className={`text-sm font-bold ${
                  (company.trust_score || 25) >= 80 ? 'text-emerald-600' :
                  (company.trust_score || 25) >= 50 ? 'text-blue-600' :
                  'text-amber-600'
                }`}>
                  {(company.trust_score || 25) >= 80 ? 'Excellent' :
                   (company.trust_score || 25) >= 50 ? 'Bon' :
                   'En construction'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-semibold text-slate-600">Statut</span>
                <span className={`text-sm font-bold flex items-center space-x-1 ${
                  company.verification_status === 'verifie' ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {company.verification_status === 'verifie' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Vérifié</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>En attente</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start space-x-2">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-blue-700 mb-1">TrustPass Actif</div>
                  <div className="text-sm text-blue-900">
                    Code: <span className="font-bold">{company.trust_code}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations de l'entreprise */}
        <div className="lg:col-span-2">
          <div className="glass p-8 rounded-3xl card-hover">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
                <Building2 className="w-6 h-6 text-blue-600" />
                <span>Informations</span>
              </h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Modifier</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Enregistrer</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Annuler</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Nom commercial */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-600 mb-2">
                  <Building2 className="w-4 h-4" />
                  <span>Nom commercial</span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.commercial_name}
                    onChange={(e) => setFormData({ ...formData, commercial_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900">
                    {company.commercial_name}
                  </div>
                )}
              </div>

              {/* Raison sociale */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-600 mb-2">
                  <Building2 className="w-4 h-4" />
                  <span>Raison sociale (optionnel)</span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.legal_name}
                    onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900">
                    {company.legal_name || 'Non renseignée'}
                  </div>
                )}
              </div>

              {/* Type d'activité */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-600 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Type d'activité</span>
                </label>
                {editing ? (
                  <select
                    value={formData.business_type}
                    onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  >
                    <option value="">Sélectionner</option>
                    <option value="boutique">Boutique</option>
                    <option value="livreur">Livreur</option>
                    <option value="prestataire">Prestataire</option>
                    <option value="artisan">Artisan</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="fintech">Fintech</option>
                    <option value="autre">Autre</option>
                  </select>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900 capitalize">
                    {company.business_type}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-600 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Description</span>
                </label>
                {editing ? (
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Description de votre activité"
                  />
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900">
                    {company.description || 'Non renseignée'}
                  </div>
                )}
              </div>

              {/* Ville */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Ville</span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900">
                    {company.city}
                  </div>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-600 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>Téléphone</span>
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Ex: +221 XX XX XX XX XX"
                  />
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900">
                    {company.phone || 'Non renseigné'}
                  </div>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-600 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp (optionnel)</span>
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Ex: +221 XX XX XX XX XX"
                  />
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900">
                    {company.whatsapp || 'Non renseigné'}
                  </div>
                )}
              </div>

              {/* Adresse */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Adresse</span>
                </label>
                {editing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Adresse complète de l'entreprise"
                  />
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900">
                    {company.address || 'Non renseignée'}
                  </div>
                )}
              </div>

              {/* Facebook */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-600 mb-2">
                  <Globe className="w-4 h-4" />
                  <span>Facebook (optionnel)</span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="https://facebook.com/..."
                  />
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900">
                    {company.facebook || 'Non renseigné'}
                  </div>
                )}
              </div>

              {/* Instagram */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-600 mb-2">
                  <Globe className="w-4 h-4" />
                  <span>Instagram (optionnel)</span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="@votre_compte"
                  />
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900">
                    {company.instagram || 'Non renseigné'}
                  </div>
                )}
              </div>

              {/* Site web */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-600 mb-2">
                  <Globe className="w-4 h-4" />
                  <span>Site web (optionnel)</span>
                </label>
                {editing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="https://www.exemple.com"
                  />
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900">
                    {company.website || 'Non renseigné'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="glass p-8 rounded-3xl card-hover mt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <span>Statistiques</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats?.transactions?.total || 0}
                </div>
                <p className="text-sm font-semibold text-slate-600">Transactions</p>
                <p className="text-xs text-slate-500 mt-1">Total</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-2">
                  {stats?.verifications?.approved || 0}
                </div>
                <p className="text-sm font-semibold text-slate-600">Vérifications</p>
                <p className="text-xs text-slate-500 mt-1">Approuvées</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {stats?.disputes?.open || 0}
                </div>
                <p className="text-sm font-semibold text-slate-600">Litiges</p>
                <p className="text-xs text-slate-500 mt-1">En cours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
