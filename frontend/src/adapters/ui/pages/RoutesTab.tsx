import React, { useEffect, useState } from 'react';
import { IApiClient } from '../../../core/ports/IApiClient';
import { Route } from '../../../core/domain/models/Route';

interface RoutesTabProps {
  apiClient: IApiClient;
}

const RoutesTab: React.FC<RoutesTabProps> = ({ apiClient }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    vesselType: '',
    fuelType: '',
    year: ''
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getRoutes();
      setRoutes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const handleSetBaseline = async (routeId: string) => {
    try {
      await apiClient.setBaseline(routeId);
      await fetchRoutes();
      alert('Baseline set successfully!');
    } catch (err: any) {
      alert('Failed to set baseline: ' + err.message);
    }
  };

  const filteredRoutes = routes.filter(route => {
    if (filters.vesselType && route.vesselType !== filters.vesselType) return false;
    if (filters.fuelType && route.fuelType !== filters.fuelType) return false;
    if (filters.year && route.year.toString() !== filters.year) return false;
    return true;
  });

  const vesselTypes = Array.from(new Set(routes.map(r => r.vesselType)));
  const fuelTypes = Array.from(new Set(routes.map(r => r.fuelType)));
  const years = Array.from(new Set(routes.map(r => r.year))).sort((a, b) => b - a);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatEmissions = (emissions: number) => {
    if (emissions >= 1e12) return (emissions / 1e12).toFixed(2) + ' Tt';
    if (emissions >= 1e9) return (emissions / 1e9).toFixed(2) + ' Gt';
    if (emissions >= 1e6) return (emissions / 1e6).toFixed(2) + ' Mt';
    if (emissions >= 1e3) return (emissions / 1e3).toFixed(2) + ' kt';
    return emissions.toFixed(2) + ' t';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <p className="text-red-700 font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-medium p-6">
        {/* Header with Icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900">Maritime Routes</h2>
              <p className="text-sm text-gray-600">Manage vessel routes and emissions data</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-purple-50 rounded-xl">
            <p className="text-sm font-semibold text-purple-700">{filteredRoutes.length} Routes</p>
          </div>
        </div>
        
        {/* Enhanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vessel Type</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none font-medium"
              value={filters.vesselType}
              onChange={e => setFilters({ ...filters, vesselType: e.target.value })}
            >
              <option value="">All Vessel Types</option>
              {vesselTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none font-medium"
              value={filters.fuelType}
              onChange={e => setFilters({ ...filters, fuelType: e.target.value })}
            >
              <option value="">All Fuel Types</option>
              {fuelTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none font-medium"
              value={filters.year}
              onChange={e => setFilters({ ...filters, year: e.target.value })}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="overflow-x-auto rounded-xl border-2 border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                {['Route ID', 'Vessel Type', 'Fuel Type', 'Year', 'GHG Intensity', 'Distance', 'Total Emissions', 'Actions'].map(header => (
                  <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredRoutes.map(route => (
                <tr key={route.id} className={`hover:bg-purple-50 transition-colors ${route.isBaseline ? 'bg-purple-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-bold text-purple-700">{route.routeId}</span>
                      {route.isBaseline && (
                        <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-semibold">
                          ★ Baseline
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{route.vesselType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                      {route.fuelType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{route.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {formatNumber(route.ghgIntensity)} <span className="text-gray-500 text-xs">gCO₂eq/MJ</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {formatNumber(route.distance)} <span className="text-gray-500 text-xs">nm</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{formatEmissions(route.totalEmissions)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!route.isBaseline && (
                      <button
                        onClick={() => handleSetBaseline(route.id)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-semibold shadow-soft hover:shadow-medium transform hover:-translate-y-0.5"
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
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No routes found matching the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutesTab;
