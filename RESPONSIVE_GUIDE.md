# Guide Responsive - TrustRail MEA

## 📱 Design Responsive

TrustRail MEA est entièrement responsive et optimisé pour tous les appareils.

### 🎯 Breakpoints Tailwind

```css
/* Mobile First Approach */
sm:  640px   /* Petits tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Petits desktops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Grands écrans */
```

### 📐 Stratégie Responsive

#### Mobile First
Toutes les classes sont appliquées par défaut pour mobile, puis adaptées pour les écrans plus grands:

```tsx
// ❌ Mauvais
<div className="text-2xl sm:text-base">

// ✅ Bon
<div className="text-base sm:text-2xl">
```

#### Grilles Adaptatives
```tsx
// 1 colonne mobile, 2 tablets, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

#### Espacement Progressif
```tsx
// Padding adaptatif
<div className="px-4 sm:px-6 lg:px-8">
<div className="py-12 sm:py-16 lg:py-20">
```

### 📱 Composants Responsive

#### Navigation
- **Mobile**: Menu hamburger (à implémenter)
- **Desktop**: Navigation horizontale complète
- **Sticky**: Barre fixe en haut

```tsx
<nav className="fixed top-0 w-full z-50">
  <div className="h-16 sm:h-20"> {/* Hauteur adaptative */}
    <div className="hidden md:flex"> {/* Caché sur mobile */}
      {/* Menu desktop */}
    </div>
  </div>
</nav>
```

#### Hero Section
- **Mobile**: Stack vertical, image réduite
- **Tablet**: Début de la grille 2 colonnes
- **Desktop**: Grille 2 colonnes complète

```tsx
<div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
  <div className="text-center lg:text-left">
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
```

#### Cards
- **Mobile**: 1 colonne
- **Tablet**: 2 colonnes
- **Desktop**: 3 colonnes

```tsx
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
```

#### Boutons
- **Mobile**: Pleine largeur
- **Desktop**: Largeur automatique

```tsx
<button className="w-full sm:w-auto px-6 py-3">
```

### 🎨 Tailles de Texte

#### Titres
```tsx
// H1 - Hero
text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl

// H2 - Sections
text-3xl sm:text-4xl md:text-5xl

// H3 - Cards
text-xl sm:text-2xl
```

#### Corps de texte
```tsx
// Paragraphe principal
text-base sm:text-lg lg:text-xl

// Paragraphe secondaire
text-sm sm:text-base

// Petit texte
text-xs sm:text-sm
```

### 🖼️ Images Responsive

#### Hero Image
```tsx
<img 
  className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover"
  alt="Description"
/>
```

#### Logo
```tsx
<img 
  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
  alt="Logo"
/>
```

#### Icônes
```tsx
<Icon className="w-4 h-4 sm:w-5 sm:h-5" />
```

### 📊 Dashboards Responsive

#### Sidebar
- **Mobile**: Overlay avec backdrop
- **Desktop**: Sidebar fixe

```tsx
<aside className={`
  fixed inset-y-0 left-0 z-50 w-72
  transform transition-all duration-300
  lg:translate-x-0
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
`}>
```

#### Stats Cards
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
```

#### Tables
- **Mobile**: Scroll horizontal
- **Desktop**: Table complète

```tsx
<div className="overflow-x-auto">
  <table className="min-w-full">
```

### 🎯 Bonnes Pratiques

#### 1. Touch Targets
Minimum 44x44px pour les éléments cliquables sur mobile:

```tsx
<button className="min-h-[44px] min-w-[44px] p-3">
```

#### 2. Espacement
Plus d'espace sur mobile pour faciliter la lecture:

```tsx
<div className="space-y-6 sm:space-y-4">
```

#### 3. Typographie
Tailles de police plus grandes sur mobile:

```tsx
<p className="text-lg sm:text-base">
```

#### 4. Images
Toujours utiliser object-fit pour contrôler le ratio:

```tsx
<img className="object-cover" />
<img className="object-contain" />
```

#### 5. Flexbox vs Grid
- **Flexbox**: Pour les layouts simples et alignements
- **Grid**: Pour les layouts complexes multi-colonnes

### 📱 Test Responsive

#### Chrome DevTools
1. F12 pour ouvrir DevTools
2. Ctrl+Shift+M pour le mode responsive
3. Tester différents appareils

#### Appareils à tester
- **Mobile**: iPhone SE (375px), iPhone 12 Pro (390px)
- **Tablet**: iPad (768px), iPad Pro (1024px)
- **Desktop**: 1280px, 1920px

#### Checklist
- [ ] Navigation fonctionne sur mobile
- [ ] Textes lisibles sans zoom
- [ ] Boutons facilement cliquables
- [ ] Images bien dimensionnées
- [ ] Pas de scroll horizontal
- [ ] Formulaires utilisables
- [ ] Modals adaptées
- [ ] Tables scrollables

### 🔧 Utilitaires Tailwind

#### Visibilité
```tsx
hidden sm:block          // Caché mobile, visible desktop
block sm:hidden          // Visible mobile, caché desktop
```

#### Flexbox
```tsx
flex-col sm:flex-row     // Vertical mobile, horizontal desktop
items-start sm:items-center
justify-start sm:justify-between
```

#### Espacement
```tsx
space-y-4 sm:space-y-0 sm:space-x-4  // Vertical mobile, horizontal desktop
gap-4 sm:gap-6 lg:gap-8              // Gap progressif
```

#### Largeur
```tsx
w-full sm:w-auto         // Pleine largeur mobile, auto desktop
max-w-sm sm:max-w-md lg:max-w-lg
```

### 🎨 Composants Personnalisés

#### Container Responsive
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

#### Section Spacing
```tsx
<section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
```

#### Card Responsive
```tsx
<div className="glass p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl">
```

### 📊 Performance Mobile

#### Images
- Utiliser WebP avec fallback PNG
- Lazy loading pour images hors viewport
- Responsive images avec srcset

```tsx
<img
  src="/image.webp"
  srcSet="/image-small.webp 400w, /image-large.webp 800w"
  sizes="(max-width: 640px) 400px, 800px"
  loading="lazy"
/>
```

#### Fonts
- Précharger les fonts critiques
- Utiliser font-display: swap

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preload" as="font">
```

#### CSS
- Utiliser Tailwind JIT pour CSS minimal
- Purge des classes inutilisées

### 🐛 Problèmes Courants

#### Scroll horizontal
```tsx
// Ajouter overflow-x-hidden au container parent
<div className="overflow-x-hidden">
```

#### Texte trop petit
```tsx
// Augmenter la taille de base sur mobile
<p className="text-base sm:text-sm">
```

#### Boutons trop petits
```tsx
// Ajouter padding minimum
<button className="px-6 py-3 min-h-[44px]">
```

#### Images déformées
```tsx
// Utiliser object-fit
<img className="object-cover w-full h-64">
```

### 📚 Ressources

- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Mobile First Design](https://web.dev/mobile-first/)
- [Touch Target Size](https://web.dev/accessible-tap-targets/)
- [Responsive Images](https://web.dev/responsive-images/)
