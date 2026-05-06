import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { generateQRCodeDataURL, getRealCompanyData } from '../../utils/qrGenerator';
import { 
  QrCode, Download, Share2, Eye, TrendingUp, Shield, 
  CheckCircle2, Building2, Copy, RefreshCw
} from 'lucide-react';

export default function TrustPassSimple() {
  const { user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Utiliser les vraies données
    const realData = getRealCompanyData();
    setCompany(realData);
    
    // Générer le QR code
    const publicUrl = `${window.location.origin}/trustpass/${realData.trust_code}`;
    const qrUrl = generateQRCodeDataURL(publicUrl, 300);
    setQrCodeUrl(qrUrl);
    
    setLoading(false);
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
        text: `Vérifiez mon entreprise avec le code TrustPass: ${company.trust_code}`,
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
        <p className="text-slate-600">Chargement de votre TrustPass...</p>
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
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span>En attente de vérification</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              {/* Fond avec gradient et ombre */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-3xl shadow-2xl"></div>
              
              {/* Conteneur blanc pour le QR code */}
              <div className="absolute inset-3 bg-white rounded-2xl flex items-center justify-center p-4">
                <div className="w-full h-full flex items-center justify-center relative">
                  {/* QR Code */}
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code TrustPass" 
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                  
                  {/* Logo au centre */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-blue-500">
                      <QrCode className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
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
                Créé le {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleDownloadQR}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
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
              <div className="flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>Nouveau prestataire</span>
              </div>
            </div>

            {/* Message d'explication pour nouveau prestataire */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Comment améliorer votre score</h4>
                  <p className="text-xs text-blue-700">
                    Votre score augmentera automatiquement en complétant des transactions, 
                    en obtenant des vérifications et en maintenant une bonne réputation.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                <div className="text-6xl font-bold text-blue-600 mb-2">{company.trust_score}</div>
                <p className="text-sm font-semibold text-slate-600">Score Actuel</p>
                <p className="text-xs text-slate-500 mt-1">Sur 100</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Transactions</span>
                  <span className="text-sm font-bold text-slate-900">+0 points</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Vérifications</span>
                  <span className="text-sm font-bold text-slate-900">+0 points</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Réputation</span>
                  <span className="text-sm font-bold text-slate-900">+25 points</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
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
                <div className="font-semibold text-slate-900">{company.phone}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl md:col-span-2">
                <div className="text-xs text-slate-500 mb-1">Adresse</div>
                <div className="font-semibold text-slate-900">{company.address}</div>
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
                <div className="text-3xl font-bold text-blue-600 mb-2">{company.stats.trustpass.views_this_month}</div>
                <p className="text-sm font-semibold text-slate-600">Vues du TrustPass</p>
                <p className="text-xs text-slate-500 mt-1">Ce mois-ci</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-2">{company.stats.transactions.total}</div>
                <p className="text-sm font-semibold text-slate-600">Transactions</p>
                <p className="text-xs text-slate-500 mt-1">Total</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{company.stats.verifications.total}</div>
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