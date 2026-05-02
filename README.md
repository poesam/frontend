# TrustRail MEA - Frontend

## 🎨 Design Unique et Moderne

Frontend React + TypeScript + Tailwind CSS avec un design glassmorphism innovant et des animations fluides.

## 🚀 Installation

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build
```

## 📦 Technologies

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Routing
- **Axios** - Client HTTP
- **Lucide React** - Icônes modernes
- **Framer Motion** - Animations

## 🎨 Design Features

### Glassmorphism
- Effets de verre avec backdrop-blur
- Transparence et profondeur
- Bordures subtiles

### Animations
- Gradient animés
- Float effects
- Shimmer effects
- Transitions fluides

### Couleurs
- Palette primary (bleu)
- Palette accent (violet/rose)
- Palette success (vert)
- Palette warning (orange)
- Palette danger (rouge)

## 📱 Pages

### Publiques
- **Landing Page** - Page d'accueil avec hero section
- **Login** - Connexion
- **Register** - Inscription
- **Public TrustPass** - Consultation publique d'un TrustPass

### Entreprise
- **Dashboard** - Vue d'ensemble
- **Mon Entreprise** - Gestion du profil
- **Transactions** - Liste des transactions
- **Demandes de Vérification** - Soumettre/suivre

### Vérificateur
- **Dashboard** - Vue d'ensemble
- **Demandes en Attente** - Liste à traiter
- **Historique** - Vérifications effectuées
- **Statistiques** - Performance

### Admin
- **Dashboard** - Vue d'ensemble complète
- **Entreprises** - Gestion des entreprises
- **Vérifications** - Gestion des demandes
- **Transactions** - Toutes les transactions
- **Litiges** - Gestion des litiges
- **Utilisateurs** - Gestion des utilisateurs
- **Statistiques** - Analytics complètes

## 🔐 Authentification

- JWT tokens via Laravel Sanctum
- Stockage local sécurisé
- Refresh automatique
- Redirection selon le rôle

## 🎯 Rôles

### Entreprise
- Créer et gérer son profil
- Voir son TrustPass et QR code
- Créer des transactions
- Suivre les vérifications

### Vérificateur
- Approuver/refuser les demandes
- Vérifier les documents
- Ajouter des notes
- Voir l'historique

### Admin
- Accès complet
- Gestion des utilisateurs
- Résolution des litiges
- Analytics avancées

## 🌐 API

Configuration dans `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

## 📝 Structure

```
src/
├── components/        # Composants réutilisables
│   ├── common/       # Composants communs
│   ├── entreprise/   # Composants entreprise
│   ├── verificateur/ # Composants vérificateur
│   └── admin/        # Composants admin
├── context/          # Contextes React
│   └── AuthContext.tsx
├── pages/            # Pages
│   ├── entreprise/
│   ├── verificateur/
│   └── admin/
├── services/         # Services API
│   └── api.ts
├── types/            # Types TypeScript
│   └── index.ts
├── App.tsx           # App principale
└── main.tsx          # Point d'entrée
```

## 🎨 Classes Tailwind Personnalisées

### Glassmorphism
```tsx
<div className="glass">...</div>
<div className="glass-dark">...</div>
```

### Boutons
```tsx
<button className="btn-primary">...</button>
<button className="btn-secondary">...</button>
<button className="btn-ghost">...</button>
```

### Badges
```tsx
<span className="badge-success">...</span>
<span className="badge-warning">...</span>
<span className="badge-danger">...</span>
<span className="badge-info">...</span>
```

### Animations
```tsx
<div className="animate-float">...</div>
<div className="animate-gradient">...</div>
<div className="shimmer">...</div>
```

## 🚀 Déploiement

```bash
# Build
npm run build

# Preview
npm run preview
```

Les fichiers de build seront dans `dist/`

## 📱 Responsive

- Mobile first
- Breakpoints Tailwind
- Navigation adaptative
- Grilles responsives

## ♿ Accessibilité

- Contraste WCAG AA
- Navigation clavier
- ARIA labels
- Focus visible

---

**TrustRail MEA** - Frontend React + TypeScript + Tailwind CSS  
Candidature POESAM 2026 🚀
