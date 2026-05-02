import { Link } from 'react-router-dom';
import { Shield, QrCode, CheckCircle, TrendingUp, Users, Globe, ArrowRight, Sparkles, Search } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src="/logo.png" 
                alt="TrustRail MEA Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
              <span className="text-lg sm:text-2xl font-display font-bold gradient-text">TrustRail MEA</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                Fonctionnalités
              </a>
              <a href="#how-it-works" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                Comment ça marche
              </a>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/login" className="btn-ghost text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3">
                Connexion
              </Link>
              <Link to="/register" className="btn-primary text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Contenu texte */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-100 rounded-full mb-4 sm:mb-6">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-700" />
                <span className="text-xs sm:text-sm font-semibold text-blue-700">La confiance dans le commerce social</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-4 sm:mb-6 leading-tight">
                Achetez en ligne en toute{' '}
                <span className="text-blue-600">sécurité.</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Fini les arnaques sur Instagram, WhatsApp ou TikTok. Vérifiez l'identité de votre vendeur avant de payer et achetez en toute confiance grâce au TrustPass.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4 mb-6 sm:mb-10 max-w-lg mx-auto lg:mx-0">
                <Link to="/register" className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg text-center flex items-center justify-center text-sm sm:text-base">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Vérifier un vendeur
                </Link>
                <Link to="/register" className="px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-2xl border-2 border-slate-200 transition-all duration-300 text-center text-sm sm:text-base">
                  Devenir Vendeur Vérifié
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-slate-100 rounded-full">
                  <span className="font-bold text-blue-600">JD</span>
                  <span className="font-bold text-cyan-600">MN</span>
                  <span className="font-bold text-indigo-600">AL</span>
                </div>
                <span className="text-center sm:text-left">Rejoint par plus de <span className="font-bold text-slate-900">5,000+</span> acheteurs et vendeurs</span>
              </div>
            </div>

            {/* Image Hero - Belle femme sénégalaise avec téléphone */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/img.png" 
                  alt="Belle femme sénégalaise souriante en tenue traditionnelle verte utilisant smartphone dans une boutique"
                  className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover"
                />
              </div>
              
              {/* Floating TrustPass card */}
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 glass p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl max-w-[200px] sm:max-w-none">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">TrustPass Vérifié</div>
                    <div className="text-[10px] sm:text-xs text-slate-600">Risque faible (08/100)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3 sm:mb-4">
              Fonctionnalités <span className="gradient-text">Innovantes</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Une plateforme complète pour sécuriser vos transactions en ligne
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Shield,
                title: 'Un badge de confiance unique',
                description: 'Chaque vendeur vérifié reçoit un TrustPass unique avec QR code',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: QrCode,
                title: 'QR code à partager à vos clients',
                description: 'Partagez votre QR code en boutique ou sur vos réseaux sociaux',
                color: 'from-cyan-500 to-blue-500',
              },
              {
                icon: CheckCircle,
                title: 'Gestion des litiges transparente',
                description: 'Système complet de résolution de conflits et médiation',
                color: 'from-indigo-500 to-blue-500',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass p-6 sm:p-8 rounded-2xl sm:rounded-3xl card-hover group"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Section Vendeur */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Mockup de l'application TrustRail */}
            <div className="relative">
              {/* Fond avec image africaine */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80" 
                  alt="Équipe africaine"
                  className="w-full h-full object-cover brightness-50 blur-sm"
                />
              </div>

              {/* Mockup du téléphone avec l'app */}
              <div className="relative z-10 flex items-center justify-center min-h-[600px] py-12">
                <div className="w-80 bg-white rounded-[3rem] shadow-2xl p-4 border-8 border-slate-800">
                  {/* Écran du téléphone */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-[2.5rem] overflow-hidden">
                    {/* Barre de statut */}
                    <div className="bg-white px-6 py-3 flex items-center justify-between">
                      <span className="text-xs font-semibold">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-slate-300 rounded-sm"></div>
                        <div className="w-4 h-4 bg-slate-300 rounded-sm"></div>
                        <div className="w-4 h-4 bg-slate-300 rounded-sm"></div>
                      </div>
                    </div>

                    {/* Contenu de l'app */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">TrustRail MEA</div>
                          <div className="text-sm font-bold text-slate-900">Vérifier un vendeur</div>
                        </div>
                      </div>

                      {/* QR Code Scanner */}
                      <div className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
                        <div className="w-full aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4">
                          <QrCode className="w-32 h-32 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-slate-900 mb-1">Scannez le QR Code</div>
                          <div className="text-xs text-slate-600">du vendeur pour vérifier son identité</div>
                        </div>
                      </div>

                      {/* Résultat de vérification */}
                      <div className="bg-blue-600 rounded-2xl p-4 text-white">
                        <div className="flex items-center space-x-3 mb-2">
                          <CheckCircle className="w-6 h-6" />
                          <div className="text-sm font-bold">Vendeur Vérifié</div>
                        </div>
                        <div className="text-xs opacity-90">Score de confiance: 85/100</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating QR card */}
              <div className="absolute top-8 right-8 glass p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="text-center">
                  <QrCode className="w-16 h-16 mx-auto mb-3 text-slate-700" />
                  <div className="text-sm font-bold text-slate-900 mb-1">Scannez pour vérifier</div>
                  <div className="text-xs text-slate-600">Affichez votre QR code en boutique ou sur vos réseaux sociaux</div>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Vous êtes vendeur ?<br />
                <span className="text-blue-600">Boostez vos ventes.</span>
              </h2>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Les acheteurs hésitent à payer à l'avance. Obtenez votre TrustPass et prouvez que vous êtes un vendeur fiable. Augmentez votre taux de conversion.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">Un badge de confiance unique</div>
                    <div className="text-sm text-slate-600">Chaque vendeur vérifié reçoit un TrustPass unique</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <QrCode className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">QR code à partager à vos clients</div>
                    <div className="text-sm text-slate-600">Partagez votre QR code en boutique ou sur vos réseaux sociaux</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">Gestion des litiges transparente</div>
                    <div className="text-sm text-slate-600">Système complet de résolution de conflits</div>
                  </div>
                </li>
              </ul>

              <Link to="/register" className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg">
                Créer mon compte vendeur
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-12 rounded-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Prêt à sécuriser vos transactions ?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Rejoignez des milliers d'entreprises qui font confiance à TrustRail MEA
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center">
                Créer mon compte gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/login" className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-2xl border-2 border-slate-200 transition-all duration-300">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="TrustRail MEA Logo" 
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-display font-bold">TrustRail MEA</span>
              </div>
              <p className="text-slate-400">
                Infrastructure de confiance pour l'Afrique et le Moyen-Orient
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Produit</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Statut</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2026 TrustRail MEA. Tous droits réservés. Candidature POESAM 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
