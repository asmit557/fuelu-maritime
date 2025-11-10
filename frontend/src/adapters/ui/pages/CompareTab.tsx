import React, { useEffect, useState } from 'react';
import { IApiClient } from '../../../core/ports/IApiClient';
import { ComparisonData } from '../../../core/domain/models/Route';
import { formatNumber, formatPercentage } from '../../../core/application/services/formatters';

interface CompareTabProps {
  apiClient: IApiClient;
}

/**
 * Compare Tab Component - Compare routes against FuelEU targets
 */
const CompareTab: React.FC<CompareTabProps> = ({ apiClient }) => {
  const [comparison, setComparison] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getComparison();
      setComparison(data);
    } catch (error) {
      console.error('Failed to load comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading comparison data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">GHG Intensity Comparison</h2>
        <p className="text-gray-600 mb-6">
          Target for 2025: <strong>89.34 gCO₂eq/MJ</strong> (2% reduction from 2020 baseline)
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vessel/Fuel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">vs Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">vs Baseline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparison.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.routeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div>{item.vesselType}</div>
                      <div className="text-gray-500">{item.fuelType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatNumber(item.actualIntensity, 2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatNumber(item.targetIntensity, 2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={item.percentDiffFromTarget < 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatPercentage(item.percentDiffFromTarget)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={item.percentDiffFromBaseline < 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatPercentage(item.percentDiffFromBaseline)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.isCompliant ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">✓ Compliant</span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">✗ Non-Compliant</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-2">Compliant Routes</h3>
            <p className="text-3xl font-bold text-green-600">
              {comparison.filter(c => c.isCompliant).length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 mb-2">Non-Compliant Routes</h3>
            <p className="text-3xl font-bold text-red-600">
              {comparison.filter(c => !c.isCompliant).length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Average Intensity</h3>
            <p className="text-3xl font-bold text-blue-600">
              {formatNumber(comparison.reduce((sum, c) => sum + c.actualIntensity, 0) / comparison.length, 2)}
            </p>
            <p className="text-xs text-blue-600 mt-1">gCO₂eq/MJ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareTab;
