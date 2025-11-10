import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import RoutesTab from './RoutesTab';

describe('RoutesTab', () => {
  const mockApiClient = {
    getRoutes: vi.fn().mockResolvedValue([
      {
        id: '1',
        routeId: 'R001',
        vesselType: 'Container Ship',
        fuelType: 'HFO',
        year: 2025,
        ghgIntensity: 87.20,
        fuelConsumption: 500,
        distance: 5000,
        totalEmissions: 1000000,
        energy: 20500000,
        isBaseline: false,
      },
    ]),
    setBaseline: vi.fn(),
  };

  test('renders routes table', async () => {
    render(<RoutesTab apiClient={mockApiClient as any} />);
    
    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.getByText('Container Ship')).toBeInTheDocument();
    });
  });

  test('filters routes by vessel type', async () => {
    render(<RoutesTab apiClient={mockApiClient as any} />);
    
    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
    });

    const select = screen.getByDisplayValue('All Vessel Types');
    fireEvent.change(select, { target: { value: 'Tanker' } });

    expect(screen.queryByText('R001')).not.toBeInTheDocument();
  });
});
