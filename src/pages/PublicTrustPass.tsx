import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, MapPin, Phone, Globe, Facebook, Instagram, CheckCircle, AlertTriangle, XCircle, QrCode, TrendingUp, Calendar } from 'lucide-react';
import { companyService } from '../services/api';
import { Company } from '../types';

export default function PublicTrustPass() {
  const { trustCode } = useParams<{ trustCode: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (trustCode) {
      loadCompany();
    }
  }, [trustCode]);

  const loadCompany = async () => {
    try {
      const response = await companyService.getByTrustCode(trustCode!);
      setCompany(response.data.data);
    } catch (err: any) {
      setError('Entreprise non trouvée');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verifie':
        return <span className="badge-success"><CheckCircle className="w-4 h-4 mr-1" />Vérifié</span>;
      case 'attention':
        return <span className="badge-warning"><AlertTriangle className="w-4 h-4 mr-1" />Attention</span>;
      case 'signale':
        return <span className="badge-danger"><XCircle className="w-4 h-4 mr-1" />Signalé</span>;
      default:
        return <span className="badge-info">En attente</span>;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'faible':
        return <span className="badge-success">Risque Faible</span>;
      case 'moyen':
        return <span className="badge-warning">Risque Moyen</span>;
      case 'eleve':
        return <span className="badge-danger">Risque Élevé</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du TrustPass...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-danger-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Entreprise non trouvée</h1>
          <p className="text-slate-600 mb-6">Le code TrustRail "{trustCode}" n'existe pas ou a été supprimé.</p>
          <Link to="/" className="btn-primary">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link to="/" className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6">
          <Shield className="w-5 h-5" />
          <span className="font-semibold">TrustRail MEA</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto">
        <div className="glass p-8 rounded-3xl shadow-2xl">
          {/* Header avec logo et statut */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b border-slate-200">
            <div className="flex items-start space-x-4 mb-4 md:mb-0">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.commercial_name} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">{company.commercial_name}</h1>
                <p className="text-slate-600 mb-2">{company.description}</p>
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(company.verification_status)}
                  {getRiskBadge(company.risk_level)}
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-2xl shadow-lg p-3 mb-2">
                {company.trust_pass?.qr_code_url ? (
                  <img src={company.trust_pass.qr_code_url} alt="QR Code" className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-slate-400" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500">Code: {company.trust_code}</p>
            </div>
          </div>

          {/* Score de confiance */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
                Score de Confiance
              </h2>
              <span className="text-4xl font-bold gradient-text">{company.trust_score}/100</span>
            </div>
            
            <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                  company.trust_score >= 80 ? 'bg-gradient-to-r from-success-500 to-success-600' :
                  company.trust_score >= 50 ? 'bg-gradient-to-r from-warning-500 to-warning-600' :
                  'bg-gradient-to-r from-danger-500 to-danger-600'
                }`}
                style={{ width: `${company.trust_score}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl font-bold text-primary-600">{company.completed_transactions}</div>
                <div className="text-sm text-slate-600">Transactions</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl font-bold text-success-600">{company.trust_pass?.scan_count || 0}</div>
                <div className="text-sm text-slate-600">Vérifications</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl font-bold text-danger-600">{company.disputes_count}</div>
                <div className="text-sm text-slate-600">Litiges</div>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-bold mb-4">Informations</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-500">Localisation</div>
                    <div className="font-medium">{company.city}, {company.country_code}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-500">Téléphone</div>
                    <div className="font-medium">{company.phone_masked}</div>
                  </div>
                </div>
                {company.activity_start_date && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm text-slate-500">Membre depuis</div>
                      <div className="font-medium">{new Date(company.activity_start_date).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Réseaux sociaux</h3>
              <div className="space-y-3">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <Globe className="w-5 h-5 text-primary-600" />
                    <span className="font-medium">Site web</span>
                  </a>
                )}
                {company.facebook && (
                  <a href={company.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Facebook</span>
                  </a>
                )}
                {company.instagram && (
                  <a href={`https://instagram.com/${company.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <span className="font-medium">Instagram</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary flex-1 text-center">
                Créer mon TrustPass
              </Link>
              <Link to="/" className="btn-secondary flex-1 text-center">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-8 text-sm text-slate-600">
          <p>Ce TrustPass est vérifié et sécurisé par TrustRail MEA</p>
          <p className="mt-2">Dernière mise à jour : {new Date(company.created_at).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
}
