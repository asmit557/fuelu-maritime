import React, { useEffect, useState } from 'react';
import { IApiClient } from '../../../core/ports/IApiClient';
import { Route } from '../../../core/domain/models/Route';
import { formatNumber, formatEmissions } from '../../../core/application/services/formatters';

interface RoutesTabProps {
  apiClient: IApiClient;
}

/**
 * Routes Tab Component - Display and manage maritime routes
 */
const RoutesTab: React.FC<RoutesTabProps> = ({ apiClient }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    vesselType: '',
    fuelType: '',
    year: ''
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getRoutes();
      setRoutes(data);
    } catch (error) {
      console.error('Failed to load routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBaseline = async (routeId: string) => {
    try {
      await apiClient.setBaseline(routeId);
      await loadRoutes();
      alert('Baseline set successfully!');
    } catch (error) {
      alert('Failed to set baseline');
    }
  };

  const filteredRoutes = routes.filter(route => {
    if (filters.vesselType && route.vesselType !== filters.vesselType) return false;
    if (filters.fuelType && route.fuelType !== filters.fuelType) return false;
    if (filters.year && route.year.toString() !== filters.year) return false;
    return true;
  });

  const vesselTypes = [...new Set(routes.map(r => r.vesselType))];
  const fuelTypes = [...new Set(routes.map(r => r.fuelType))];
  const years = [...new Set(routes.map(r => r.year))];

  if (loading) {
    return <div className="text-center py-12">Loading routes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Maritime Routes</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.vesselType}
            onChange={e => setFilters({ ...filters, vesselType: e.target.value })}
          >
            <option value="">All Vessel Types</option>
            {vesselTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.fuelType}
            onChange={e => setFilters({ ...filters, fuelType: e.target.value })}
          >
            <option value="">All Fuel Types</option>
            {fuelTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filters.year}
            onChange={e => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Routes Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vessel Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GHG Intensity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Emissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoutes.map(route => (
                <tr key={route.id} className={route.isBaseline ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium">{route.routeId}</span>
                    {route.isBaseline && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Baseline</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.vesselType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.fuelType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatNumber(route.ghgIntensity)} gCO₂eq/MJ</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatNumber(route.distance)} nm</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatEmissions(route.totalEmissions)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!route.isBaseline && (
                      <button
                        onClick={() => handleSetBaseline(route.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                      >
                        Set Baseline
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No routes found matching the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutesTab;
