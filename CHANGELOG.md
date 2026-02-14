# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
-   **Documentation**: Complete overhaul of project documentation.
    -   Added `docs/ARCHITECTURE.md`: Deep dive into Hybrid Monorepo design.
    -   Added `docs/API.md`: Comprehensive API reference.
    -   Added `docs/CONFIGURATION.md`: Environment variables and feature flags.
    -   Added `docs/DEVELOPMENT.md`: Setup and workflow guide.
    -   Added `docs/DEPLOYMENT.md`: Vercel and Cloud Run deployment strategies.
    -   Added `CONTRIBUTING.md`: Guidelines for contributors.
-   **Code Quality**: Added JSDoc/TSDoc to core services:
    -   `src/lib/ai/agents/base-agent.ts`
    -   `src/lib/services/budget-service.ts`
    -   `src/lib/services/transaction-service.ts`

### Changed
-   **README.md**: Rewritten to follow "Front Door" philosophy, focusing on quick start and high-level overview.

## [0.1.0] - 2024-03-01

### Added
-   Initial release of FinanceFlow.
-   Core Transaction Management (CRUD).
-   Basic Budgeting (Create, Update, Alerts).
-   AI Integration (Gemini 1.5 Flash) for categorization.
-   Hybrid Next.js + NestJS architecture.
