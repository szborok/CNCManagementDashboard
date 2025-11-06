# CNCManagementDashboard AI Assistant Instructions

## Project Overview

CNCManagementDashboard is a unified TypeScript/React frontend that orchestrates and provides a single interface for all CNC management tools: JSONScanner, ToolManager, and ClampingPlateManager. It features modular architecture, centralized configuration, and coordinated development workflows.

## Architecture & Module Coordination

### Unified Structure
- **Main Dashboard**: React/TypeScript frontend with Vite build system
- **Module Integration**: Coordinates JSONScanner (Node.js), ToolManager (Node.js), ClampingPlateManager (React)
- **Centralized Config**: `config/unified.config.ts` manages all module settings and coordination
- **Cross-Module Data**: Shared data types and communication patterns between modules

### Module Management Pattern
```typescript
interface ModuleConfig {
  enabled: boolean;
  port: number;
  dataPath: string;
  apiPath: string;
}
```

Each module (jsonScanner, toolManager, clampingPlateManager) has standardized configuration interface.

## Critical Configuration

**Unified Config**: `config/unified.config.ts` contains:
- Module enable/disable flags
- Port assignments for each service
- Data path coordination
- API endpoint routing

**Environment Modes**: Development/production/test environments with proper module coordination

**Module Scripts**: Package.json contains orchestrated scripts for all modules:
- `npm run setup:all` - Install and configure all modules
- `npm run dev:all` - Start all modules in development
- `npm run test:all` - Run tests across all modules

## Development Workflows

### Multi-Module Development
**Concurrent Development**: Uses `concurrently` to run all modules simultaneously
```bash
npm run dev:all  # Starts main dashboard + all modules
npm run dev:modules  # Modules only
```

**Individual Module Commands**:
- `npm run dev:json-scanner` - JSONScanner development mode
- `npm run dev:tool-manager` - ToolManager development mode  
- `npm run dev:clamping-plate` - ClampingPlateManager development mode

### Setup and Installation
**Complete Setup**: `npm run setup:all` handles dependency installation for main dashboard and all modules
**Module-Specific**: `npm run setup:json-scanner`, `setup:tool-manager`, `setup:clamping-plate`

## Data Integration Patterns

### Cross-Module Communication
- **JSONScanner**: Provides CNC project analysis data
- **ToolManager**: Supplies tool inventory and tracking data
- **ClampingPlateManager**: Manages plate inventory and work orders
- **Dashboard**: Aggregates and presents unified view

### Shared Data Types
Template files in `data/template_files/` define standardized data structures across modules:
- `TEMPLATE_clamping_plates.json`
- `TEMPLATE_employees.json`

### Test Data Coordination
`data/test_data/` contains organized test data for each module:
- `forClampingPlateManager/`
- `forCNCManagementDashboard/`
- `forJSONScanner/`

## Technology Stack

**Frontend**: React 18 + TypeScript + Vite
**UI Components**: Radix UI with Tailwind CSS (consistent with ClampingPlateManager)
**Build System**: Vite with TypeScript configuration
**Module Coordination**: npm scripts with concurrently for parallel execution
**Linting**: ESLint with TypeScript rules and warning limits

## Key File Organization

- **Entry Point**: `src/main.tsx` (React 18 app initialization)
- **App Logic**: `src/App.tsx` (main dashboard with module integration)
- **Config**: `config/unified.config.ts` (centralized module configuration)
- **Services**: `src/services/` (API communication with modules)
- **Contexts**: `src/contexts/` (React context for cross-module state)
- **Utils**: `src/utils/` (shared utilities and helpers)

## Module Integration Patterns

### Service Communication
Each module exposes standardized API endpoints that the dashboard consumes through service abstractions.

### State Management
Uses React Context for cross-module state coordination while maintaining module independence.

### Error Handling
Centralized error handling for module communication failures with fallback strategies.

## Common Development Tasks

1. **Adding New Module**: Update `unified.config.ts`, add npm scripts, create service abstraction
2. **Cross-Module Features**: Use service layer to coordinate data between modules
3. **Testing Integration**: Use `npm run test:all` to verify module coordination
4. **Deployment**: `npm run build` creates production bundle with all module assets
5. **Clean Operations**: `npm run clean` removes all node_modules across main and modules

## Debugging Module Coordination

1. **Port Conflicts**: Check `unified.config.ts` for module port assignments
2. **Module Startup Issues**: Use individual module dev commands to isolate problems
3. **Data Flow Problems**: Verify service layer API calls and module endpoint availability
4. **Build Issues**: Run `npm run type-check` and `npm run lint` before building