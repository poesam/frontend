import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/api';
import axios from 'axios';
import { 
  Shield, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, 
  XCircle, Info, Calendar, Activity, Award, AlertCircle, RefreshCw,
  FileText, ShoppingBag, MessageSquare, Clock, Sparkles
} from 'lucide-react';

interface RiskFactor {
  name: string;
  weight: number;
  status: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface RiskCheckData {
  score: number;
  risk_level: string;
  verification_status: string;
  risk_factors: string[];
  recommendation: {
    level: string;
    message: string;
    color: string;
    icon: string;
  };
  company: {
    trust_code: string;
    commercial_name: string;
    completed_transactions: number;
    disputes_count: number;
    created_at: string;
  };
}

export default function RiskCheckPage() {
  const { user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [riskCheckData, setRiskCheckData] = useState<RiskCheckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const response = await companyService.getAll();
      
      const data = response.data.data?.data || response.data.data || response.data || [];
      const myCompany = Array.isArray(data) ? data.find((c: any) => c.user_id === user?.id) : null;
      
      setCompany(myCompany);

      if (myCompany) {
        await performRiskCheck(myCompany.id);
      }
    } catch (error) {
      console.error('Erreur chargement entreprise:', error);
    } finally {
      setLoading(false);
    }
  };

  const performRiskCheck = async (companyId: number) => {
    try {
      setChecking(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/api/risk-checks',
        { company_id: companyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setRiskCheckData({
          score: response.data.data.company.trust_score,
          risk_level: response.data.data.company.risk_level,
          verification_status: response.data.data.company.verification_status,
          risk_factors: response.data.data.risk_check.risk_factors || [],
          recommendation: response.data.data.recommendation,
          company: response.data.data.company,
        });
      }
    } catch (error) {
      console.error('Erreur vérification de risque:', error);
    } finally {
      setChecking(false);
    }
  };

  const calculateSignals = (): RiskFactor[] => {
    if (!company) return [];

    const signals: RiskFactor[] = [];

    // Profil complet (+20)
    const hasCompleteProfile = company.commercial_name && company.phone && company.business_type && company.logo_url;
    signals.push({
      name: 'Profil complet',
      weight: hasCompleteProfile ? 20 : 0,
      status: hasCompleteProfile ? 'positive' : 'neutral',
      description: hasCompleteProfile 
        ? 'Nom, numéro, activité, photo/logo et canal social renseignés'
        : 'Profil incomplet - complétez vos informations'
    });

    // Preuve d'activité (+20)
    const hasActivityProof = company.documents?.some((d: any) => d.type === 'preuve_activite' && d.is_verified);
    signals.push({
      name: 'Preuve d\'activité',
      weight: hasActivityProof ? 20 : 0,
      status: hasActivityProof ? 'positive' : 'neutral',
      description: hasActivityProof
        ? 'Publication, vitrine, registre ou référence vérifiée'
        : 'Aucune preuve d\'activité vérifiée'
    });

    // Ancienneté (+15)
    const monthsOld = company.created_at ? Math.floor((Date.now() - new Date(company.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0;
    let ancienneteWeight = 0;
    let ancienneteStatus: 'positive' | 'neutral' = 'neutral';
    if (monthsOld >= 6) {
      ancienneteWeight = 15;
      ancienneteStatus = 'positive';
    } else if (monthsOld >= 3) {
      ancienneteWeight = 10;
      ancienneteStatus = 'positive';
    } else if (monthsOld >= 1) {
      ancienneteWeight = 5;
      ancienneteStatus = 'positive';
    }
    signals.push({
      name: 'Ancienneté',
      weight: ancienneteWeight,
      status: ancienneteStatus,
      description: `Compte actif depuis ${monthsOld} mois`
    });

    // Transactions confirmées (+20)
    const completedTransactions = company.completed_transactions || 0;
    let transactionWeight = 0;
    let transactionStatus: 'positive' | 'neutral' = 'neutral';
    if (completedTransactions >= 10) {
      transactionWeight = 20;
      transactionStatus = 'positive';
    } else if (completedTransactions >= 5) {
      transactionWeight = 15;
      transactionStatus = 'positive';
    } else if (completedTransactions >= 1) {
      transactionWeight = 10;
      transactionStatus = 'positive';
    }
    signals.push({
      name: 'Transactions confirmées',
      weight: transactionWeight,
      status: transactionStatus,
      description: `${completedTransactions} transaction(s) complétée(s) avec succès`
    });

    // Plaintes ouvertes (-30)
    const openDisputes = company.disputes_count || 0;
    signals.push({
      name: 'Plaintes ouvertes',
      weight: openDisputes > 0 ? -30 : 0,
      status: openDisputes > 0 ? 'negative' : 'positive',
      description: openDisputes > 0 
        ? `${openDisputes} litige(s) non résolu(s)`
        : 'Aucun litige en cours'
    });

    // Changement de numéro récent (-15)
    const isRecentAccount = monthsOld < 1;
    signals.push({
      name: 'Compte récent',
      weight: isRecentAccount ? -15 : 0,
      status: isRecentAccount ? 'negative' : 'neutral',
      description: isRecentAccount
        ? 'Compte créé il y a moins d\'un mois'
        : 'Compte établi'
    });

    return signals;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 50) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Vérifié - Faible risque';
    if (score >= 50) return 'Attention - Risque moyen';
    return 'Non vérifié - Risque élevé';
  };

  const getRecommendationIcon = (level: string) => {
    switch (level) {
      case 'safe': return CheckCircle2;
      case 'caution': return AlertTriangle;
      case 'danger': return XCircle;
      default: return AlertCircle;
    }
  };

  if (loading) {
    return (
      <div className="glass p-12 rounded-2xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement de votre vérification de risque...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="glass p-12 rounded-2xl text-center">
        <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Données non disponibles</h3>
        <p className="text-slate-600">Impossible de charger vos informations</p>
      </div>
    );
  }

  const signals = calculateSignals();
  const score = riskCheckData?.score || company.trust_score || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative glass p-8 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 gradient-text">
                Risk Check
              </h1>
              <p className="text-slate-600 text-lg flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Vérification de risque et score de confiance</span>
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Principal */}
        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-3xl card-hover text-center">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Score de Confiance</h2>
              
              {/* Jauge circulaire */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-200"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - score / 100)}`}
                    className={score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</div>
                  <div className="text-sm text-slate-500">/ 100</div>
                </div>
              </div>

              {/* Badge de statut */}
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                score >= 50 ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {score >= 80 ? <CheckCircle2 className="w-4 h-4" /> :
                 score >= 50 ? <AlertTriangle className="w-4 h-4" /> :
                 <XCircle className="w-4 h-4" />}
                <span>{getScoreLabel(score)}</span>
              </div>

              <p className="text-sm text-slate-600">
                Dernière vérification : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>

            {/* Bouton de rafraîchissement */}
            <button
              onClick={() => company && performRiskCheck(company.id)}
              disabled={checking}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Vérification...' : 'Actualiser'}</span>
            </button>
          </div>

          {/* Recommandation */}
          {riskCheckData?.recommendation && (
            <div className={`glass p-6 rounded-3xl card-hover mt-6 border-2 ${
              riskCheckData.recommendation.level === 'safe' ? 'border-emerald-200' :
              riskCheckData.recommendation.level === 'caution' ? 'border-amber-200' :
              'border-red-200'
            }`}>
              <div className="flex items-start space-x-3">
                {(() => {
                  const Icon = getRecommendationIcon(riskCheckData.recommendation.level);
                  return <Icon className={`w-6 h-6 flex-shrink-0 ${
                    riskCheckData.recommendation.level === 'safe' ? 'text-emerald-600' :
                    riskCheckData.recommendation.level === 'caution' ? 'text-amber-600' :
                    'text-red-600'
                  }`} />;
                })()}
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Recommandation</h3>
                  <p className="text-sm text-slate-600">{riskCheckData.recommendation.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Détails des Signaux */}
        <div className="lg:col-span-2 space-y-6">
          {/* Explication du calcul */}
          <div className="glass p-8 rounded-3xl card-hover">
            <div className="flex items-center space-x-3 mb-6">
              <Info className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Comment est calculé le score ?</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Votre score de confiance est calculé de manière transparente en fonction de plusieurs critères. 
              Chaque signal contribue positivement ou négativement à votre score final sur 100 points.
            </p>

            {/* Signaux détaillés */}
            <div className="space-y-4">
              {signals.map((signal, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    signal.status === 'positive' ? 'bg-emerald-50 border-emerald-200' :
                    signal.status === 'negative' ? 'bg-red-50 border-red-200' :
                    'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        signal.status === 'positive' ? 'bg-emerald-100' :
                        signal.status === 'negative' ? 'bg-red-100' :
                        'bg-slate-100'
                      }`}>
                        {signal.status === 'positive' ? (
                          <TrendingUp className={`w-5 h-5 ${signal.weight > 0 ? 'text-emerald-600' : 'text-slate-400'}`} />
                        ) : signal.status === 'negative' ? (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        ) : (
                          <Activity className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-slate-900">{signal.name}</h3>
                          <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                            signal.weight > 0 ? 'bg-emerald-100 text-emerald-700' :
                            signal.weight < 0 ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {signal.weight > 0 ? '+' : ''}{signal.weight} pts
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{signal.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-blue-600" />
                  <span className="font-bold text-slate-900">Score Total</span>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {score} / 100
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="glass p-8 rounded-3xl card-hover">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
              <Activity className="w-6 h-6 text-blue-600" />
              <span>Statistiques de l'entreprise</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl text-center">
                <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {company.completed_transactions || 0}
                </div>
                <p className="text-sm font-semibold text-slate-600">Transactions</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {company.verification_status === 'verifie' ? 'Oui' : 'Non'}
                </div>
                <p className="text-sm font-semibold text-slate-600">Vérifié</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl text-center">
                <MessageSquare className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-amber-600 mb-1">
                  {company.disputes_count || 0}
                </div>
                <p className="text-sm font-semibold text-slate-600">Litiges</p>
              </div>
            </div>
          </div>

          {/* Conseils d'amélioration */}
          <div className="glass p-8 rounded-3xl card-hover">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <span>Comment améliorer votre score ?</span>
            </h2>

            <div className="space-y-3">
              {score < 100 && (
                <>
                  {!signals.find(s => s.name === 'Profil complet')?.weight && (
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Complétez votre profil</p>
                        <p className="text-sm text-slate-600">Ajoutez un logo, vérifiez vos informations de contact</p>
                      </div>
                    </div>
                  )}
                  {!signals.find(s => s.name === 'Preuve d\'activité')?.weight && (
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Ajoutez une preuve d'activité</p>
                        <p className="text-sm text-slate-600">Téléchargez un document prouvant votre activité commerciale</p>
                      </div>
                    </div>
                  )}
                  {(company.completed_transactions || 0) < 10 && (
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                      <ShoppingBag className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Complétez plus de transactions</p>
                        <p className="text-sm text-slate-600">Chaque transaction réussie améliore votre score</p>
                      </div>
                    </div>
                  )}
                  {(company.disputes_count || 0) > 0 && (
                    <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Résolvez vos litiges</p>
                        <p className="text-sm text-slate-600">Les litiges ouverts réduisent significativement votre score</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              {score >= 100 && (
                <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl">
                  <Award className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Score parfait !</p>
                    <p className="text-sm text-slate-600">Continuez à maintenir votre excellent niveau de confiance</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
