import { IRouteService } from '../../core/ports/inbound/IRouteService';
import { IRouteRepository } from '../../core/ports/outbound/IRouteRepository';
import { Route } from '../../core/domain/entities/Route';
import { ComparisonResult, ComputeComparison } from '../../core/appilcation/useCases/ComputeComparison';

export class RouteService implements IRouteService {
  constructor(private routeRepository: IRouteRepository) {}

  async getAllRoutes(): Promise<any[]> {
    return await this.routeRepository.findAll();
  }

  async getRouteById(id: string): Promise<any | null> {
    return await this.routeRepository.findById(id);
  }

  async setBaseline(routeId: string): Promise<any> {
    // Get the internal Route entity (not DTO)
    const result = await this.routeRepository.findById(routeId);
    if (!result) {
      throw new Error('Route not found');
    }

    // Reconstruct Route entity from DTO
    const route = new Route(
      result.id,
      result.routeId,
      result.vesselType,
      result.fuelType,
      result.year,
      result.ghgIntensity,
      result.fuelConsumption,
      result.distance,
      result.isBaseline
    );

    // Clear existing baseline
    const currentBaseline = await this.routeRepository.findBaseline();
    if (currentBaseline) {
      const baselineEntity = new Route(
        currentBaseline.id,
        currentBaseline.routeId,
        currentBaseline.vesselType,
        currentBaseline.fuelType,
        currentBaseline.year,
        currentBaseline.ghgIntensity,
        currentBaseline.fuelConsumption,
        currentBaseline.distance,
        false // Set to false
      );
      await this.routeRepository.update(baselineEntity);
    }

    // Set new baseline
    const newBaseline = route.setBaseline();
    await this.routeRepository.update(newBaseline);
    
    // Return DTO
    return await this.routeRepository.findById(routeId);
  }

  async getComparison(): Promise<ComparisonResult[]> {
    const routesData = await this.routeRepository.findAll();
    const baselineData = await this.routeRepository.findBaseline();
    
    if (!baselineData) {
      throw new Error('No baseline route found. Please set a baseline first.');
    }

    // Convert DTOs back to Route entities for business logic
    const routes = routesData.map(r => new Route(
      r.id,
      r.routeId,
      r.vesselType,
      r.fuelType,
      r.year,
      r.ghgIntensity,
      r.fuelConsumption,
      r.distance,
      r.isBaseline
    ));

    const baseline = new Route(
      baselineData.id,
      baselineData.routeId,
      baselineData.vesselType,
      baselineData.fuelType,
      baselineData.year,
      baselineData.ghgIntensity,
      baselineData.fuelConsumption,
      baselineData.distance,
      baselineData.isBaseline
    );

    const computeComparison = new ComputeComparison();
    return computeComparison.execute(routes, baseline);
  }
}
