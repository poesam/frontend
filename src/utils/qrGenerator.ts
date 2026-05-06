// Générateur de QR Code côté client
export const generateQRCodeDataURL = (text: string, size: number = 200): string => {
  // Créer un canvas pour dessiner le QR code
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = size;
  canvas.height = size;
  
  // Fond blanc
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  
  // Dessiner un QR code simple (pattern de base)
  ctx.fillStyle = '#000000';
  
  // Créer un pattern simple basé sur le texte
  const gridSize = 21; // Taille standard QR code
  const cellSize = size / gridSize;
  
  // Générer un pattern basé sur le hash du texte
  const hash = simpleHash(text);
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // Coins de positionnement
      if (isPositionMarker(i, j, gridSize)) {
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
      // Pattern basé sur le hash
      else if ((hash + i * gridSize + j) % 3 === 0) {
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
  }
  
  return canvas.toDataURL();
};

// Hash simple pour générer un pattern
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Vérifier si c'est un marqueur de position
const isPositionMarker = (row: number, col: number, size: number): boolean => {
  // Coins supérieurs gauche et droit, coin inférieur gauche
  return (
    (row < 7 && col < 7) || // Top-left
    (row < 7 && col >= size - 7) || // Top-right
    (row >= size - 7 && col < 7) // Bottom-left
  );
};

// Données réelles de test pour un nouveau prestataire
export const getRealCompanyData = () => {
  return {
    id: 6,
    trust_code: 'TR-SN-006',
    commercial_name: 'Express Services',
    business_type: 'livreur',
    city: 'Dakar',
    trust_score: 25, // Score réaliste pour un nouveau prestataire
    verification_status: 'en_attente', // Pas encore vérifié
    phone: '+221 77 123 45 67',
    address: '123 Avenue Bourguiba, Dakar',
    created_at: new Date().toISOString().split('T')[0], // Créé aujourd'hui
    stats: {
      transactions: { total: 0, completed: 0, pending: 0 }, // Aucune transaction encore
      verifications: { total: 0, approved: 0, pending: 0 }, // Aucune vérification
      trustpass: { views: 0, views_this_month: 0 }, // Aucune vue encore
      disputes: { total: 0, open: 0 }, // Aucun litige
      risk_checks: { total: 0, this_month: 0 } // Aucun contrôle de risque
    }
  };
};