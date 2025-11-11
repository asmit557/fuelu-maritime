import React, { useState } from 'react';
import { IApiClient } from '../../../core/ports/IApiClient';
import { ComplianceBalance, BankEntry } from '../../../core/domain/models/Compliance';

interface BankingTabProps {
  apiClient: IApiClient;
}

const BankingTab: React.FC<BankingTabProps> = ({ apiClient }) => {
  const [shipId, setShipId] = useState('SHIP001');
  const [year, setYear] = useState(2025);
  const [cb, setCb] = useState<ComplianceBalance | null>(null);
  const [bankData, setBankData] = useState<{ records: BankEntry[]; total: number }>({ records: [], total: 0 });
  const [bankAmount, setBankAmount] = useState('');
  const [applyAmount, setApplyAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComplianceBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const cbData = await apiClient.getComplianceBalance(shipId, year);
      const bankRecords = await apiClient.getBankRecords(shipId);
      setCb(cbData);
      setBankData(bankRecords);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    if (!cb || !bankAmount) return;
    
    try {
      setLoading(true);
      setError(null);
      await apiClient.bankSurplus(shipId, year, parseFloat(bankAmount));
      alert('Surplus banked successfully!');
      await loadComplianceBalance();
      setBankAmount('');
    } catch (err: any) {
      setError(err.message || 'Failed to bank surplus');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!cb || !applyAmount) return;
    
    try {
      setLoading(true);
      setError(null);
      await apiClient.applyBanked(shipId, year, parseFloat(applyAmount));
      alert('Banked surplus applied successfully!');
      await loadComplianceBalance();
      setApplyAmount('');
    } catch (err: any) {
      setError(err.message || 'Failed to apply banked surplus');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatEmissions = (emissions: number) => {
    if (emissions >= 1e9) return (emissions / 1e9).toFixed(2) + ' Gt CO₂eq';
    if (emissions >= 1e6) return (emissions / 1e6).toFixed(2) + ' Mt CO₂eq';
    if (emissions >= 1e3) return (emissions / 1e3).toFixed(2) + ' kt CO₂eq';
    return emissions.toFixed(2) + ' t CO₂eq';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-medium p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900">Banking System</h2>
            <p className="text-sm text-gray-600">Bank surplus or apply banked compliance balance</p>
          </div>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ship ID</label>
            <input
              type="text"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
              placeholder="SHIP001"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
              placeholder="2025"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={loadComplianceBalance}
              disabled={loading}
              className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 transition-all font-semibold shadow-medium"
            >
              {loading ? 'Loading...' : 'Load Balance'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      {cb && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-medium p-6">
            <p className="text-sm text-gray-600 mb-1">Current CB</p>
            <p className={`text-2xl font-bold ${cb.cbGco2eq >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatEmissions(cb.cbGco2eq)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-medium p-6">
            <p className="text-sm text-gray-600 mb-1">Total Banked</p>
            <p className="text-2xl font-bold text-purple-700">
              {formatEmissions(bankData.total)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-medium p-6">
            <p className="text-sm text-gray-600 mb-1">Target Intensity</p>
            <p className="text-2xl font-bold text-gray-700">
              {formatNumber(cb.targetIntensity)}
            </p>
            <p className="text-xs text-gray-500">gCO₂eq/MJ</p>
          </div>

          <div className="bg-white rounded-xl shadow-medium p-6">
            <p className="text-sm text-gray-600 mb-1">Actual Intensity</p>
            <p className="text-2xl font-bold text-gray-700">
              {formatNumber(cb.actualIntensity)}
            </p>
            <p className="text-xs text-gray-500">gCO₂eq/MJ</p>
          </div>
        </div>
      )}

      {/* Banking Actions */}
      {cb && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Surplus */}
          <div className="bg-white rounded-xl shadow-medium p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Bank Surplus</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount to Bank (gCO₂eq)
                </label>
                <input
                  type="number"
                  value={bankAmount}
                  onChange={(e) => setBankAmount(e.target.value)}
                  disabled={cb.cbGco2eq <= 0}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none disabled:bg-gray-100"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleBank}
                disabled={!bankAmount || cb.cbGco2eq <= 0 || loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 transition-all font-semibold shadow-medium"
              >
                Bank Surplus
              </button>
              {cb.cbGco2eq <= 0 && (
                <p className="text-xs text-red-600">Cannot bank deficit. Current CB must be positive.</p>
              )}
            </div>
          </div>

          {/* Apply Banked */}
          <div className="bg-white rounded-xl shadow-medium p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Apply Banked Surplus</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount to Apply (gCO₂eq)
                </label>
                <input
                  type="number"
                  value={applyAmount}
                  onChange={(e) => setApplyAmount(e.target.value)}
                  disabled={bankData.total <= 0}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none disabled:bg-gray-100"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleApply}
                disabled={!applyAmount || bankData.total <= 0 || loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 transition-all font-semibold shadow-medium"
              >
                Apply Banked
              </button>
              {bankData.total <= 0 && (
                <p className="text-xs text-amber-600">No banked surplus available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bank Records Table */}
      {bankData.records.length > 0 && (
        <div className="bg-white rounded-xl shadow-medium p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Banking History</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bankData.records.map((record, idx) => (
                  <tr key={idx} className="hover:bg-purple-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{record.year}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {formatEmissions(record.amountGco2eq)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankingTab;
