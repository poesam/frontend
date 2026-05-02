# 🚀 Quick Start - TrustRail MEA

## Installation Rapide

### 1. Copier l'image manquante
```bash
# Windows
Copy-Item img.png public\img.png

# Linux/Mac
cp img.png public/img.png
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer l'application
```bash
npm run dev
```

Ouvrir http://localhost:3000

## ✅ Vérifications Rapides

### Logo
- [ ] Page d'accueil: Logo TrustRail visible
- [ ] Login: Logo en haut
- [ ] Register: Logo en haut
- [ ] Dashboards: Logo dans sidebar

### Responsive
- [ ] Mobile (375px): Tout est lisible
- [ ] Tablet (768px): Layout adapté
- [ ] Desktop (1280px): Layout complet

### PWA
- [ ] Attendre 3 secondes → Prompt d'installation apparaît
- [ ] Cliquer "Installer" → Application installée
- [ ] Ouvrir l'app installée → Fonctionne en standalone

## 🧪 Test Rapide PWA

### Chrome Desktop
1. Ouvrir http://localhost:3000
2. Attendre le prompt d'installation (3 sec)
3. Cliquer "Installer"
4. L'app s'ouvre dans sa propre fenêtre

### Chrome Mobile
1. Ouvrir le site
2. Menu (3 points) → "Installer l'application"
3. Confirmer
4. Icône ajoutée à l'écran d'accueil

## 📱 Test Responsive

### Chrome DevTools
1. F12
2. Ctrl+Shift+M (mode responsive)
3. Tester:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1280px)

## 🏗️ Build Production

```bash
npm run build
npm run preview
```

Ouvrir http://localhost:4173

## 📊 Lighthouse Test

1. F12 → Lighthouse
2. Cocher "Progressive Web App"
3. "Generate report"
4. Objectif: Score PWA > 90

## 🐛 Problèmes Courants

### Le prompt PWA n'apparaît pas
- Vérifier que vous êtes en HTTPS (ou localhost)
- Ouvrir la console pour voir les erreurs
- Vérifier que le manifeste est accessible: `/manifest.webmanifest`

### L'image ne s'affiche pas
- Vérifier que `img.png` est dans `public/`
- Vérifier que `logo.png` est dans `public/`
- Rafraîchir la page (Ctrl+F5)

### Le responsive ne fonctionne pas
- Vider le cache du navigateur
- Vérifier le viewport dans DevTools
- Tester en mode incognito

## 📚 Documentation Complète

- **PWA**: Voir `PWA_GUIDE.md`
- **Responsive**: Voir `RESPONSIVE_GUIDE.md`
- **Implémentation**: Voir `../RESPONSIVE_PWA_IMPLEMENTATION.md`

## ✨ C'est Tout!

L'application est prête à être utilisée. Bon développement! 🎉
