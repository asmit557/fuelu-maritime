import React, { useState } from 'react';
import { IApiClient } from '../../../core/ports/IApiClient';
import { PoolMember } from '../../../core/domain/models/Compliance';

interface PoolingTabProps {
  apiClient: IApiClient;
}

const PoolingTab: React.FC<PoolingTabProps> = ({ apiClient }) => {
  const [year, setYear] = useState(2025);
  const [members, setMembers] = useState<PoolMember[]>([
    { shipId: 'SHIP001', cbBefore: 432500000, cbAfter: 309500000 },
    { shipId: 'SHIP005', cbBefore: -123000000, cbAfter: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMember = () => {
    setMembers([...members, { shipId: '', cbBefore: 0, cbAfter: 0 }]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof PoolMember, value: string | number) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const totalBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);
  const totalAfter = members.reduce((sum, m) => sum + m.cbAfter, 0);
  const isConserved = Math.abs(totalBefore - totalAfter) < 0.01;
  const isValid = members.length >= 2 && isConserved && totalAfter >= 0;

  const handleCreatePool = async () => {
    if (!isValid) {
      alert('Pool validation failed. Please check all requirements.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiClient.createPool(year, members);
      alert('Pool created successfully!');
      setMembers([
        { shipId: 'SHIP001', cbBefore: 0, cbAfter: 0 },
        { shipId: 'SHIP005', cbBefore: 0, cbAfter: 0 }
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to create pool');
    } finally {
      setLoading(false);
    }
  };

  const formatEmissions = (emissions: number) => {
    if (emissions >= 1e9) return (emissions / 1e9).toFixed(2) + ' Gt';
    if (emissions >= 1e6) return (emissions / 1e6).toFixed(2) + ' Mt';
    if (emissions >= 1e3) return (emissions / 1e3).toFixed(2) + ' kt';
    return emissions.toFixed(2) + ' t';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-medium p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900">Pooling Arrangements</h2>
              <p className="text-sm text-gray-600">Create multi-ship pooling with automatic validation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-700">Year:</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Add Member Button */}
        <button
          onClick={addMember}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-semibold shadow-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Member
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pool Members</h3>
        <div className="overflow-x-auto rounded-lg border-2 border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ship ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">CB Before (gCO₂eq)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">CB After (gCO₂eq)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Change</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {members.map((member, index) => {
                const change = member.cbAfter - member.cbBefore;
                return (
                  <tr key={index} className="hover:bg-purple-50">
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={member.shipId}
                        onChange={(e) => updateMember(index, 'shipId', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                        placeholder="SHIP001"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={member.cbBefore}
                        onChange={(e) => updateMember(index, 'cbBefore', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={member.cbAfter}
                        onChange={(e) => updateMember(index, 'cbAfter', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change >= 0 ? '+' : ''}{formatEmissions(change)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => removeMember(index)}
                        disabled={members.length <= 2}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition-all text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-purple-50">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">TOTAL</td>
                <td className="px-6 py-4 font-bold text-purple-700">{formatEmissions(totalBefore)}</td>
                <td className="px-6 py-4 font-bold text-purple-700">{formatEmissions(totalAfter)}</td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${isConserved ? 'text-green-600' : 'text-red-600'}`}>
                    {isConserved ? '✓ Conserved' : '✗ Not Conserved'}
                  </span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-medium p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Members</p>
              <p className="text-3xl font-bold text-purple-700">{members.length}</p>
            </div>
            <div className={`p-3 rounded-lg ${members.length >= 2 ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className={`text-2xl ${members.length >= 2 ? 'text-green-600' : 'text-red-600'}`}>
                {members.length >= 2 ? '✓' : '✗'}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Minimum: 2 members</p>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">CB Conservation</p>
              <p className={`text-3xl font-bold ${isConserved ? 'text-green-600' : 'text-red-600'}`}>
                {isConserved ? '✓ Yes' : '✗ No'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isConserved ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className={`text-2xl ${isConserved ? 'text-green-600' : 'text-red-600'}`}>
                {isConserved ? '✓' : '✗'}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Before = After</p>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Final Total</p>
              <p className={`text-3xl font-bold ${totalAfter >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalAfter >= 0 ? '✓ ≥ 0' : '✗ < 0'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${totalAfter >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className={`text-2xl ${totalAfter >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalAfter >= 0 ? '✓' : '✗'}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Must be non-negative</p>
        </div>
      </div>

      {/* Create Pool Button */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <button
          onClick={handleCreatePool}
          disabled={!isValid || loading}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 transition-all font-bold text-lg shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {loading ? 'Creating Pool...' : 'Create Pool'}
        </button>
        {!isValid && (
          <p className="text-center text-sm text-red-600 mt-3">
            Please ensure all validation rules are met
          </p>
        )}
      </div>
    </div>
  );
};

export default PoolingTab;
