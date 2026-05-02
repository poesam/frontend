import { Link } from 'react-router-dom';
import { Shield, Target, Eye, Heart, Users, Globe, Award, Zap, Lock, TrendingUp } from 'lucide-react';

export default function AboutPage() {
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
              <Link to="/how-it-works" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                Comment ça marche
              </Link>
              <Link to="/about" className="text-primary-600 font-semibold">
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
            À propos de <span className="gradient-text">TrustRail MEA</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Nous construisons l'infrastructure de confiance pour les transactions en ligne 
            en Afrique et au Moyen-Orient
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="glass p-10 rounded-3xl">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Notre Mission</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Protéger les consommateurs et les entreprises contre la fraude en ligne en créant 
                un écosystème de confiance transparent, accessible et efficace. Nous voulons que 
                chaque transaction en ligne soit sécurisée et vérifiable.
              </p>
            </div>

            <div className="glass p-10 rounded-3xl">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-600 to-accent-700 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Notre Vision</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Devenir la référence en matière de vérification et de confiance pour le commerce 
                en ligne en Afrique et au Moyen-Orient. Un monde où chaque entreprise peut prouver 
                sa légitimité et où chaque consommateur peut acheter en toute sérénité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Le Problème */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-danger-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">
              Le Problème que nous résolvons
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Le commerce en ligne en Afrique et au Moyen-Orient fait face à des défis majeurs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-3">Fraude Croissante</h3>
              <p className="text-slate-600">
                Des milliers de faux vendeurs et d'arnaques en ligne causent des pertes 
                financières importantes aux consommateurs chaque année.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">Manque de Confiance</h3>
              <p className="text-slate-600">
                Les acheteurs hésitent à effectuer des transactions en ligne par peur 
                de se faire arnaquer, freinant la croissance du e-commerce.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-3">Absence de Preuves</h3>
              <p className="text-slate-600">
                Pas de système standardisé pour vérifier les vendeurs ou générer des 
                preuves de transaction fiables et vérifiables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Solution */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">
              Notre <span className="gradient-text">Solution</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Une plateforme complète qui restaure la confiance dans le commerce en ligne
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-2xl text-center card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold mb-2">Vérification</h3>
              <p className="text-sm text-slate-600">
                Validation rigoureuse de l'identité et des documents des entreprises
              </p>
            </div>

            <div className="glass p-6 rounded-2xl text-center card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-success-600 to-success-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold mb-2">Scoring</h3>
              <p className="text-sm text-slate-600">
                Système de notation transparent basé sur l'historique et la réputation
              </p>
            </div>

            <div className="glass p-6 rounded-2xl text-center card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-600 to-accent-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold mb-2">Sécurité</h3>
              <p className="text-sm text-slate-600">
                Reçus digitaux cryptés et système de résolution de litiges
              </p>
            </div>

            <div className="glass p-6 rounded-2xl text-center card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold mb-2">Rapidité</h3>
              <p className="text-sm text-slate-600">
                Vérification en 24-48h et transactions instantanées
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">
              Nos <span className="gradient-text">Valeurs</span>
            </h2>
            <p className="text-xl text-slate-600">Les principes qui guident notre action</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Transparence</h3>
              <p className="text-slate-600">
                Nous croyons en la transparence totale. Chaque score, chaque vérification, 
                chaque décision est expliquée et justifiée.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Équité</h3>
              <p className="text-slate-600">
                Toutes les entreprises, grandes ou petites, ont droit aux mêmes opportunités 
                et au même traitement.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Innovation</h3>
              <p className="text-slate-600">
                Nous innovons constamment pour améliorer la sécurité et l'expérience 
                utilisateur de notre plateforme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">
              Notre <span className="gradient-text">Impact</span>
            </h2>
            <p className="text-xl text-slate-600">Des chiffres qui parlent d'eux-mêmes</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-5xl font-bold gradient-text mb-2">30+</div>
              <p className="text-slate-600 font-medium">Entreprises Vérifiées</p>
            </div>

            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-5xl font-bold gradient-text mb-2">100+</div>
              <p className="text-slate-600 font-medium">Vérifications Effectuées</p>
            </div>

            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-5xl font-bold gradient-text mb-2">98%</div>
              <p className="text-slate-600 font-medium">Taux de Satisfaction</p>
            </div>

            <div className="glass p-8 rounded-2xl text-center">
              <div className="text-5xl font-bold gradient-text mb-2">0</div>
              <p className="text-slate-600 font-medium">Fraudes Signalées</p>
            </div>
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">
              Projet <span className="gradient-text">POESAM 2026</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              TrustRail MEA est un projet candidat au programme POESAM 2026, 
              visant à révolutionner la confiance dans le commerce en ligne en Afrique et au Moyen-Orient.
            </p>
          </div>

          <div className="glass p-10 rounded-3xl max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Portée Régionale</h3>
                <p className="text-sm text-slate-600">Afrique & Moyen-Orient</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-success-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Impact Social</h3>
                <p className="text-sm text-slate-600">Protection des consommateurs</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Innovation</h3>
                <p className="text-sm text-slate-600">Technologie de pointe</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-600 mb-6">
                Notre objectif est de créer un écosystème de confiance qui bénéficie à tous : 
                entreprises, consommateurs, et économie numérique dans son ensemble.
              </p>
              <Link to="/register" className="btn-primary inline-flex items-center">
                Rejoindre le mouvement
              </Link>
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
                Rejoignez-nous dans cette aventure
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Ensemble, construisons un commerce en ligne plus sûr et plus transparent
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Créer mon compte
                </Link>
                <Link to="/how-it-works" className="btn-secondary text-lg px-8 py-4">
                  En savoir plus
                </Link>
              </div>
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
