# Déploiement TrustRail MEA Frontend sur Vercel

## 🚀 Configuration pour Vercel

### Prérequis
- Compte Vercel connecté à GitHub
- Repository GitHub avec le code frontend
- Backend Laravel Cloud déployé

### Configuration du projet

#### 1. Framework Preset
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### 2. Variables d'environnement à ajouter dans Vercel
```
VITE_API_URL=https://backend-main-x3mrv7.laravel.cloud
VITE_APP_NAME=TrustRail MEA
VITE_APP_VERSION=1.0.0
VITE_PUSHER_APP_KEY=local-key
VITE_PUSHER_HOST=127.0.0.1
VITE_PUSHER_PORT=6002
VITE_PUSHER_SCHEME=http
VITE_PUSHER_APP_CLUSTER=mt1
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

#### 3. Configuration Root Directory
- **Root Directory**: `frontend`

### Étapes de déploiement

1. **Importer le projet depuis GitHub**
   - Sélectionner le repository `poesam/frontend`
   - Choisir la branche `main`

2. **Configurer le projet**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Ajouter les variables d'environnement**
   - Aller dans Settings > Environment Variables
   - Ajouter toutes les variables listées ci-dessus

4. **Déployer**
   - Cliquer sur "Deploy"
   - Attendre la fin du build

### Résolution des problèmes courants

#### Bouton Deploy grisé/absent
- Vérifier que le Root Directory est bien défini
- S'assurer que package.json existe dans le dossier frontend
- Vérifier que les Build Settings sont correctes

#### Erreurs de build
- Vérifier que toutes les dépendances sont dans package.json
- S'assurer que TypeScript compile sans erreurs
- Vérifier les variables d'environnement

#### Erreurs CORS en production
- Vérifier que l'URL Vercel est ajoutée dans la config CORS du backend
- S'assurer que VITE_API_URL pointe vers le bon backend

### URLs importantes
- **Backend API**: https://backend-main-x3mrv7.laravel.cloud
- **Frontend Vercel**: [URL générée après déploiement]

### Support
En cas de problème, vérifier :
1. Les logs de build Vercel
2. La configuration des variables d'environnement
3. La configuration CORS du backend Laravel Cloud