import React from 'react';
import { AuthProvider, useAuth } from '../../core/application/services/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './Dashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, logout, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Dashboard user={user} onLogout={logout} />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
