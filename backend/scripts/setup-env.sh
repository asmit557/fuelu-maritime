#!/bin/bash

# Setup environment variables for local development

cat > .env << EOF
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fueleu_maritime
DB_USER=postgres
DB_PASSWORD=postgres

# Logging
LOG_LEVEL=debug
EOF

echo "✓ Environment variables configured in .env"
