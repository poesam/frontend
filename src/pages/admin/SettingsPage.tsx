import { useState } from 'react';
import { Settings, Save, Shield, Bell, Mail, Database, Users, Lock, Globe, DollarSign } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'scoring' | 'system'>('general');
  const [saving, setSaving] = useState(false);

  // États pour les paramètres généraux
  const [platformName, setPlatformName] = useState('TrustRail MEA');
  const [platformEmail, setPlatformEmail] = useState('contact@trustrail-mea.com');
  const [platformPhone, setPlatformPhone] = useState('+221 XX XXX XX XX');
  const [defaultCurrency, setDefaultCurrency] = useState('XOF');
  const [defaultCountry, setDefaultCountry] = useState('SN');

  // États pour la sécurité
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(120);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);

  // États pour les notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [disputeAlerts, setDisputeAlerts] = useState(true);
  const [verificationAlerts, setVerificationAlerts] = useState(true);

  // États pour le scoring
  const [minTrustScore, setMinTrustScore] = useState(50);
  const [verificationBonus, setVerificationBonus] = useState(20);
  const [transactionBonus, setTransactionBonus] = useState(5);
  const [disputePenalty, setDisputePenalty] = useState(-10);

  const handleSave = async () => {
    setSaving(true);
    // Simuler la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Paramètres sauvegardés avec succès!');
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'scoring', label: 'Scoring', icon: DollarSign },
    { id: 'system', label: 'Système', icon: Database },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Paramètres</h1>
          <p className="text-slate-600">Configuration de la plateforme TrustRail MEA</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar des onglets */}
        <div className="lg:col-span-1">
          <div className="glass p-4 rounded-2xl space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="lg:col-span-3">
          <div className="glass p-8 rounded-2xl">
            {/* Onglet Général */}
            {activeTab === 'general' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Paramètres Généraux</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nom de la plateforme
                    </label>
                    <input
                      type="text"
                      value={platformName}
                      onChange={(e) => setPlatformName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email de contact
                      </label>
                      <input
                        type="email"
                        value={platformEmail}
                        onChange={(e) => setPlatformEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={platformPhone}
                        onChange={(e) => setPlatformPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Devise par défaut
                      </label>
                      <select
                        value={defaultCurrency}
                        onChange={(e) => setDefaultCurrency(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                      >
                        <option value="XOF">XOF (Franc CFA)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="USD">USD (Dollar)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Pays par défaut
                      </label>
                      <select
                        value={defaultCountry}
                        onChange={(e) => setDefaultCountry(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                      >
                        <option value="SN">Sénégal</option>
                        <option value="CI">Côte d'Ivoire</option>
                        <option value="MA">Maroc</option>
                        <option value="TN">Tunisie</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Sécurité */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Paramètres de Sécurité</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-900">Authentification à deux facteurs</div>
                      <div className="text-sm text-slate-600">Activer 2FA pour tous les administrateurs</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={twoFactorEnabled}
                        onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-slate-300 peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Délai d'expiration de session (minutes)
                    </label>
                    <input
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tentatives de connexion maximales
                    </label>
                    <input
                      type="number"
                      value={maxLoginAttempts}
                      onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Paramètres de Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-primary-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Notifications par email</div>
                        <div className="text-sm text-slate-600">Recevoir les alertes par email</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-slate-300 peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-success-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Notifications SMS</div>
                        <div className="text-sm text-slate-600">Recevoir les alertes par SMS</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smsNotifications}
                        onChange={(e) => setSmsNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-slate-300 peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-900">Alertes de litiges</div>
                      <div className="text-sm text-slate-600">Être notifié des nouveaux litiges</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={disputeAlerts}
                        onChange={(e) => setDisputeAlerts(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-slate-300 peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-900">Alertes de vérification</div>
                      <div className="text-sm text-slate-600">Être notifié des nouvelles demandes</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={verificationAlerts}
                        onChange={(e) => setVerificationAlerts(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-slate-300 peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Scoring */}
            {activeTab === 'scoring' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Paramètres de Scoring</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Score de confiance minimum
                    </label>
                    <input
                      type="number"
                      value={minTrustScore}
                      onChange={(e) => setMinTrustScore(parseInt(e.target.value))}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                    <p className="text-sm text-slate-500 mt-1">Score minimum requis pour être actif</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bonus de vérification (points)
                    </label>
                    <input
                      type="number"
                      value={verificationBonus}
                      onChange={(e) => setVerificationBonus(parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                    <p className="text-sm text-slate-500 mt-1">Points ajoutés lors d'une vérification approuvée</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bonus de transaction (points)
                    </label>
                    <input
                      type="number"
                      value={transactionBonus}
                      onChange={(e) => setTransactionBonus(parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                    <p className="text-sm text-slate-500 mt-1">Points ajoutés par transaction réussie</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Pénalité de litige (points)
                    </label>
                    <input
                      type="number"
                      value={disputePenalty}
                      onChange={(e) => setDisputePenalty(parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                    <p className="text-sm text-slate-500 mt-1">Points retirés lors d'un litige ouvert</p>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Système */}
            {activeTab === 'system' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Informations Système</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-600">Version de la plateforme</div>
                        <div className="font-semibold text-slate-900">v1.0.0</div>
                      </div>
                      <div className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-xs font-semibold">
                        À jour
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-sm text-slate-600">Base de données</div>
                    <div className="font-semibold text-slate-900">PostgreSQL 14.5</div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-sm text-slate-600">Serveur</div>
                    <div className="font-semibold text-slate-900">Laravel 10.x</div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-sm text-slate-600">Environnement</div>
                    <div className="font-semibold text-slate-900">Production</div>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Actions de maintenance</h3>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-3 bg-primary-100 text-primary-700 rounded-xl font-medium hover:bg-primary-200 transition-colors">
                        Vider le cache
                      </button>
                      <button className="w-full px-4 py-3 bg-warning-100 text-warning-700 rounded-xl font-medium hover:bg-warning-200 transition-colors">
                        Exporter les données
                      </button>
                      <button className="w-full px-4 py-3 bg-danger-100 text-danger-700 rounded-xl font-medium hover:bg-danger-200 transition-colors">
                        Réinitialiser les logs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
