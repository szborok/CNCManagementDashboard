# CNCManagementDashboard AI Assistant Instructions

## Project Overview

CNCManagementDashboard is a unified TypeScript/React frontend with **hybrid data mode** (Demo + API) that provides a single interface for all CNC management tools: JSONScanner, ToolManager, and ClampingPlateManager. Features production-ready REST API integration with zero mock data.

## CRITICAL: Zero Mock Data Policy

**User Directive**: "the main thing for me is to have 0 mock data, if we test then use test data"

**Implementation**:
- ✅ Demo mode uses real CNC_TestData files from actual test runs
- ✅ API mode uses live backend REST APIs reading real processing results  
- ✅ No hardcoded fake data anywhere
- ✅ No "C:/Demo" paths - all data from real CNC workflows

## Architecture & Module Coordination

### Hybrid Data Mode (Nov 11, 2025)

**Dashboard Toggle** (Top-right corner):
- **Demo Mode**: Real test data from `/public/demo-data/*.json` files
  - Data comes from actual JSONScanner/ToolManager/ClampingPlateManager runs
  - Offline capable, fast, no server dependencies
  - User can refresh browser to reload
  
- **API Mode**: Live REST APIs from backend services
  - Real-time data from Express servers (ports 3001/3002/3003)
  - Auto-refresh every 60s in AUTO mode
  - Shows 🟢/🔴 status indicators for each backend
  - Persists user preference to localStorage

### Unified Structure

- **Main Dashboard**: React/TypeScript frontend with Vite build system (port 5173)
- **Backend APIs**: Three Express servers in AUTO mode
  - JSONScanner (3001) - Quality control analysis
  - ToolManager (3002) - Tool inventory tracking
  - ClampingPlateManager (3003) - Plate management
- **API Service Layer**: `src/services/api/` - TypeScript clients for all backends
- **Type System**: `src/services/types/` - Complete type definitions

## Critical Configuration

**Backend Configs (Production Ready)**:
- All `testMode: false` - Use production paths
- All `autoMode/autorun: true` - Continuous operation
- Test mode only with `--test` flag

**Port Assignments**:
- JSONScanner: 3001
- ToolManager: 3002
- ClampingPlateManager: 3003 (fixed from 3002)
- Dashboard: 5173

**Data Paths**:
- Demo data: `/public/demo-data/*.json` (real test data)
- API data: Backend temp/results structures
- CNC_TestData: Shared test data location

## Development Workflows

### Starting the Complete System

```bash
# Start all backend services (AUTO mode)
cd JSONScanner && npm run serve &
cd ToolManager && npm run serve &
cd ClampingPlateManager && npm run serve &

# Start dashboard
cd CNCManagementDashboard && npm run dev

# Open http://localhost:5173
```

### Working with Demo Data

**Demo data comes from real test runs**:
```bash
# Refresh demo data with latest real data
cp CNC_TestData/.../jsonscanner/results/*.json public/demo-data/jsonscanner-results.json
cp CNC_TestData/.../toolmanager/results/ToolManager_Result.json public/demo-data/toolmanager-results.json  
cp ClampingPlateManager/data/plates.json public/demo-data/clampingplate-results.json
```

### API Integration Pattern

**Dashboard Component** (`src/components/Dashboard.tsx`):
```typescript
// Check API mode state
if (useAPIMode) {
  // Load from live APIs
  const [projects, tools, plates] = await Promise.all([
    jsonScannerAPI.getProjects(),
    toolManagerAPI.getTools(),
    platesManagerAPI.getPlates()
  ]);
} else {
  // Load from demo files
  const data = await DashboardDataService.loadDashboardData();
}
```

## Data Integration Patterns

### API Service Layer (`src/services/api/`)

**JSON Scanner API** (`jsonScanner.ts`):
- `getProjects()` - All analyzed projects
- `getProjectDetails(id)` - Specific project
- `getAnalysis(id)` - Rule violations
- `getStatus()` - Server health

**Tool Manager API** (`toolManager.ts`):
- `getTools(filters?)` - All tools with optional filtering
- `getToolDetails(id)` - Specific tool
- `getProjects()` - Tool usage by project
- `getUpcomingRequirements()` - Upcoming needs

