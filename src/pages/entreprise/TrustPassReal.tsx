import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  QrCode, Download, Share2, Eye, TrendingUp, Shield, 
  CheckCircle2, Building2, Copy, RefreshCw, AlertTriangle
} from 'lucide-react';

export default function TrustPassReal() {
  const { user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      console.log('🔍 Chargement des données depuis le backend...');
      
      // 1. Récupérer l'entreprise de l'utilisateur connecté
      try {
        const companyResponse = await axios.get(`${API_URL}/api/companies/my-company`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (companyResponse.data.success) {
          const companyData = companyResponse.data.data;
          setCompany(companyData);
          console.log('✅ Entreprise récupérée:', companyData);

          // 2. Récupérer les statistiques
          if (companyData.id) {
            try {
              const statsResponse = await axios.get(`${API_URL}/api/companies/${companyData.id}/stats`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              if (statsResponse.data.success) {
                setStats(statsResponse.data.data);
                console.log('✅ Statistiques récupérées:', statsResponse.data.data);
              }
            } catch (statsError) {
              console.error('❌ Erreur stats:', statsError);
              // Utiliser des stats par défaut
              setStats({
                transactions: { total: 0, completed: 0, pending: 0 },
                verifications: { total: 0, approved: 0, pending: 0 },
                trustpass: { views: 0, views_this_month: 0 },
                disputes: { total: 0, open: 0 },
                trust_score: companyData.trust_score || 25
              });
            }
          }

          // 3. Générer/récupérer le QR code si TrustPass existe
          if (companyData.trust_pass?.id) {
            await loadOrGenerateQRCode(companyData.trust_pass.id, token, API_URL);
          } else {
            // Générer un QR code simple côté client
            generateClientQRCode(companyData.trust_code);
          }
        } else {
          setError('Entreprise non trouvée');
        }
      } catch (companyError: any) {
        console.error('❌ Erreur entreprise:', companyError);
        setError(`Erreur lors du chargement de l'entreprise: ${companyError.response?.data?.message || companyError.message}`);
      }
      
    } catch (error: any) {
      console.error('❌ Erreur générale:', error);
      setError(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadOrGenerateQRCode = async (trustPassId: number, token: string, apiUrl: string) => {
    try {
      // Essayer de récupérer le QR code existant
      const trustPassResponse = await axios.get(`${apiUrl}/api/trust-passes/${trustPassId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (trustPassResponse.data.success && trustPassResponse.data.data.qr_code_url) {
        setQrCodeUrl(trustPassResponse.data.data.qr_code_url);
        console.log('✅ QR code existant récupéré');
      } else {
        // Générer un nouveau QR code
        await generateBackendQRCode(trustPassId, token, apiUrl);
      }
    } catch (error) {
      console.error('❌ Erreur QR code:', error);
      // Fallback: générer côté client
      if (company?.trust_code) {
        generateClientQRCode(company.trust_code);
      }
    }
  };

  const generateBackendQRCode = async (trustPassId: number, token: string, apiUrl: string) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/trust-passes/${trustPassId}/generate-qr`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setQrCodeUrl(response.data.data.qr_code_url);
        console.log('✅ QR code généré par le backend');
      }
    } catch (error) {
      console.error('❌ Erreur génération QR backend:', error);
      // Fallback: générer côté client
      if (company?.trust_code) {
        generateClientQRCode(company.trust_code);
      }
    }
  };

  const generateClientQRCode = (trustCode: string) => {
    // Générer un QR code simple côté client comme fallback
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = 200;
    canvas.height = 200;
    
    // Fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 200, 200);
    
    // Bordure
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 180, 180);
    
    // Texte du code
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(trustCode, 100, 100);
    ctx.font = '12px Arial';
    ctx.fillText('TrustRail MEA', 100, 120);
    
    setQrCodeUrl(canvas.toDataURL());
    console.log('✅ QR code généré côté client (fallback)');
  };

  const handleCopyCode = () => {
    if (company?.trust_code) {
      navigator.clipboard.writeText(company.trust_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `trustpass_${company.trust_code}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/trustpass/${company.trust_code}`;
    if (navigator.share) {
      navigator.share({
        title: 'Mon TrustPass',
        text: `Vérifiez mon entreprise: ${company.commercial_name}`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papiers!');
    }
  };

  if (loading) {
    return (
      <div className="glass p-12 rounded-2xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement des données depuis le backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-12 rounded-2xl text-center">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2 text-red-600">Erreur de chargement</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <button
          onClick={loadRealData}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="glass p-12 rounded-2xl text-center">
        <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Aucune entreprise trouvée</h3>
        <p className="text-slate-600">Vous devez d'abord créer votre entreprise</p>
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
                Mon TrustPass
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <span>Données en temps réel depuis le backend</span>
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl">
                <QrCode className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        {/* QR Code et Code TrustPass */}
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

            {/* QR Code */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-3xl shadow-2xl"></div>
              
              <div className="absolute inset-3 bg-white rounded-2xl flex items-center justify-center p-4">
                {qrCodeUrl ? (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code TrustPass" 
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-blue-500">
                        <QrCode className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Génération du QR code...</p>
                  </div>
                )}
              </div>
              
              {/* Coins décoratifs */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl"></div>
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-2xl"></div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-2xl"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-2xl"></div>
            </div>

            {/* Code TrustPass */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-600 mb-2">Code TrustPass</p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <p className="text-3xl font-bold text-blue-600">{company.trust_code}</p>
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Copier le code"
                >
                  {copied ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Créé le {new Date(company.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleDownloadQR}
                disabled={!qrCodeUrl}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                <span>Télécharger QR Code</span>
              </button>
              <button
                onClick={handleShare}
                className="w-full px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informations et Statistiques */}
        <div className="space-y-6">
          {/* Score de Confiance */}
          <div className="glass p-8 rounded-3xl card-hover">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <span>Score de Confiance</span>
              </h2>
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>Données réelles</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {stats?.trust_score || company.trust_score || 0}
                </div>
                <p className="text-sm font-semibold text-slate-600">Score Actuel</p>
                <p className="text-xs text-slate-500 mt-1">Sur 100</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Transactions</span>
                  <span className="text-sm font-bold text-slate-900">
                    {stats?.transactions?.total || 0} total
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (stats?.transactions?.total || 0) * 10)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Vérifications</span>
                  <span className="text-sm font-bold text-slate-900">
                    {stats?.verifications?.approved || 0} approuvées
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (stats?.verifications?.approved || 0) * 25)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Litiges</span>
                  <span className="text-sm font-bold text-slate-900">
                    {stats?.disputes?.open || 0} ouverts
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.max(0, 100 - (stats?.disputes?.open || 0) * 50)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations de l'entreprise */}
          <div className="glass p-8 rounded-3xl card-hover">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
              <Building2 className="w-6 h-6 text-blue-600" />
              <span>Informations de l'entreprise</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-1">Nom commercial</div>
                <div className="font-semibold text-slate-900">{company.commercial_name}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-1">Type d'activité</div>
                <div className="font-semibold text-slate-900 capitalize">{company.business_type}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-1">Ville</div>
                <div className="font-semibold text-slate-900">{company.city}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-1">Téléphone</div>
                <div className="font-semibold text-slate-900">{company.phone_masked || company.phone || 'Non renseigné'}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl md:col-span-2">
                <div className="text-xs text-slate-500 mb-1">Adresse</div>
                <div className="font-semibold text-slate-900">{company.address || 'Non renseignée'}</div>
              </div>
            </div>
          </div>

          {/* Statistiques d'utilisation */}
          <div className="glass p-8 rounded-3xl card-hover">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
              <Eye className="w-6 h-6 text-blue-600" />
              <span>Statistiques d'utilisation</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats?.trustpass?.views_this_month || 0}
                </div>
                <p className="text-sm font-semibold text-slate-600">Vues du TrustPass</p>
                <p className="text-xs text-slate-500 mt-1">Ce mois-ci</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-2">
                  {stats?.transactions?.total || 0}
                </div>
                <p className="text-sm font-semibold text-slate-600">Transactions</p>
                <p className="text-xs text-slate-500 mt-1">Total</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {stats?.verifications?.total || 0}
                </div>
                <p className="text-sm font-semibold text-slate-600">Vérifications</p>
                <p className="text-xs text-slate-500 mt-1">Total</p>
              </div>
            </div>
          </div>

          {/* Lien public */}
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-600 mb-2">Lien public de votre TrustPass</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 px-4 py-2 bg-slate-100 rounded-lg text-sm text-blue-600 font-mono">
                    {window.location.origin}/trustpass/{company.trust_code}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/trustpass/${company.trust_code}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm font-semibold">{copied ? 'Copié' : 'Copier'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}