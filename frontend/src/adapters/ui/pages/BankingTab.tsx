import React, { useState } from 'react';
import { IApiClient } from '../../../core/ports/IApiClient';
import { formatEmissions } from '../../../core/application/services/formatters';

interface BankingTabProps {
  apiClient: IApiClient;
}

/**
 * Banking Tab Component - Manage compliance balance banking
 */
const BankingTab: React.FC<BankingTabProps> = ({ apiClient }) => {
  const [shipId, setShipId] = useState('SHIP001');
  const [year, setYear] = useState(2025);
  const [cbData, setCbData] = useState<any>(null);
  const [bankAmount, setBankAmount] = useState('');
  const [applyAmount, setApplyAmount] = useState('');
  const [totalBanked, setTotalBanked] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadCB = async () => {
    try {
      setLoading(true);
      const cb = await apiClient.getComplianceBalance(shipId, year);
      const bankRecords = await apiClient.getBankRecords(shipId);
      setCbData(cb);
      setTotalBanked(bankRecords.total);
    } catch (error) {
      alert('Failed to load compliance balance');
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    try {
      const amount = parseFloat(bankAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      await apiClient.bankSurplus(shipId, year, amount);
      alert('Surplus banked successfully!');
      setBankAmount('');
      await loadCB();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to bank surplus');
    }
  };

  const handleApply = async () => {
    try {
      const amount = parseFloat(applyAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      await apiClient.applyBanked(shipId, year, amount);
      alert('Banked surplus applied successfully!');
      setApplyAmount('');
      await loadCB();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to apply banked surplus');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Banking Management</h2>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Ship ID"
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={shipId}
            onChange={e => setShipId(e.target.value)}
          />
          <input
            type="number"
            placeholder="Year"
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={year}
            onChange={e => setYear(parseInt(e.target.value))}
          />
          <button
            onClick={loadCB}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Load CB'}
          </button>
        </div>

        {/* CB Display */}
        {cbData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current CB */}
              <div className={`p-6 rounded-lg ${cbData.cbGco2eq >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Compliance Balance</h3>
                <p className={`text-4xl font-bold ${cbData.cbGco2eq >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatEmissions(cbData.cbGco2eq)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {cbData.cbGco2eq >= 0 ? 'Surplus' : 'Deficit'}
                </p>
              </div>

              {/* Total Banked */}
              <div className="p-6 rounded-lg bg-blue-50">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Total Banked</h3>
                <p className="text-4xl font-bold text-blue-600">
                  {formatEmissions(totalBanked)}
                </p>
                <p className="text-sm text-gray-600 mt-2">Available for future use</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bank Surplus */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Bank Surplus</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Bank excess compliance balance for future use
                </p>
                <div className="space-y-4">
                  <input
                    type="number"
                    placeholder="Amount to bank (gCO₂eq)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={bankAmount}
                    onChange={e => setBankAmount(e.target.value)}
                    disabled={cbData.cbGco2eq <= 0}
                  />
                  <button
                    onClick={handleBank}
                    disabled={cbData.cbGco2eq <= 0}
                    className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Bank Surplus
                  </button>
                  {cbData.cbGco2eq <= 0 && (
                    <p className="text-sm text-red-600">Cannot bank deficit balance</p>
                  )}
                </div>
              </div>

              {/* Apply Banked */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Apply Banked</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use banked surplus to offset current deficit
                </p>
                <div className="space-y-4">
                  <input
                    type="number"
                    placeholder="Amount to apply (gCO₂eq)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={applyAmount}
                    onChange={e => setApplyAmount(e.target.value)}
                    disabled={totalBanked <= 0}
                  />
                  <button
                    onClick={handleApply}
                    disabled={totalBanked <= 0}
                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Apply Banked
                  </button>
                  {totalBanked <= 0 && (
                    <p className="text-sm text-red-600">No banked surplus available</p>
                  )}
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Target Intensity</p>
                  <p className="text-xl font-bold">{cbData.targetIntensity.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Actual Intensity</p>
                  <p className="text-xl font-bold">{cbData.actualIntensity.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Energy (MJ)</p>
                  <p className="text-xl font-bold">{(cbData.energy / 1e9).toFixed(2)}B</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="text-xl font-bold">{cbData.year}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!cbData && (
          <div className="text-center py-12 text-gray-500">
            Enter ship ID and year, then click "Load CB" to view compliance balance
          </div>
        )}
      </div>
    </div>
  );
};

export default BankingTab;
