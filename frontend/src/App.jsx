import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ToastProvider from './components/Toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OnboardingFlow from './pages/OnboardingFlow';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import Reminders from './pages/Reminders';
import Adherence from './pages/Adherence';
import Caregivers from './pages/Caregivers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import UploadPrescription from './pages/UploadPrescription';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-spinner" aria-label="Loading" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? hasCompletedOnboarding
                  ? '/dashboard'
                  : '/onboarding'
                : '/login'
            }
            replace
          />
        }
      />

      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingFlow />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/medicines"
        element={
          <ProtectedRoute>
            <Medicines />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reminders"
        element={
          <ProtectedRoute>
            <Reminders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/adherence"
        element={
          <ProtectedRoute>
            <Adherence />
          </ProtectedRoute>
        }
      />

      <Route
        path="/caregivers"
        element={
          <ProtectedRoute>
            <Caregivers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload-prescription"
        element={
          <ProtectedRoute>
            <UploadPrescription />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}