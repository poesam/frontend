# Guide PWA - TrustRail MEA

## 🚀 Configuration PWA

TrustRail MEA est maintenant une Progressive Web App (PWA) complète!

### ✨ Fonctionnalités PWA

- **Installation sur mobile et desktop** - Les utilisateurs peuvent installer l'app comme une application native
- **Mode hors ligne** - Cache intelligent pour fonctionner sans connexion
- **Notifications push** - Prêt pour les notifications (à configurer côté backend)
- **Icônes adaptatives** - Logo optimisé pour tous les appareils
- **Thème personnalisé** - Couleur de thème bleu (#2563eb)
- **Expérience native** - Barre d'adresse cachée en mode standalone

### 📱 Installation

#### Sur Android (Chrome/Edge)
1. Ouvrir le site dans Chrome
2. Cliquer sur le menu (3 points)
3. Sélectionner "Installer l'application" ou "Ajouter à l'écran d'accueil"
4. Confirmer l'installation

#### Sur iOS (Safari)
1. Ouvrir le site dans Safari
2. Appuyer sur le bouton Partager (carré avec flèche)
3. Faire défiler et sélectionner "Sur l'écran d'accueil"
4. Confirmer l'ajout

#### Sur Desktop (Chrome/Edge)
1. Ouvrir le site dans Chrome ou Edge
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. Ou utiliser le menu → "Installer TrustRail MEA"
4. L'application s'ouvrira dans sa propre fenêtre

### 🔧 Configuration Technique

#### Fichiers PWA
- `vite.config.ts` - Configuration du plugin PWA
- `public/manifest.webmanifest` - Manifeste de l'application
- `index.html` - Meta tags PWA
- `src/components/PWAInstallPrompt.tsx` - Prompt d'installation personnalisé

#### Service Worker
Le service worker est généré automatiquement par `vite-plugin-pwa` et gère:
- Mise en cache des assets statiques
- Stratégie NetworkFirst pour les appels API
- Mise à jour automatique de l'application

### 🎨 Personnalisation

#### Icônes
Les icônes sont générées à partir de `/public/logo.png`. Pour de meilleures performances:
- Créer des icônes de 192x192 et 512x512 pixels
- Format PNG avec fond transparent ou blanc
- Optimiser avec des outils comme ImageOptim

#### Couleurs
- **Theme Color**: `#2563eb` (bleu principal)
- **Background Color**: `#ffffff` (blanc)

Modifier dans `public/manifest.webmanifest` et `index.html`

### 📊 Cache Strategy

#### Assets Statiques
- **Stratégie**: Precache
- **Fichiers**: JS, CSS, HTML, images, fonts
- **Mise à jour**: Automatique lors du déploiement

#### API Calls
- **Stratégie**: NetworkFirst (réseau d'abord, puis cache)
- **Cache**: 50 entrées max
- **Durée**: 24 heures
- **Endpoints**: `/api/*`

### 🔄 Mise à jour

L'application se met à jour automatiquement:
1. Le service worker détecte une nouvelle version
2. Les nouveaux assets sont téléchargés en arrière-plan
3. L'utilisateur est notifié (optionnel)
4. Au prochain rechargement, la nouvelle version est active

### 🧪 Test PWA

#### Lighthouse
```bash
# Ouvrir Chrome DevTools
# Onglet Lighthouse
# Cocher "Progressive Web App"
# Générer le rapport
```

#### PWA Builder
Visiter [pwabuilder.com](https://www.pwabuilder.com/) et entrer l'URL de production

#### Test local
```bash
npm run build
npm run preview
```

### 📦 Déploiement

#### Prérequis
- HTTPS obligatoire (sauf localhost)
- Service worker doit être servi avec le bon MIME type
- Manifeste accessible

#### Checklist
- [ ] Build de production créé
- [ ] HTTPS configuré
- [ ] Icônes optimisées
- [ ] Manifeste valide
- [ ] Service worker enregistré
- [ ] Test Lighthouse > 90

### 🐛 Dépannage

#### L'installation ne s'affiche pas
- Vérifier que le site est en HTTPS
- Vérifier que le manifeste est accessible
- Vérifier que les icônes existent
- Ouvrir la console pour voir les erreurs

#### Le cache ne fonctionne pas
- Vérifier que le service worker est enregistré
- Ouvrir DevTools → Application → Service Workers
- Forcer la mise à jour si nécessaire

#### L'application ne se met pas à jour
- Désinstaller et réinstaller l'application
- Vider le cache du navigateur
- Vérifier la stratégie de cache

### 📚 Ressources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

### 🎯 Prochaines étapes

- [ ] Ajouter les notifications push
- [ ] Implémenter le mode hors ligne complet
- [ ] Ajouter la synchronisation en arrière-plan
- [ ] Optimiser les icônes pour tous les appareils
- [ ] Créer des screenshots pour le store
