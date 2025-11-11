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
      <header className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 text-white shadow-large">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold">FuelEU Maritime</h1>
                <p className="text-purple-100 text-sm mt-0.5">GHG Compliance Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <p className="text-xs text-purple-200">Logged in as</p>
                <p className="font-semibold text-sm">{user?.email}</p>
                {user?.role === 'guest' && (
                  <span className="inline-block mt-1 text-xs bg-amber-400 text-gray-900 px-2 py-0.5 rounded-full font-medium">
                    Guest Mode
                  </span>
                )}
                {user?.role === 'admin' && (
                  <span className="inline-block mt-1 text-xs bg-green-400 text-gray-900 px-2 py-0.5 rounded-full font-medium">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={onLogout}
                className="px-5 py-2.5 bg-white text-purple-700 rounded-xl hover:bg-purple-50 transition-all font-semibold shadow-medium hover:shadow-large transform hover:-translate-y-0.5 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Tab Navigation */}
      <nav className="bg-white border-b-2 border-gray-100 shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-700 rounded-t-full"></div>
                )}
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
