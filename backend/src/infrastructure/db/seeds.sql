-- Seed data for FuelEU Maritime platform

-- Insert 5 mock routes
INSERT INTO routes (id, route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, is_baseline) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'R001', 'Container Ship', 'HFO', 2020, 91.50, 500.00, 5000.00, true),
('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'R002', 'Container Ship', 'VLSFO', 2025, 87.20, 450.00, 4800.00, false),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'R003', 'Bulk Carrier', 'MGO', 2025, 75.30, 380.00, 4200.00, false),
('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 'R004', 'Tanker', 'LNG', 2025, 56.80, 420.00, 4500.00, false),
('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'R005', 'Container Ship', 'Methanol', 2025, 65.40, 410.00, 4600.00, false);

-- Insert compliance balances
INSERT INTO ship_compliance (id, ship_id, year, cb_gco2eq, target_intensity, actual_intensity, energy) VALUES
('f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c', 'SHIP001', 2025, 432500000, 89.34, 87.20, 18450000000),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 'SHIP002', 2025, 2177520000, 89.34, 75.30, 15580000000),
('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 'SHIP003', 2025, 5600880000, 89.34, 56.80, 17220000000),
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'SHIP004', 2025, 4016340000, 89.34, 65.40, 16810000000),
('d0e1f2a3-b4c5-4d5e-7f8a-9b0c1d2e3f4a', 'SHIP005', 2025, -123000000, 89.34, 92.10, 6150000000);
