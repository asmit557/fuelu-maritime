import { Pool } from 'pg';
import { IRouteRepository } from '../../../core/ports/outbound/IRouteRepository';
import { Route } from '../../../core/domain/entities/Route';

export class PostgresRouteRepository implements IRouteRepository {
  constructor(private db: Pool) {}

  // Helper to convert entity to API response format
  private toDTO(route: Route) {
    return {
      id: route.id,
      routeId: route.routeId,
      vesselType: route.vesselType,
      fuelType: route.fuelType,
      year: route.year,
      ghgIntensity: route.ghgIntensity,
      fuelConsumption: route.fuelConsumption,
      distance: route.distance,
      isBaseline: route.isBaseline,
      totalEmissions: route.calculateTotalEmissions(),
      energy: route.calculateEnergy()
    };
  }

  async findAll(): Promise<any[]> {
    const result = await this.db.query(
      'SELECT * FROM routes ORDER BY year DESC, route_id'
    );
    return result.rows.map(row => this.toDTO(this.mapToEntity(row)));
  }

  async findById(id: string): Promise<any | null> {
    const result = await this.db.query(
      'SELECT * FROM routes WHERE id = $1',
      [id]
    );
    return result.rows.length > 0 
      ? this.toDTO(this.mapToEntity(result.rows[0])) 
      : null;
  }

  async findByRouteId(routeId: string): Promise<any | null> {
    const result = await this.db.query(
      'SELECT * FROM routes WHERE route_id = $1',
      [routeId]
    );
    return result.rows.length > 0 
      ? this.toDTO(this.mapToEntity(result.rows[0])) 
      : null;
  }

  async findBaseline(): Promise<any | null> {
    const result = await this.db.query(
      'SELECT * FROM routes WHERE is_baseline = true LIMIT 1'
    );
    return result.rows.length > 0 
      ? this.toDTO(this.mapToEntity(result.rows[0])) 
      : null;
  }

  async update(route: Route): Promise<void> {
    await this.db.query(
      `UPDATE routes 
       SET is_baseline = $1 
       WHERE id = $2`,
      [route.isBaseline, route.id]
    );
  }

  async save(route: Route): Promise<void> {
    await this.db.query(
      `INSERT INTO routes 
       (id, route_id, vessel_type, fuel_type, year, ghg_intensity, 
        fuel_consumption, distance, is_baseline) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
       is_baseline = EXCLUDED.is_baseline`,
      [
        route.id,
        route.routeId,
        route.vesselType,
        route.fuelType,
        route.year,
        route.ghgIntensity,
        route.fuelConsumption,
        route.distance,
        route.isBaseline
      ]
    );
  }

  private mapToEntity(row: any): Route {
    return new Route(
      row.id,
      row.route_id,
      row.vessel_type,
      row.fuel_type,
      row.year,
      parseFloat(row.ghg_intensity),
      parseFloat(row.fuel_consumption),
      parseFloat(row.distance),
      row.is_baseline
    );
  }
}
