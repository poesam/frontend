import { Link } from 'react-router-dom';
import { Shield, ArrowRight, UserPlus, FileCheck, QrCode, ShoppingCart, CheckCircle, AlertCircle, TrendingUp, Clock } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-display font-bold gradient-text">TrustRail MEA</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                Accueil
              </Link>
              <Link to="/how-it-works" className="text-primary-600 font-semibold">
                Comment ça marche
              </Link>
              <Link to="/about" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                À propos
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn-ghost">
                Connexion
              </Link>
              <Link to="/register" className="btn-primary">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Comment fonctionne <span className="gradient-text">TrustRail MEA</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Découvrez notre processus simple et sécurisé pour protéger vos transactions en ligne
          </p>
        </div>
      </section>

      {/* Processus en 4 étapes */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Un processus <span className="gradient-text">simple</span> en 4 étapes
            </h2>
            <p className="text-xl text-slate-600">De l'inscription à votre première transaction sécurisée</p>
          </div>

          <div className="space-y-24">
            {/* Étape 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="glass p-8 rounded-3xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mb-6">
                    <UserPlus className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-6xl font-bold text-primary-100 mb-4">01</div>
                  <h3 className="text-3xl font-bold mb-4">Inscription</h3>
                  <p className="text-slate-600 text-lg mb-6">
                    Créez votre compte entreprise en quelques minutes. Renseignez vos informations de base : 
                    nom de l'entreprise, secteur d'activité, coordonnées et description.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">Formulaire simple et rapide</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">Aucun frais d'inscription</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">Activation immédiate</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="glass p-12 rounded-3xl bg-gradient-to-br from-primary-50 to-accent-50">
                  <div className="aspect-square flex items-center justify-center">
                    <UserPlus className="w-48 h-48 text-primary-600 opacity-20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="glass p-12 rounded-3xl bg-gradient-to-br from-success-50 to-emerald-50">
                <div className="aspect-square flex items-center justify-center">
                  <FileCheck className="w-48 h-48 text-success-600 opacity-20" />
                </div>
              </div>
              <div>
                <div className="glass p-8 rounded-3xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-success-600 to-success-700 rounded-2xl flex items-center justify-center mb-6">
                    <FileCheck className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-6xl font-bold text-success-100 mb-4">02</div>
                  <h3 className="text-3xl font-bold mb-4">Vérification</h3>
                  <p className="text-slate-600 text-lg mb-6">
                    Soumettez vos documents officiels pour validation par notre équipe de vérificateurs. 
                    Ce processus garantit l'authenticité de votre entreprise.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-warning-600 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">Traitement sous 24-48h</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">Documents sécurisés et confidentiels</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">Notification en temps réel</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="glass p-8 rounded-3xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent-600 to-accent-700 rounded-2xl flex items-center justify-center mb-6">
                    <QrCode className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-6xl font-bold text-accent-100 mb-4">03</div>
                  <h3 className="text-3xl font-bold mb-4">TrustPass</h3>
                  <p className="text-slate-600 text-lg mb-6">
                    Une fois vérifié, recevez votre TrustPass : un profil public avec QR code unique 
                    et votre score de confiance initial.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <QrCode className="w-5 h-5 text-accent-600 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">QR code personnalisé</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-success-600 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">Score de confiance évolutif</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">Badge de vérification</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="glass p-12 rounded-3xl bg-gradient-to-br from-accent-50 to-pink-50">
                  <div className="aspect-square flex items-center justify-center">
                    <QrCode className="w-48 h-48 text-accent-600 opacity-20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 4 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="glass p-12 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50">
                <div className="aspect-square flex items-center justify-center">
                  <ShoppingCart className="w-48 h-48 text-orange-600 opacity-20" />
                </div>
              </div>
              <div>
                <div className="glass p-8 rounded-3xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                    <ShoppingCart className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-6xl font-bold text-orange-100 mb-4">04</div>
                  <h3 className="text-3xl font-bold mb-4">Transactions Sécurisées</h3>
                  <p className="text-slate-600 text-lg mb-6">
                    Commencez à vendre en toute confiance. Chaque transaction génère un reçu digital 
                    et améliore votre score de confiance.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">Reçus digitaux automatiques</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">Protection contre la fraude</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-success-600 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">Score qui augmente avec chaque vente</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Système de scoring */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Comment fonctionne le <span className="gradient-text">Score de Confiance</span>
            </h2>
            <p className="text-xl text-slate-600">Un système transparent et équitable</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">+</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Points Positifs</h3>
              <ul className="space-y-3 text-left text-slate-600">
                <li>• Vérification approuvée (+20 pts)</li>
                <li>• Transaction réussie (+5 pts)</li>
                <li>• Livraison confirmée (+3 pts)</li>
                <li>• Ancienneté du compte</li>
                <li>• Taux de satisfaction client</li>
              </ul>
            </div>

            <div className="glass p-8 rounded-3xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-danger-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">-</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Points Négatifs</h3>
              <ul className="space-y-3 text-left text-slate-600">
                <li>• Litige ouvert (-10 pts)</li>
                <li>• Vérification refusée (-15 pts)</li>
                <li>• Transaction annulée (-5 pts)</li>
                <li>• Retard de livraison (-3 pts)</li>
                <li>• Plaintes clients</li>
              </ul>
            </div>

            <div className="glass p-8 rounded-3xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Évolution</h3>
              <ul className="space-y-3 text-left text-slate-600">
                <li>• Score de 0 à 100</li>
                <li>• Mise à jour en temps réel</li>
                <li>• Historique complet</li>
                <li>• Badges de niveau</li>
                <li>• Transparence totale</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-dark p-12 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-600/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                Prêt à commencer ?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Créez votre compte et obtenez votre TrustPass en moins de 48h
              </p>
              <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                S'inscrire gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold">TrustRail MEA</span>
          </div>
          <p className="text-slate-400 mb-4">
            Infrastructure de confiance pour l'Afrique et le Moyen-Orient
          </p>
          <div className="border-t border-slate-800 pt-8 text-slate-400">
            <p>&copy; 2026 TrustRail MEA. Tous droits réservés. Candidature POESAM 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