**Plates Manager API** (`platesManager.ts`):
- `getPlates()` - All clamping plates
- `getPlateDetails(id)` - Specific plate
- `updatePlate(id, data)` - Update status
- `getWorkOrders()` - Work order tracking

### Type System

All API responses fully typed in `src/services/types/`:
- `jsonScanner.ts` - Project, Analysis, Violation interfaces
- `toolManager.ts` - Tool, ToolListResponse interfaces
- `platesManager.ts` - Plate, WorkOrder interfaces
- `common.ts` - Shared StatusResponse type

## Technology Stack

**Frontend**: React 18 + TypeScript + Vite
**UI Components**: Radix UI with Tailwind CSS
**Build System**: Vite with TypeScript configuration
**State**: React hooks with localStorage persistence
**HTTP Client**: Axios 1.13.1
**Linting**: ESLint with TypeScript rules

## Key File Organization

- **Entry Point**: `src/main.tsx` (React 18 app initialization)
- **App Logic**: `src/App.tsx` (routing and global state)
- **Dashboard**: `src/components/Dashboard.tsx` (hybrid mode toggle, main view)
- **API Services**: `src/services/api/*.ts` (backend communication)
- **Types**: `src/services/types/*.ts` (TypeScript definitions)
- **Demo Data**: `public/demo-data/*.json` (real test data)
- **Utils**: `src/utils/` (shared utilities and helpers)

## Common Development Tasks

1. **Adding New API Endpoint**:
   - Update backend server endpoint
   - Add method to `src/services/api/{module}.ts`
   - Add types to `src/services/types/{module}.ts`
   - Use in Dashboard or other components

2. **Refreshing Demo Data**:
   - Run backend in test mode to generate fresh data
   - Copy results to `public/demo-data/`
   - Refresh browser in demo mode

3. **Testing API Integration**:
   - Start all backend servers (`npm run serve`)
   - Start dashboard (`npm run dev`)
   - Toggle to API mode
   - Check 🟢/🔴 status indicators

4. **Debugging Data Issues**:
   - Demo mode: Check `/public/demo-data/*.json` files
   - API mode: Curl backend endpoints directly
   - Check browser console for API errors
   - Verify backends are running (`lsof -i :3001,3002,3003`)

## Debugging Module Coordination

1. **"Dashboard shows no data"**:
   - Demo mode: Check demo data files exist and contain real data
   - API mode: Verify all backends respond to curl
   - Check browser console for errors

2. **"API mode shows red dots"**:
   - Check backends are running: `lsof -i :3001,3002,3003`
   - Curl endpoints: `curl http://localhost:3001/api/status`
   - Check backend logs in `/tmp/*.log`

3. **"Mock data appearing"**:
   - **THIS SHOULD NEVER HAPPEN** - Zero mock data policy
   - Demo files might be outdated - refresh from real test runs
   - Check backend DataManagers are reading from real sources

4. **"C:/Demo paths showing"**:
   - Demo data needs refresh - copy latest real data
   - Verify demo files contain actual CNC_TestData paths

## CRITICAL Rules for AI Agents

1. **NEVER create mock/fake data** - Always use real test data or real API responses
2. **Demo data = Real data** - Demo files are copies of actual test run results
3. **Configs are production-ready** - `testMode: false`, `autoMode: true`
4. **Port 3003 for ClampingPlateManager** - Already fixed, don't revert to 3002
5. **Preserve toggle functionality** - Dashboard hybrid mode is core feature
6. **Type safety** - All API calls must use proper TypeScript interfaces

## Module Integration Best Practices

1. **Backend Changes**: Update DataManager → API endpoint → Dashboard types → UI
2. **Frontend Changes**: Component → API service → Type definitions → Backend (if needed)
3. **Data Structure Changes**: Update all three layers: Backend, Types, Frontend
4. **Testing**: Always test both Demo and API modes after changes

---

**Last Updated**: November 11, 2025
**Status**: Production Ready - Zero Mock Data Achieved
**Architecture**: Hybrid Mode (Demo + API) with Toggle

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