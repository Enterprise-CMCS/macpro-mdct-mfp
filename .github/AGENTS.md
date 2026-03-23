# MDCT-MFP Coding Agent Instructions

MDCT-MFP (Money Follows the Person) is a CMS (Centers for Medicare & Medicaid Services) application for collecting state data related to the MFP program. It is a full-stack TypeScript application deployed to AWS using CDK.

## Repository Overview

- **Type**: Monorepo with multiple services
- **Languages**: TypeScript (100%)
- **Frameworks**: React 19 (frontend), Node.js Lambda (backend), AWS CDK (infrastructure)
- **Runtime**: Node.js v22.19.0 (specified in `.nvmrc`)
- **Package Manager**: Yarn 4.12.0 (via Corepack)
- **Size**: ~600 source files across services

## Critical Prerequisites

**Always run these commands first before any build, test, or local development:**

```bash
# 1. Use correct Node version (REQUIRED - scripts will fail otherwise)
nvm use

# 2. Dependencies are installed automatically by ./run, but can be done manually:
./run install
```

## Build and Validation Commands

### Running Locally

```bash
# Start local development (requires Docker via Colima and LocalStack)
./run local
```

**Local prerequisites** (auto-checked by `./run local`):

- Colima must be running: `colima start --cpu 4 --memory 10`
- LocalStack must be running: `localstack start`

### Linting (Pre-commit Checks)

```bash
# Run linter (MUST pass for CI)
yarn oxlint --deny-warnings

# Check formatting (MUST pass for CI)
yarn oxfmt --check

# Auto-fix formatting
yarn oxfmt
```

### TypeScript Checks

```bash
# Backend API
cd services/app-api && yarn tsc --noEmit

# Frontend UI
cd services/ui-src && yarn tsc --noEmit

# CLI
cd cli && yarn tsc --noEmit

# CDK/Deployment
cd deployment && yarn tsc --noEmit
```

### Unit Tests

```bash
# Backend tests (~3 seconds)
cd services/app-api && yarn test

# Frontend tests (~25 seconds)
cd services/ui-src && yarn test

# With coverage
yarn coverage  # in either service directory
```

### Integration Tests (Playwright)

```bash
cd tests
yarn playwright install  # One-time setup
yarn test:e2e            # Run all tests
yarn test:e2e-stable     # Exclude @flaky tests
```

## Project Structure

```
/
├── services/
│   ├── app-api/         # Lambda API handlers (Jest tests)
│   │   ├── handlers/    # API endpoint handlers (banners/, reports/, kafka/)
│   │   ├── storage/     # DynamoDB client utilities
│   │   └── utils/       # Shared utilities, types, constants
│   ├── ui-src/          # React frontend (Vite, Jest tests)
│   │   └── src/
│   │       ├── components/  # React components
│   │       ├── forms/       # Form definitions (JSON schemas)
│   │       ├── utils/       # Frontend utilities
│   │       └── types/       # TypeScript types
│   ├── ui-auth/         # Cognito auth handlers
│   ├── topics/          # Kafka topic handlers
│   └── database/        # Database scripts
├── deployment/          # AWS CDK infrastructure
│   ├── stacks/          # CDK stack definitions
│   └── constructs/      # Reusable CDK constructs
├── cli/                 # CLI commands for ./run script
├── tests/               # Playwright E2E tests
│   └── playwright/      # Test files and utilities
└── .github/workflows/   # CI/CD pipelines
```

## CI/CD Checks (Must Pass)

Pull requests trigger `.github/workflows/pull-request.yml`:

1. **Pre-commit hooks** (oxfmt, oxlint, detect-secrets, gitleaks)
2. **Unit tests** with coverage for `app-api` and `ui-src`
3. **TypeScript compilation** checks (skipped in CI but run locally via pre-commit)

Pushes trigger `.github/workflows/deploy.yml`:

1. Deploys to AWS environment based on branch
2. Runs Playwright E2E tests (excludes `@flaky`, `@regression`, `@a11y` tags)

## Key Configuration Files

| File                       | Purpose                        |
| -------------------------- | ------------------------------ |
| `.nvmrc`                   | Node.js version (v22.19.0)     |
| `.oxfmtrc.json`            | Code formatter config          |
| `.oxlintrc.json`           | Linter rules                   |
| `.pre-commit-config.yaml`  | Pre-commit hooks               |
| `cdk.json`                 | CDK configuration              |
| `services/*/tsconfig.json` | TypeScript configs per service |

## Form Template System

Reports use JSON form templates in `services/app-api/forms/`. Field IDs are immutable for data consistency. When modifying forms:

- Never change existing field IDs
- Choice IDs in radio/checkbox fields must remain stable
- Form templates are versioned per report in S3

## Validation Schemas

- **Frontend**: `services/ui-src/src/utils/validation/` (Yup schemas for inline validation)
- **Backend**: `services/app-api/utils/validation/` (Yup schemas for API validation)
- Keep frontend and backend schemas in sync when modifying validation rules

## Common Pitfalls

1. **Node version mismatch**: The `./run` script enforces `.nvmrc` version. Always run `nvm use` first.
2. **Formatting failures**: Run `yarn oxfmt` before committing.
3. **Missing dependencies**: Run `./run install` after pulling changes.
4. **Test environment**: Frontend tests require `dotenv/config` setup.
5. **Branch naming**: Must follow pattern validated by `.github/branchNameValidation.ts`.

## Available CLI Commands

```bash
./run local              # Run locally with LocalStack
./run install            # Install all dependencies
./run deploy --stage X   # Deploy to AWS (requires auth)
./run deploy-prerequisites  # Deploy prerequisite stack
./run update-env         # Update .env from 1Password
./run destroy            # Destroy a CDK stage
```

## Trust These Instructions

These instructions have been validated against the codebase. Only perform additional searches if information here is incomplete or found to be incorrect during execution.

## Code Style Guidelines

See [agents/code-style.md](agents/code-style.md) for detailed coding conventions covering:

- General principles and naming conventions
- File organization and import ordering
- TypeScript patterns (interfaces, types, enums)
- React component patterns (ui-src)
- API/backend patterns (app-api)
- Testing patterns (Jest, React Testing Library)
- Validation schemas (Yup)
- State management (Zustand)
