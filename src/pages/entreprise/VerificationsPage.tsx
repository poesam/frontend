import { useState, useEffect } from 'react';
import { verificationService } from '../../services/api';
import { 
  FileText, Search, Plus, Upload, CheckCircle2, Clock, 
  XCircle, AlertCircle, Eye, Calendar, Filter
} from 'lucide-react';

interface VerificationRequest {
  id: number;
  status: 'en_attente' | 'en_cours' | 'approuve' | 'refuse';
  business_proof?: string;
  additional_info?: string;
  review_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewer?: { name: string };
}

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleSubmitVerification = async () => {
    try {
      // D'abord, récupérer l'ID de l'entreprise de l'utilisateur connecté
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      console.log('🔍 Récupération de l\'entreprise...');
      const companyResponse = await fetch(`${API_URL}/api/companies/my-company`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!companyResponse.ok) {
        const errorText = await companyResponse.text();
        console.error('❌ Erreur récupération entreprise:', errorText);
        throw new Error('Impossible de récupérer les informations de l\'entreprise');
      }
      
      const companyData = await companyResponse.json();
      console.log('✅ Entreprise récupérée:', companyData);
      
      if (!companyData.success) {
        throw new Error('Entreprise non trouvée');
      }
      
      const companyId = companyData.data.id;
      console.log('🏢 Company ID:', companyId);
      
      // Créer la demande de vérification
      const verificationData = {
        company_id: companyId,
        business_proof: `Demande de vérification soumise avec ${documents.length} document(s). Documents: ${documents.map(d => d.name).join(', ')}`,
        additional_info: 'Demande soumise via l\'interface utilisateur'
      };
      
      console.log('📤 Données envoyées:', verificationData);
      
      const response = await verificationService.create(verificationData);
      console.log('📥 Réponse reçue:', response);
      
      if (response.data.success) {
        alert('Demande de vérification soumise avec succès !');
        setShowModal(false);
        setDocuments([]);
        loadVerifications();
      } else {
        throw new Error(response.data.message || 'Erreur lors de la soumission');
      }
    } catch (error: any) {
      console.error('❌ Erreur soumission vérification:', error);
      console.error('❌ Détails erreur:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la soumission';
      
      // Message spécifique si une demande est déjà en cours
      if (errorMessage.includes('déjà en cours')) {
        alert(`⚠️ Une demande de vérification est déjà en cours pour votre entreprise.\n\nVeuillez attendre que cette demande soit traitée par un vérificateur avant d'en soumettre une nouvelle.\n\nVous pouvez voir l'état de votre demande dans la liste ci-dessous.`);
      } else {
        alert(`Erreur: ${errorMessage}\n\nDétails: ${JSON.stringify(error.response?.data?.errors || {})}`);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      en_attente: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En attente', icon: Clock },
      en_cours: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'En cours', icon: Clock },
      approuve: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approuvée', icon: CheckCircle2 },
      refuse: { bg: 'bg-red-100', text: 'text-red-700', label: 'Refusée', icon: XCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.en_attente;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    );
  };

  const filteredVerifications = verifications.filter(v => {
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesStatus;
  });

  const stats = {
    total: verifications.length,
    pending: verifications.filter(v => v.status === 'en_attente' || v.status === 'en_cours').length,
    approved: verifications.filter(v => v.status === 'approuve').length,
    rejected: verifications.filter(v => v.status === 'refuse').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-indigo-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative glass p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 gradient-text">
                Mes Vérifications
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span><span className="font-semibold text-indigo-600">{stats.total}</span> demandes de vérification</span>
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl">
                <FileText className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="stat-card card-glow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
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
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Approuvées</p>
            <p className="text-3xl font-bold text-slate-900">{stats.approved}</p>
          </div>
        </div>

        <div className="stat-card card-glow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Refusées</p>
            <p className="text-3xl font-bold text-slate-900">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Filtres et Actions */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Filtre par statut */}
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="approuve">Approuvées</option>
              <option value="refuse">Refusées</option>
            </select>
          </div>

          {/* Bouton Nouvelle Demande */}
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvelle Demande</span>
          </button>
        </div>
      </div>

      {/* Liste des vérifications */}
      {loading ? (
        <div className="glass p-12 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des vérifications...</p>
        </div>
      ) : filteredVerifications.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucune demande de vérification</h3>
          <p className="text-slate-600 mb-6">Soumettez vos documents pour obtenir une vérification</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Créer une demande</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredVerifications.map((verification) => (
            <div key={verification.id} className="glass p-6 rounded-3xl hover:shadow-xl transition-all duration-300 card-hover">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">Demande de vérification #{verification.id}</h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(verification.submitted_at).toLocaleDateString('fr-FR')}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>Demande #{verification.id}</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(verification.status)}
                    </div>
                  </div>

                  {verification.review_notes && (
                    <div className={`p-4 rounded-xl border-2 ${
                      verification.status === 'approuve' 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start space-x-2">
                        <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          verification.status === 'approuve' ? 'text-emerald-600' : 'text-red-600'
                        }`} />
                        <div>
                          <div className={`text-xs font-semibold mb-1 ${
                            verification.status === 'approuve' ? 'text-emerald-700' : 'text-red-700'
                          }`}>
                            Notes du vérificateur
                          </div>
                          <div className={`text-sm ${
                            verification.status === 'approuve' ? 'text-emerald-900' : 'text-red-900'
                          }`}>
                            {verification.review_notes}
                          </div>
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

      {/* Modal Nouvelle Demande */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass-dark max-w-2xl w-full rounded-3xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Nouvelle Demande de Vérification</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-6 bg-white/10 rounded-xl border-2 border-dashed border-white/20">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-white/80 font-medium">
                      Cliquez pour sélectionner vos documents
                    </span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </label>
                  <p className="text-white/40 text-sm mt-2">
                    PDF, Images, Documents Word acceptés
                  </p>
                </div>

                {documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-white/80 text-sm font-medium">Fichiers sélectionnés:</p>
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                        <FileText className="w-4 h-4 text-white/60" />
                        <span className="text-white/80 text-sm flex-1">{doc.name}</span>
                        <span className="text-white/40 text-xs">{(doc.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                  <div className="text-white/80 text-sm">
                    <p className="font-semibold mb-1">Documents requis:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/60">
                      <li>Registre de commerce</li>
                      <li>Pièce d'identité du dirigeant</li>
                      <li>Justificatif de domicile</li>
                      <li>Statuts de l'entreprise</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSubmitVerification}
                disabled={documents.length === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                <span>Soumettre la demande</span>
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setDocuments([]);
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
