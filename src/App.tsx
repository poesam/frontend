import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import NotificationPermission from './components/NotificationPermission';

// Pages
import LandingPage from './pages/LandingPage';
import HowItWorks from './pages/HowItWorks';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicTrustPass from './pages/PublicTrustPass';

// Dashboards par rôle
import EntrepriseDashboard from './pages/entreprise/Dashboard';
import VerificateurDashboard from './pages/verificateur/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

// Route protégée
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Redirection vers le bon dashboard selon le rôle
const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'verificateur':
      return <Navigate to="/verificateur/dashboard" replace />;
    case 'entreprise':
      return <Navigate to="/entreprise/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function AppRoutes() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/trustpass/:trustCode" element={<PublicTrustPass />} />

      {/* Redirection dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        }
      />

      {/* Dashboard Entreprise */}
      <Route
        path="/entreprise/*"
        element={
          <ProtectedRoute allowedRoles={['entreprise']}>
            <EntrepriseDashboard />
          </ProtectedRoute>
        }
      />

      {/* Dashboard Vérificateur */}
      <Route
        path="/verificateur/*"
        element={
          <ProtectedRoute allowedRoles={['verificateur']}>
            <VerificateurDashboard />
          </ProtectedRoute>
        }
      />

      {/* Dashboard Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <PWAInstallPrompt />
        <NotificationPermission />
      </AuthProvider>
    </Router>
  );
}

export default App;
