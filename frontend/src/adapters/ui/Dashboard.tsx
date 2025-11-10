import React, { useState, useMemo } from 'react';
import { ApiClient } from '../infrastructure/ApiClient';
import RoutesTab from './pages/RoutesTab';
import CompareTab from './pages/CompareTab';
import BankingTab from './pages/BankingTab';
import PoolingTab from './pages/PoolingTab';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'routes' | 'compare' | 'banking' | 'pooling'>('routes');
  
  // Create ApiClient once and reuse - it will pick up token from localStorage via interceptor
  const apiClient = useMemo(() => new ApiClient(), []);

  const tabs = [
    { id: 'routes', label: 'Routes' },
    { id: 'compare', label: 'Compare' },
    { id: 'banking', label: 'Banking' },
    { id: 'pooling', label: 'Pooling' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">⚓ FuelEU Maritime Compliance Platform</h1>
            <p className="text-blue-100 mt-1">GHG Intensity Monitoring & Compliance Management</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-blue-100">Logged in as</p>
              <p className="font-semibold">{user?.email}</p>
              {user?.role === 'guest' && (
                <span className="text-xs bg-yellow-400 text-gray-800 px-2 py-1 rounded">Guest</span>
              )}
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'routes' && <RoutesTab apiClient={apiClient} />}
        {activeTab === 'compare' && <CompareTab apiClient={apiClient} />}
        {activeTab === 'banking' && <BankingTab apiClient={apiClient} />}
        {activeTab === 'pooling' && <PoolingTab apiClient={apiClient} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>FuelEU Maritime Regulation (EU) 2023/1805 | Baseline: 91.16 gCO₂eq/MJ (2020)</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
