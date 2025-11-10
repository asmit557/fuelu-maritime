-- FuelEU Maritime Database Schema

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY,
    route_id VARCHAR(50) NOT NULL,
    vessel_type VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    ghg_intensity DECIMAL(10, 4) NOT NULL,
    fuel_consumption DECIMAL(10, 2) NOT NULL,
    distance DECIMAL(10, 2) NOT NULL,
    is_baseline BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ship compliance table
CREATE TABLE IF NOT EXISTS ship_compliance (
    id UUID PRIMARY KEY,
    ship_id VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    cb_gco2eq DECIMAL(15, 2) NOT NULL,
    target_intensity DECIMAL(10, 4) NOT NULL,
    actual_intensity DECIMAL(10, 4) NOT NULL,
    energy DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ship_id, year)
);

-- Bank entries table
CREATE TABLE IF NOT EXISTS bank_entries (
    id UUID PRIMARY KEY,
    ship_id VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    amount_gco2eq DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pools table
CREATE TABLE IF NOT EXISTS pools (
    id UUID PRIMARY KEY,
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pool members table
CREATE TABLE IF NOT EXISTS pool_members (
    pool_id UUID REFERENCES pools(id) ON DELETE CASCADE,
    ship_id VARCHAR(50) NOT NULL,
    cb_before DECIMAL(15, 2) NOT NULL,
    cb_after DECIMAL(15, 2) NOT NULL,
    PRIMARY KEY (pool_id, ship_id)
);

-- Indexes
CREATE INDEX idx_routes_year ON routes(year);
CREATE INDEX idx_routes_baseline ON routes(is_baseline);
CREATE INDEX idx_compliance_ship_year ON ship_compliance(ship_id, year);
CREATE INDEX idx_bank_ship ON bank_entries(ship_id);
CREATE INDEX idx_pools_year ON pools(year);
