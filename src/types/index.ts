// Types pour TrustRail MEA

export type UserRole = 'entreprise' | 'verificateur' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  country_code: string;
  language: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface Company {
  id: number;
  user_id: number;
  trust_code: string;
  commercial_name: string;
  legal_name?: string;
  description?: string;
  business_type: 'boutique' | 'livreur' | 'prestataire' | 'artisan' | 'marketplace' | 'fintech' | 'autre';
  country_code: string;
  city: string;
  address?: string;
  phone: string;
  phone_masked: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  logo_url?: string;
  verification_status: 'en_attente' | 'verifie' | 'attention' | 'refuse' | 'signale';
  trust_score: number;
  risk_level: 'faible' | 'moyen' | 'eleve';
  completed_transactions: number;
  disputes_count: number;
  activity_start_date?: string;
  is_active: boolean;
  verified_at?: string;
  created_at: string;
  trust_pass?: TrustPass;
}

export interface TrustPass {
  id: number;
  company_id: number;
  qr_code_url: string;
  public_url: string;
  qr_code_data: string;
  scan_count: number;
  last_scanned_at?: string;
  is_active: boolean;
  created_at: string;
  company?: Company;
}

export interface Transaction {
  id: number;
  reference: string;
  company_id: number;
  buyer_id?: number;
  buyer_name?: string;
  buyer_phone_masked?: string;
  amount: number;
  currency: string;
  description: string;
  status: 'en_attente' | 'paye' | 'en_livraison' | 'livre' | 'annule' | 'litige' | 'rembourse';
  delivery_proof?: string;
  receipt_url?: string;
  qr_code_url?: string;
  paid_at?: string;
  delivered_at?: string;
  created_at: string;
  company?: Company;
}

export interface Dispute {
  id: number;
  transaction_id: number;
  reported_by: number;
  company_id: number;
  type: 'non_livraison' | 'produit_non_conforme' | 'arnaque' | 'mauvais_service' | 'autre';
  description: string;
  evidence?: string;
  status: 'ouvert' | 'en_cours' | 'resolu' | 'ferme' | 'escalade';
  resolution?: string;
  handled_by?: number;
  resolved_at?: string;
  created_at: string;
  transaction?: Transaction;
  company?: Company;
  reporter?: User;
}

export interface VerificationRequest {
  id: number;
  company_id: number;
  status: 'en_attente' | 'en_cours' | 'approuve' | 'refuse';
  business_proof?: string;
  additional_info?: string;
  reviewed_by?: number;
  review_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  created_at: string;
  company?: Company;
}

export interface DashboardStats {
  companies: {
    total: number;
    verified: number;
    pending: number;
    flagged: number;
  };
  transactions: {
    total: number;
    completed: number;
    pending: number;
    disputed: number;
    total_amount: number;
  };
  disputes: {
    total: number;
    open: number;
    resolved: number;
    escalated: number;
  };
  verifications: {
    pending: number;
    in_progress: number;
    approved: number;
    rejected: number;
  };
  risk_checks: {
    total: number;
    today: number;
    this_week: number;
  };
  users: {
    total: number;
    companies: number;
    verifiers: number;
    admins: number;
  };
  average_trust_score: number;
  trends: {
    new_companies: number;
    new_transactions: number;
    new_disputes: number;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    token_type: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}
