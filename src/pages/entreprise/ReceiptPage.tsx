import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RealQRGenerator } from '../../utils/realQrGenerator';

// Styles pour l'impression PDF
const printStyles = `
  @media print {
    @page {
      size: A4;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 0;
    }
    .print\\:hidden {
      display: none !important;
    }
  }
`;

interface Transaction {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  buyer_name: string | null;
  buyer_phone_masked: string | null;
  created_at: string;
  paid_at: string | null;
  delivered_at: string | null;
  company: {
    id: number;
    commercial_name: string;
    trust_code: string;
    city: string;
    country_code: string;
    phone_masked: string;
    verification_status: string;
    trust_score: number;
    trust_pass?: {
      id: number;
      qr_code_url: string;
      public_url: string;
    };
  };
  buyer?: {
    id: number;
    name: string;
    email: string;
  };
  delivery_proof?: string | null;
}

const ReceiptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactionQR, setTransactionQR] = useState<string>('');

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  useEffect(() => {
    if (transaction) {
      // Générer le QR code avec toutes les informations de la transaction
      const transactionData = {
        reference: transaction.reference,
        montant: `${transaction.amount} ${transaction.currency}`,
        vendeur: transaction.company.commercial_name,
        trust_code: transaction.company.trust_code,
        date: new Date(transaction.created_at).toLocaleDateString('fr-FR'),
        statut: getStatusLabel(transaction.status),
        description: transaction.description,
        verification_url: `${window.location.origin}/verify/${transaction.reference}`
      };
      
      const qrData = JSON.stringify(transactionData);
      const qrUrl = RealQRGenerator.generateQRCode(qrData, { size: 300 });
      setTransactionQR(qrUrl);
    }
  }, [transaction]);

  const fetchTransaction = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${API_URL}/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setTransaction(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du reçu');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    // Utiliser l'API d'impression du navigateur pour générer le PDF
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && transaction) {
      try {
        await navigator.share({
          title: `Reçu ${transaction.reference}`,
          text: `Reçu de transaction TrustRail - ${transaction.reference}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      en_attente: 'EN ATTENTE',
      paye: 'PAYÉ',
      en_livraison: 'EN LIVRAISON',
      livre: 'LIVRÉ',
      litige: 'LITIGE',
      annule: 'ANNULÉ',
      rembourse: 'REMBOURSÉ',
    };
    return labels[status] || status.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      en_attente: 'bg-yellow-100 text-yellow-900 border-yellow-400',
      paye: 'bg-green-100 text-green-900 border-green-500',
      en_livraison: 'bg-blue-100 text-blue-900 border-blue-500',
      livre: 'bg-green-100 text-green-900 border-green-500',
      litige: 'bg-red-100 text-red-900 border-red-500',
      annule: 'bg-gray-100 text-gray-700 border-gray-400',
      rembourse: 'bg-purple-100 text-purple-900 border-purple-500',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-400';
  };

  const getVerificationBadge = (status: string) => {
    if (status === 'verifie') {
      return <span className="inline-block px-2 py-1 text-xs font-bold bg-green-100 text-green-900 border border-green-500 rounded uppercase tracking-wide">VÉRIFIÉ</span>;
    } else if (status === 'en_attente') {
      return <span className="inline-block px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-400 rounded uppercase tracking-wide">EN ATTENTE</span>;
    } else {
      return <span className="inline-block px-2 py-1 text-xs font-bold bg-red-100 text-red-900 border border-red-500 rounded uppercase tracking-wide">NON VÉRIFIÉ</span>;
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString('fr-FR')} ${currency}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error || 'Transaction introuvable'}</p>
          <button
            onClick={() => navigate('/entreprise/transactions')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour aux transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{printStyles}</style>
      <div className="min-h-screen bg-gray-100 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Actions Bar - Non imprimable */}
          <div className="mb-4 flex flex-wrap gap-2 print:hidden">
            <button
              onClick={() => navigate('/entreprise/transactions')}
              className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition"
            >
              Retour
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
            >
              Enregistrer en PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition"
          >
            Imprimer
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
          >
            Partager
          </button>
        </div>

        {/* Receipt Container - Format A4 - Single Page */}
        <div className="bg-white shadow-xl" style={{ maxWidth: '210mm', margin: '0', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", height: '297mm', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #1a365d 0%, #2563eb 100%)',
            color: 'white',
            padding: '15px 30px 12px 30px'
          }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 style={{ fontSize: '20pt', fontWeight: 300, letterSpacing: '2px', lineHeight: 1, marginBottom: '3px' }}>TRUSTRAIL</h1>
                <p style={{ fontSize: '7pt', opacity: 0.85, letterSpacing: '0.8px', fontWeight: 300 }}>Infrastructure de Confiance MEA</p>
              </div>
              <div className="text-right" style={{ fontSize: '7pt', opacity: 0.9, lineHeight: 1.4 }}>
                <p>Afrique & Moyen-Orient</p>
                <p>www.trustrail-mea.com</p>
              </div>
            </div>
            <div style={{ 
              fontSize: '12pt', 
              fontWeight: 300, 
              letterSpacing: '2px', 
              textTransform: 'uppercase',
              borderTop: '1px solid rgba(255,255,255,0.3)',
              paddingTop: '8px'
            }}>
              Reçu Digital
            </div>
          </div>

          <div style={{ padding: '15px 30px' }}>
            {/* Reference */}
            <div style={{ 
              background: '#f8fafc', 
              borderLeft: '3px solid #2563eb', 
              padding: '10px 15px', 
              marginBottom: '12px' 
            }}>
              <p style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '3px' }}>
                Référence de Transaction
              </p>
              <p style={{ fontSize: '13pt', color: '#1e293b', fontWeight: 600, fontFamily: "'Courier New', Courier, monospace", letterSpacing: '0.5px' }}>
                {transaction.reference}
              </p>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-3 gap-2" style={{ marginBottom: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '2px' }}>
                <p style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '3px' }}>
                  Date d'Émission
                </p>
                <p style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 500 }}>{formatDate(transaction.created_at)}</p>
              </div>
              {transaction.paid_at && (
                <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '2px' }}>
                  <p style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '3px' }}>
                    Date de Paiement
                  </p>
                  <p style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 500 }}>{formatDate(transaction.paid_at)}</p>
                </div>
              )}
              {transaction.delivered_at && (
                <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '2px' }}>
                  <p style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '3px' }}>
                    Date de Livraison
                  </p>
                  <p style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 500 }}>{formatDate(transaction.delivered_at)}</p>
                </div>
              )}
            </div>

            {/* Seller Information */}
            <div style={{ marginBottom: '12px' }}>
              <h2 style={{ 
                fontSize: '8pt', 
                color: '#1e293b', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '1px', 
                marginBottom: '8px', 
                paddingBottom: '4px', 
                borderBottom: '1.5px solid #e2e8f0' 
              }}>
                Informations du Vendeur
              </h2>
              <div className="grid grid-cols-2" style={{ gap: '8px 20px' }}>
                <div>
                  <p style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '2px' }}>
                    Nom Commercial
                  </p>
                  <p style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 500, textAlign: 'right' }}>{transaction.company.commercial_name}</p>
                </div>
                <div>
                  <p style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '2px' }}>
                    Code TrustRail
                  </p>
                  <p style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 700, fontFamily: "'Courier New', monospace", textAlign: 'right' }}>
                    {transaction.company.trust_code}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '2px' }}>
                    Localisation
                  </p>
                  <p style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 500, textAlign: 'right' }}>
                    {transaction.company.city}, {transaction.company.country_code}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '2px' }}>
                    Contact
                  </p>
                  <p style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 500, textAlign: 'right' }}>{transaction.company.phone_masked}</p>
                </div>
                <div>
                  <p style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '2px' }}>
                    Statut de Vérification
                  </p>
                  <div className="mt-1" style={{ textAlign: 'right' }}>{getVerificationBadge(transaction.company.verification_status)}</div>
                </div>
                <div>
                  <p style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '2px' }}>
                    Score de Confiance
                  </p>
                  <p className={`font-bold ${getTrustScoreColor(transaction.company.trust_score)}`} style={{ fontSize: '8pt', fontWeight: 700, textAlign: 'right' }}>
                    {transaction.company.trust_score}/100
                  </p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div style={{ marginBottom: '12px' }}>
              <h2 style={{ 
                fontSize: '8pt', 
                color: '#1e293b', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '1px', 
                marginBottom: '8px', 
                paddingBottom: '4px', 
                borderBottom: '1.5px solid #e2e8f0' 
              }}>
                Informations du Client
              </h2>
              <div className="grid grid-cols-2" style={{ gap: '8px 20px' }}>
                <div>
                  <p style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '2px' }}>
                    Nom
                  </p>
                  <p style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 500, textAlign: 'right' }}>
                    {transaction.buyer_name || transaction.buyer?.name || 'Client'}
                  </p>
                </div>
                {transaction.buyer_phone_masked && (
                  <div>
                    <p style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '2px' }}>
                      Contact
                    </p>
                    <p style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 500, textAlign: 'right' }}>{transaction.buyer_phone_masked}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction Details */}
            <div style={{ marginBottom: '12px' }}>
              <h2 style={{ 
                fontSize: '8pt', 
                color: '#1e293b', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '1px', 
                marginBottom: '8px', 
                paddingBottom: '4px', 
                borderBottom: '1.5px solid #e2e8f0' 
              }}>
                Détails de la Transaction
              </h2>
              <div style={{ background: '#f8fafc', padding: '10px 15px', borderRadius: '2px' }}>
                <div className="flex justify-between items-start" style={{ padding: '6px 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>
                    Description
                  </span>
                  <span style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>
                    {transaction.description}
                  </span>
                </div>
                <div className="flex justify-between items-center" style={{ padding: '6px 0' }}>
                  <span style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>
                    Statut
                  </span>
                  <span className={`inline-block px-2 py-0.5 text-xs font-bold border-2 rounded uppercase tracking-wide ${getStatusColor(transaction.status)}`}>
                    {getStatusLabel(transaction.status)}
                  </span>
                </div>
                {transaction.delivery_proof && (
                  <div className="flex justify-between items-start" style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '6pt', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>
                      Preuve de Livraison
                    </span>
                    <span style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>
                      {transaction.delivery_proof}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Amount */}
            <div style={{ 
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
              border: '2px solid #10b981', 
              padding: '15px', 
              textAlign: 'center', 
              margin: '12px 0' 
            }}>
              <p style={{ fontSize: '6pt', color: '#065f46', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '6px' }}>
                Montant Total
              </p>
              <p style={{ fontSize: '28pt', color: '#065f46', fontWeight: 700, fontFamily: "'Courier New', Courier, monospace", letterSpacing: '-1px', lineHeight: 1 }}>
                {formatAmount(transaction.amount, transaction.currency)}
              </p>
            </div>

            {/* QR Code Section - Transaction */}
            <div style={{ marginBottom: '12px' }}>
              <h2 style={{ 
                fontSize: '8pt', 
                color: '#1e293b', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '1px', 
                marginBottom: '8px', 
                paddingBottom: '4px', 
                borderBottom: '1.5px solid #e2e8f0' 
              }}>
                Code QR de la Transaction
              </h2>
              <div style={{ background: '#f8fafc', padding: '12px', textAlign: 'center', borderRadius: '2px' }}>
                <div style={{ background: 'white', display: 'inline-block', padding: '10px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  {transactionQR ? (
                    <img 
                      src={transactionQR} 
                      alt="QR Code Transaction" 
                      style={{ width: '150px', height: '150px', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                      <p style={{ fontSize: '6pt', color: '#64748b' }}>Génération...</p>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '6pt', color: '#64748b', marginTop: '8px', lineHeight: 1.4 }}>
                  Scannez pour vérifier<br />
                  <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, color: '#1e293b', fontSize: '5pt' }}>
                    {transaction.reference}
                  </span>
                </p>
              </div>
            </div>


          </div>

          {/* Footer */}
          <div style={{ background: '#f8fafc', padding: '12px 30px', borderTop: '3px solid #e2e8f0' }}>
            <div className="grid grid-cols-2" style={{ gap: '15px', marginBottom: '8px' }}>
              <div>
                <h3 style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                  TrustRail MEA
                </h3>
                <p style={{ fontSize: '6pt', color: '#64748b', lineHeight: 1.4, margin: 0 }}>Infrastructure de confiance pour</p>
                <p style={{ fontSize: '6pt', color: '#64748b', lineHeight: 1.4, margin: 0 }}>l'Afrique et le Moyen-Orient</p>
                <p style={{ fontSize: '6pt', color: '#64748b', lineHeight: 1.4, margin: 0, marginTop: '6px' }}>Email: contact@trustrail-mea.com</p>
                <p style={{ fontSize: '6pt', color: '#64748b', lineHeight: 1.4, margin: 0 }}>Web: www.trustrail-mea.com</p>
              </div>
              <div className="text-right">
                <h3 style={{ fontSize: '7pt', color: '#1e293b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                  Support Client
                </h3>
                <p style={{ fontSize: '6pt', color: '#64748b', lineHeight: 1.4, margin: 0 }}>Pour toute réclamation concernant</p>
                <p style={{ fontSize: '6pt', color: '#64748b', lineHeight: 1.4, margin: 0 }}>cette transaction, veuillez nous contacter</p>
                <p style={{ fontSize: '6pt', color: '#64748b', lineHeight: 1.4, margin: 0, marginTop: '6px' }}>
                  Réf: <span style={{ color: '#1e293b', fontWeight: 600, fontFamily: "'Courier New', Courier, monospace" }}>{transaction.reference}</span>
                </p>
              </div>
            </div>

            <div style={{ background: '#eff6ff', borderLeft: '2px solid #3b82f6', padding: '8px 10px', marginTop: '8px' }}>
              <p style={{ fontSize: '5pt', color: '#1e40af', lineHeight: 1.4, margin: 0 }}>
                <strong style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Document Sécurisé</strong> — Ce reçu digital est protégé par TrustRail MEA. 
                La référence unique {transaction.reference} permet de vérifier l'authenticité de ce document à tout moment.
              </p>
            </div>

            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '5pt', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e2e8f0', lineHeight: 1.4 }}>
              <p style={{ margin: 0 }}>Document généré le {formatDate(new Date().toISOString())} (UTC)</p>
              <p style={{ margin: 0 }}>TrustRail MEA © {new Date().getFullYear()} — Tous droits réservés</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ReceiptPage;
