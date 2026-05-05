import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/api';
import axios from 'axios';
import { 
  QrCode, Download, Share2, Eye, TrendingUp, Shield, 
  CheckCircle2, Calendar, Building2, Sparkles, Copy, ExternalLink, RefreshCw
} from 'lucide-react';

export default function TrustPassPage() {
  const { user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<any>(null);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const response = await companyService.getAll();
      
      // L'API retourne une structure paginée : response.data.data.data
      const data = response.data.data?.data || response.data.data || response.data || [];
      
      // Chercher l'entreprise de l'utilisateur connecté
      const myCompany = Array.isArray(data) ? data.find((c: any) => c.user_id === user?.id) : null;
      
      setCompany(myCompany);

      // Charger le QR code s'il existe
      if (myCompany?.trust_pass?.id) {
        await loadQRCode(myCompany.trust_pass.id);
      }
    } catch (error) {
      console.error('Erreur chargement entreprise:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQRCode = async (trustPassId: number) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${API_URL}/api/trust-passes/${trustPassId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data.qr_code_url) {
        setQrCodeData({
          url: response.data.data.qr_code_url,
          publicUrl: response.data.data.public_url
        });
      }
    } catch (error) {
      console.error('Erreur chargement QR code:', error);
    }
  };

  const handleGenerateQR = async () => {
    if (!company?.trust_pass?.id) return;

    try {
      setGeneratingQR(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(
        `${API_URL}/api/trust-passes/${company.trust_pass.id}/generate-qr`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setQrCodeData({
          url: response.data.data.qr_code_url,
          publicUrl: response.data.data.public_url,
          svg: response.data.data.qr_code_svg
        });
      }
    } catch (error) {
      console.error('Erreur génération QR code:', error);
      alert('Erreur lors de la génération du QR code');
    } finally {
      setGeneratingQR(false);
    }
  };

  const handleCopyCode = () => {
    if (company?.trust_code) {
      navigator.clipboard.writeText(company.trust_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = async () => {
    if (!company?.trust_pass?.id) return;

    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(
        `${API_URL}/api/trust-passes/${company.trust_pass.id}/download-qr`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `trustpass_${company.trust_code}.svg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur téléchargement QR code:', error);
      alert('Erreur lors du téléchargement du QR code');
    }
  };

  const handleShare = () => {
    // Logique de partage
    if (navigator.share && company?.trust_code) {
      navigator.share({
        title: 'Mon TrustPass',
        text: `Vérifiez mon entreprise avec le code TrustPass: ${company.trust_code}`,
        url: `${window.location.origin}/trustpass/${company.trust_code}`
      });
    } else {
      alert('Partage non disponible sur ce navigateur');
    }
  };

  if (loading) {
    return (
      <div className="glass p-12 rounded-2xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement de votre TrustPass...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="glass p-12 rounded-2xl text-center">
        <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">TrustPass non disponible</h3>
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
                Mon TrustPass
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <span>Votre identité de confiance numérique</span>
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
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span>Vérifié</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              {/* Fond avec gradient et ombre */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-3xl shadow-2xl"></div>
              
              {/* Conteneur blanc pour le QR code */}
              <div className="absolute inset-3 bg-white rounded-2xl flex items-center justify-center p-4">
                {qrCodeData?.url ? (
                  <div className="w-full h-full flex items-center justify-center relative">
                    {/* QR Code avec style arrondi */}
                    <div className="qr-code-container">
                      <img 
                        src={qrCodeData.url} 
                        alt="QR Code TrustPass" 
                        className="max-w-full max-h-full object-contain"
                        style={{
                          imageRendering: 'pixelated',
                          filter: 'contrast(1.1)'
                        }}
                      />
                    </div>
                    
                    {/* Logo au centre du QR code - décalé légèrement à gauche */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginLeft: '-4px' }}>
                      <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-blue-500">
                        <QrCode className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <QrCode className="w-16 h-16 text-blue-400" />
                    </div>
                    <button
                      onClick={handleGenerateQR}
                      disabled={generatingQR}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto shadow-lg"
                    >
                      {generatingQR ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Génération...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Générer QR Code</span>
                        </>
                      )}
                    </button>
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
              {qrCodeData?.url && (
                <button
                  onClick={handleDownloadQR}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Télécharger QR Code</span>
                </button>
              )}
              {qrCodeData?.url && (
                <button
                  onClick={handleGenerateQR}
                  disabled={generatingQR}
                  className="w-full px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-5 h-5 ${generatingQR ? 'animate-spin' : ''}`} />
                  <span>Régénérer</span>
                </button>
              )}
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
              <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>+5 ce mois</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                <div className="text-6xl font-bold text-blue-600 mb-2">{company.trust_score || 85}</div>
                <p className="text-sm font-semibold text-slate-600">Score Actuel</p>
                <p className="text-xs text-slate-500 mt-1">Sur 100</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Transactions</span>
                  <span className="text-sm font-bold text-slate-900">+30 points</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Vérifications</span>
                  <span className="text-sm font-bold text-slate-900">+25 points</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Réputation</span>
                  <span className="text-sm font-bold text-slate-900">+30 points</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
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
                <div className="font-semibold text-slate-900">{company.phone || 'Non renseigné'}</div>
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
                <div className="text-3xl font-bold text-blue-600 mb-2">247</div>
                <p className="text-sm font-semibold text-slate-600">Vues du TrustPass</p>
                <p className="text-xs text-slate-500 mt-1">Ce mois-ci</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-2">89</div>
                <p className="text-sm font-semibold text-slate-600">Vérifications</p>
                <p className="text-xs text-slate-500 mt-1">Total</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">12</div>
                <p className="text-sm font-semibold text-slate-600">Partages</p>
                <p className="text-xs text-slate-500 mt-1">Cette semaine</p>
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
