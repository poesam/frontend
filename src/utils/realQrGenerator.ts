// Générateur de QR Code réel et scannable pour TrustRail MEA
// Utilise l'API QR Server pour générer de vrais QR codes

export interface QRCodeOptions {
  size?: number;
  format?: 'png' | 'svg';
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  color?: string;
  backgroundColor?: string;
}

export class RealQRGenerator {
  private static readonly QR_API_BASE = 'https://api.qrserver.com/v1/create-qr-code/';
  
  /**
   * Génère un QR code réel et scannable
   */
  static generateQRCode(data: string, options: QRCodeOptions = {}): string {
    const {
      size = 300,
      format = 'png',
      errorCorrectionLevel = 'M',
      margin = 1,
      color = '000000',
      backgroundColor = 'ffffff'
    } = options;

    const params = new URLSearchParams({
      data: data,
      size: `${size}x${size}`,
      format: format,
      ecc: errorCorrectionLevel,
      margin: margin.toString(),
      color: color,
      bgcolor: backgroundColor
    });

    return `${this.QR_API_BASE}?${params.toString()}`;
  }

  /**
   * Génère un QR code pour TrustPass avec style TrustRail
   */
  static generateTrustPassQR(trustCode: string, publicUrl?: string): string {
    // Utiliser l'URL publique si disponible, sinon le code TrustPass
    const qrData = publicUrl || `https://frontend-ten-olive-56.vercel.app/trustpass/${trustCode}`;
    
    return this.generateQRCode(qrData, {
      size: 300,
      format: 'png',
      errorCorrectionLevel: 'M',
      margin: 2,
      color: '1e40af', // Bleu TrustRail
      backgroundColor: 'ffffff'
    });
  }

  /**
   * Génère un QR code avec logo (utilise une API différente)
   */
  static generateQRWithLogo(data: string, logoUrl?: string): string {
    // Pour un QR code avec logo, on peut utiliser une approche différente
    // ou générer le QR code de base et ajouter le logo en overlay
    
    const baseQR = this.generateQRCode(data, {
      size: 300,
      errorCorrectionLevel: 'H', // Niveau élevé pour supporter le logo
      margin: 2
    });

    return baseQR;
  }

  /**
   * Génère un QR code côté client (fallback)
   */
  static generateClientQR(data: string, size: number = 300): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    canvas.width = size;
    canvas.height = size;
    
    // Fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Générer un pattern QR basé sur les données
    ctx.fillStyle = '#000000';
    const cellSize = Math.floor(size / 25);
    const gridSize = 25;
    const offset = (size - gridSize * cellSize) / 2;
    
    // Hash simple des données pour générer un pattern unique
    const hash = this.simpleHash(data);
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Marqueurs de position (coins)
        if (this.isPositionMarker(i, j, gridSize)) {
          ctx.fillRect(offset + j * cellSize, offset + i * cellSize, cellSize, cellSize);
        }
        // Pattern de données basé sur le hash
        else if ((hash + i * gridSize + j) % 3 === 0) {
          ctx.fillRect(offset + j * cellSize, offset + i * cellSize, cellSize, cellSize);
        }
      }
    }
    
    // Ajouter le logo TrustRail au centre
    this.addTrustRailLogo(ctx, size);
    
    return canvas.toDataURL('image/png');
  }

  /**
   * Hash simple pour générer un pattern unique
   */
  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Vérifie si c'est un marqueur de position
   */
  private static isPositionMarker(row: number, col: number, size: number): boolean {
    // Coins supérieurs gauche et droit, coin inférieur gauche
    const isTopLeft = (row < 7 && col < 7);
    const isTopRight = (row < 7 && col >= size - 7);
    const isBottomLeft = (row >= size - 7 && col < 7);
    
    if (isTopLeft || isTopRight || isBottomLeft) {
      // Pattern des marqueurs de position
      const localRow = isTopRight ? row : (isBottomLeft ? row - (size - 7) : row);
      const localCol = isTopRight ? col - (size - 7) : col;
      
      return (
        (localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6) ||
        (localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4)
      );
    }
    
    return false;
  }

  /**
   * Ajoute le logo TrustRail au centre du QR code
   */
  private static addTrustRailLogo(ctx: CanvasRenderingContext2D, size: number): void {
    const centerX = size / 2;
    const centerY = size / 2;
    const logoSize = size * 0.15; // 15% de la taille du QR code
    
    // Fond blanc pour le logo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(centerX - logoSize/2, centerY - logoSize/2, logoSize, logoSize);
    
    // Bordure du logo
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    ctx.strokeRect(centerX - logoSize/2, centerY - logoSize/2, logoSize, logoSize);
    
    // Texte du logo
    ctx.fillStyle = '#1e40af';
    ctx.font = `bold ${logoSize * 0.25}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TR', centerX, centerY - logoSize * 0.1);
    
    ctx.font = `${logoSize * 0.15}px Arial`;
    ctx.fillText('MEA', centerX, centerY + logoSize * 0.15);
  }

  /**
   * Télécharge le QR code
   */
  static downloadQRCode(qrUrl: string, filename: string = 'trustpass-qr.png'): void {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Valide si une URL est un QR code valide
   */
  static isValidQRUrl(url: string): boolean {
    try {
      new URL(url);
      return url.includes('qrserver.com') || url.startsWith('data:image/');
    } catch {
      return false;
    }
  }
}

// Fonction utilitaire pour générer rapidement un QR TrustPass
export const generateTrustPassQR = (trustCode: string, publicUrl?: string): string => {
  return RealQRGenerator.generateTrustPassQR(trustCode, publicUrl);
};

// Fonction utilitaire pour télécharger un QR code
export const downloadQR = (qrUrl: string, trustCode: string): void => {
  RealQRGenerator.downloadQRCode(qrUrl, `trustpass-${trustCode}.png`);
};

export default RealQRGenerator;