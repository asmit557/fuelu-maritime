import React, { useState } from 'react';
import { IApiClient } from '../../../core/ports/IApiClient';
import { PoolMember } from '../../../core/domain/models/Compliance';
import { formatEmissions } from '../../../core/application/services/formatters';

interface PoolingTabProps {
  apiClient: IApiClient;
}

/**
 * Pooling Tab Component - Create and manage pooling arrangements
 */
const PoolingTab: React.FC<PoolingTabProps> = ({ apiClient }) => {
  const [year, setYear] = useState(2025);
  const [members, setMembers] = useState<PoolMember[]>([
    { shipId: 'SHIP001', cbBefore: 432500000, cbAfter: 0 },
    { shipId: 'SHIP005', cbBefore: -123000000, cbAfter: 0 }
  ]);
  const [result, setResult] = useState<any>(null);

  const addMember = () => {
    setMembers([...members, { shipId: '', cbBefore: 0, cbAfter: 0 }]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof PoolMember, value: any) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const calculatePool = () => {
    const totalBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);
    const totalAfter = members.reduce((sum, m) => sum + m.cbAfter, 0);

    // Validation
    const errors: string[] = [];

    if (members.length < 2) {
      errors.push('Pool must have at least 2 members');
    }

    if (Math.abs(totalBefore - totalAfter) > 0.01) {
      errors.push('Total CB must be conserved (before = after)');
    }

    members.forEach((m, i) => {
      if (m.cbBefore < 0 && m.cbAfter < m.cbBefore) {
        errors.push(`Ship ${i + 1}: Deficit ship cannot exit worse`);
      }
      if (m.cbBefore > 0 && m.cbAfter < 0) {
        errors.push(`Ship ${i + 1}: Surplus ship cannot exit negative`);
      }
    });

    if (totalAfter < 0) {
      errors.push('Pool total CB must be non-negative');
    }

    if (errors.length > 0) {
      alert('Validation errors:\n' + errors.join('\n'));
      return;
    }

    setResult({
      totalBefore,
      totalAfter,
      valid: true
    });
  };

  const createPool = async () => {
    if (!result || !result.valid) {
      alert('Please calculate pool first');
      return;
    }

    try {
      await apiClient.createPool(year, members);
      alert('Pool created successfully!');
      setResult(null);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create pool');
    }
  };

  const totalBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);
  const totalAfter = members.reduce((sum, m) => sum + m.cbAfter, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pooling Management</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <input
            type="number"
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={year}
            onChange={e => setYear(parseInt(e.target.value))}
          />
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ship ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CB Before</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CB After</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member, index) => {
                const change = member.cbAfter - member.cbBefore;
                return (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        className="px-3 py-2 border border-gray-300 rounded"
                        value={member.shipId}
                        onChange={e => updateMember(index, 'shipId', e.target.value)}
                        placeholder="Ship ID"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        className="px-3 py-2 border border-gray-300 rounded w-32"
                        value={member.cbBefore}
                        onChange={e => updateMember(index, 'cbBefore', parseFloat(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        className="px-3 py-2 border border-gray-300 rounded w-32"
                        value={member.cbAfter}
                        onChange={e => updateMember(index, 'cbAfter', parseFloat(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatEmissions(change)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => removeMember(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-4 font-bold">Total</td>
                <td className="px-6 py-4 font-bold">
                  <span className={totalBefore >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatEmissions(totalBefore)}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">
                  <span className={totalAfter >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatEmissions(totalAfter)}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">
                  <span className={Math.abs(totalBefore - totalAfter) < 0.01 ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(totalBefore - totalAfter) < 0.01 ? '✓ Balanced' : '✗ Unbalanced'}
                  </span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={addMember}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Add Member
          </button>
          <button
            onClick={calculatePool}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Calculate Pool
          </button>
          <button
            onClick={createPool}
            disabled={!result || !result.valid}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
          >
            Create Pool
          </button>
        </div>

        {/* Result */}
        {result && result.valid && (
          <div className="mt-6 p-6 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-4">✓ Pool Validation Passed</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total CB Before</p>
                <p className="text-2xl font-bold text-green-600">{formatEmissions(result.totalBefore)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total CB After</p>
                <p className="text-2xl font-bold text-green-600">{formatEmissions(result.totalAfter)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">Click "Create Pool" to save this pooling arrangement.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoolingTab;
