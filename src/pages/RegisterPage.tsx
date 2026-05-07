import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, Lock, User, Phone, ArrowRight, AlertCircle, CheckCircle, 
  ArrowLeft, Building2, MapPin, Globe, Facebook, Instagram, MessageCircle
} from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1 : Informations personnelles
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    
    // Étape 2 : Type de compte
    role: 'entreprise',
    
    // Étape 3 : Informations entreprise (si role = entreprise)
    commercial_name: '',
    legal_name: '',
    business_type: '',
    city: '',
    description: '',
    
    // Étape 4 : Coordonnées entreprise
    address: '',
    company_phone: '',
    whatsapp: '',
    facebook: '',
    instagram: '',
    website: '',
    
    // Consentement
    consent_data_processing: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const totalSteps = formData.role === 'entreprise' ? 4 : 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.role === 'entreprise' && !formData.consent_data_processing) {
      setError('Vous devez accepter le traitement des données pour créer une entreprise');
      return;
    }

    setLoading(true);

    try {
      // Préparer les données selon le rôle
      const registrationData: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: formData.phone,
        role: formData.role,
      };

      // Si entreprise, ajouter les données de l'entreprise
      if (formData.role === 'entreprise') {
        registrationData.company = {
          commercial_name: formData.commercial_name,
          legal_name: formData.legal_name || null,
          business_type: formData.business_type,
          city: formData.city,
          description: formData.description || null,
          address: formData.address || null,
          phone: formData.company_phone,
          whatsapp: formData.whatsapp || null,
          facebook: formData.facebook || null,
          instagram: formData.instagram || null,
          website: formData.website || null,
          consent_data_processing: formData.consent_data_processing,
        };
      }

      await register(registrationData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const nextStep = () => {
    setError('');
    
    // Validation selon l'étape
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
      if (formData.password !== formData.password_confirmation) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      if (formData.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }
    }
    
    // Toujours passer à l'étape 3 pour les entreprises
    if (step === 2) {
      setStep(3);
      return;
    }
    
    if (step === 3) {
      if (!formData.commercial_name || !formData.business_type || !formData.city) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-3 mb-6 sm:mb-8">
          <img src="/logo.png" alt="TrustRail MEA" className="h-14 w-auto" />
          <span className="text-3xl font-display font-bold gradient-text">TrustRail MEA</span>
        </Link>

        {/* Card */}
        <div className="glass p-8 rounded-3xl shadow-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-600">Étape {step} sur {totalSteps}</span>
              <span className="text-sm font-semibold text-blue-600">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
              {step === 1 && 'Informations personnelles'}
              {step === 2 && 'Type de compte'}
              {step === 3 && 'Informations de l\'entreprise'}
              {step === 4 && 'Coordonnées de l\'entreprise'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              {step === 1 && 'Commençons par vos informations de base'}
              {step === 2 && 'Quel type de compte souhaitez-vous créer ?'}
              {step === 3 && 'Parlez-nous de votre entreprise'}
              {step === 4 && 'Comment vous contacter ?'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); if (step === totalSteps) handleSubmit(e); else nextStep(); }}>
            {/* Étape 1 : Informations personnelles */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nom complet <span className="text-danger-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field pl-12"
                      placeholder="Jean Dupont"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email <span className="text-danger-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-12"
                      placeholder="jean@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Téléphone personnel
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field pl-12"
                      placeholder="+221 77 123 45 67"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Mot de passe <span className="text-danger-600">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Minimum 8 caractères</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Confirmer <span className="text-danger-600">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Étape 2 : Type de compte */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <label className={`relative flex flex-col p-4 sm:p-6 rounded-2xl border-2 cursor-pointer transition-all max-w-md w-full ${
                    formData.role === 'entreprise' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-slate-200 hover:border-blue-300'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="entreprise"
                      checked={formData.role === 'entreprise'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Building2 className={`w-12 h-12 mb-4 ${
                      formData.role === 'entreprise' ? 'text-blue-600' : 'text-slate-400'
                    }`} />
                    <span className="text-lg font-bold text-slate-900 mb-2">Entreprise / Vendeur</span>
                    <span className="text-sm text-slate-600">
                      Créez votre TrustPass et gérez vos transactions
                    </span>
                  </label>
                </div>

                {formData.role === 'entreprise' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-900">
                      <strong>Prochaines étapes :</strong> Nous aurons besoin de quelques informations sur votre entreprise pour créer votre TrustPass.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Étape 3 : Informations entreprise */}
            {step === 3 && formData.role === 'entreprise' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nom commercial <span className="text-danger-600">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="commercial_name"
                      value={formData.commercial_name}
                      onChange={handleChange}
                      className="input-field pl-12"
                      placeholder="Boutique Awa Style"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Le nom sous lequel vous êtes connu</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Raison sociale (optionnel)
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="legal_name"
                      value={formData.legal_name}
                      onChange={handleChange}
                      className="input-field pl-12"
                      placeholder="SARL Awa Style"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Nom légal de votre entreprise</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Type d'activité <span className="text-danger-600">*</span>
                  </label>
                  <select
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="boutique">Boutique</option>
                    <option value="livreur">Livreur</option>
                    <option value="prestataire">Prestataire de services</option>
                    <option value="artisan">Artisan</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="fintech">Fintech</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ville <span className="text-danger-600">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field pl-12"
                      placeholder="Dakar"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description de votre activité
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="input-field"
                    placeholder="Décrivez brièvement votre activité..."
                  />
                </div>
              </div>
            )}

            {/* Étape 4 : Coordonnées entreprise */}
            {step === 4 && formData.role === 'entreprise' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Téléphone de l'entreprise <span className="text-danger-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      name="company_phone"
                      value={formData.company_phone}
                      onChange={handleChange}
                      className="input-field pl-12"
                      placeholder="+221 77 123 45 67"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Numéro principal de contact</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Adresse complète
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      className="input-field pl-12"
                      placeholder="Rue, quartier, ville..."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      WhatsApp
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="+221 77 123 45 67"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Site web
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Facebook
                    </label>
                    <div className="relative">
                      <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Instagram
                    </label>
                    <div className="relative">
                      <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="@votre_compte"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent_data_processing"
                      checked={formData.consent_data_processing}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 mt-0.5"
                      required
                    />
                    <label htmlFor="consent" className="text-sm text-slate-700">
                      <span className="text-danger-600">*</span> J'accepte que mes données soient traitées conformément à la{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                        politique de confidentialité
                      </a>{' '}
                      et j'autorise TrustRail MEA à afficher publiquement les informations de mon entreprise.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons de navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center space-x-2 px-6 py-3 text-slate-700 hover:text-slate-900 font-semibold transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Précédent</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium"
                >
                  Déjà un compte ?
                </Link>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Création...</span>
                  </>
                ) : step === totalSteps ? (
                  <>
                    <span>Créer mon compte</span>
                    <CheckCircle className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>Suivant</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Avantages (seulement sur la première étape) */}
          {step === 1 && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-4">Pourquoi rejoindre TrustRail ?</p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Vérification gratuite',
                  'TrustPass avec QR code',
                  'Score de confiance',
                  'Reçus digitaux',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
                    <span className="text-sm text-slate-600">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
