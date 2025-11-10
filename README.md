# ⚓ FuelEU Maritime Compliance Platform

A production-ready web platform for monitoring and managing maritime GHG emissions compliance under the **FuelEU Maritime Regulation (EU) 2023/1805**.

## 🎯 Features

- **Routes Management**: Track vessel routes with GHG intensity, fuel consumption, and emissions data
- **Compliance Comparison**: Compare actual emissions against FuelEU targets (2025-2050)
- **Banking System**: Bank surplus compliance balance for future use
- **Pooling Arrangements**: Create multi-ship pooling with automatic validation

## 🏗️ Architecture

Built using **Hexagonal Architecture (Ports & Adapters)** for maximum testability and maintainability:



## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Backend Setup

Backend will run on `http://localhost:3000`

### Frontend Setup

Frontend will run on `http://localhost:5173`

## 📊 Database Schema

## 🔗 API Endpoints

### Routes
- `GET /api/routes` - List all routes
- `POST /api/routes/:id/baseline` - Set baseline route
- `GET /api/routes/comparison` - Compare routes vs targets

### Compliance
- `GET /api/compliance/cb?shipId={id}&year={year}` - Get compliance balance
- `GET /api/compliance/adjusted-cb?shipId={id}&year={year}` - Get adjusted CB

### Banking
- `GET /api/banking/records?shipId={id}&year={year}` - Get bank records
- `POST /api/banking/bank` - Bank surplus
- `POST /api/banking/apply` - Apply banked surplus

### Pooling
- `POST /api/pools` - Create pool

## 🧪 Testing

## 📐 Business Logic

### Compliance Balance Formula


### FuelEU Targets
| Year | Target (gCO₂eq/MJ) | Reduction |
|------|-------------------|-----------|
| 2025 | 89.34 | 2% |
| 2030 | 85.69 | 6% |
| 2035 | 77.94 | 14.5% |
| 2040 | 62.30 | 31% |
| 2045 | 34.64 | 62% |
| 2050 | 18.23 | 80% |

### Pool Validation Rules
1. Minimum 2 members
2. Total CB must be conserved (before = after)
3. Deficit ships cannot exit worse
4. Surplus ships cannot exit negative
5. Final pool sum ≥ 0

## 🎨 UI Screenshots

### Routes Tab
View and manage maritime routes with filtering capabilities.

### Compare Tab
Visual comparison of actual emissions vs FuelEU targets with compliance status.

### Banking Tab
Interface for banking surplus and applying banked compliance balance.

### Pooling Tab
Create pooling arrangements with real-time validation feedback.

## 📚 Technology Stack

**Backend:**
- Node.js + Express.js
- TypeScript (strict mode)
- PostgreSQL with `pg` driver
- UUID for IDs
- Helmet, CORS, Morgan for middleware

**Frontend:**
- React 18
- TypeScript (strict mode)
- TailwindCSS for styling
- Axios for HTTP
- Vite for build tooling

**Testing:**
- Jest (backend)
- Vitest (frontend)
- Supertest (integration)
- React Testing Library

## 🔐 Security Considerations

- Helmet.js for HTTP security headers
- CORS configuration for cross-origin requests
- Prepared statements to prevent SQL injection
- Input validation at controller level
- TypeScript strict mode for type safety

## 📈 Performance

- Database connection pooling (max 20 connections)
- Indexed queries on ship_id, year, baseline
- Efficient FIFO deduction for banking
- Lazy loading for large datasets

## 🤝 AI-Assisted Development

This project was developed using AI assistance (Claude 3.5). See `AGENT_WORKFLOW.md` for detailed documentation of:
- Prompting strategies
- Code generation process
- Human validation steps
- Time savings analysis

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: support@fueleu-platform.example

---

**Built with ⚓ for maritime compliance**










