# CNCManagementDashboard - Unified Frontend for CNC Management

## Overview

CNCManagementDashboard is a unified React/TypeScript frontend that orchestrates and provides a single interface for all CNC management tools: JSONScanner, ToolManager, and ClampingPlateManager. Features modular architecture, centralized configuration, and coordinated development workflows.

## Core Purpose

- **Unified Interface**: Single dashboard for all CNC management operations
- **Module Orchestration**: Coordinates JSONScanner, ToolManager, ClampingPlateManager backends
- **Real-time Monitoring**: Live updates from all backend services
- **Responsive Design**: Modern UI built with React, TypeScript, and Tailwind CSS

---

## Architecture

### Multi-Module Integration

```
CNCManagementDashboard (Frontend)
         ↓
    Service Layer (API Communication)
         ↓
┌────────┴────────┬────────────────┐
↓                 ↓                ↓
JSONScanner   ToolManager   ClampingPlateManager
(Backend)     (Backend)     (Backend)
```

### Key Components

- **App.tsx** - Main application orchestrator with routing, authentication, global state
- **Services** (`src/services/`) - API communication with backend modules
- **Contexts** (`src/contexts/`) - React context for cross-module state
- **Components** (`src/components/`) - UI components and feature modules
- **Config** (`config/unified.config.ts`) - Centralized module coordination

### Module Coordination

```typescript
interface ModuleConfig {
  enabled: boolean; // Enable/disable module
  port: number; // Service port
  dataPath: string; // Data directory path
  apiPath: string; // API endpoint path
}

// Example configuration
const config = {
  jsonScanner: {
    enabled: true,
    port: 3001,
    dataPath:
      "../CNC_TestData/working_data/BRK CNC Management Dashboard/jsonscanner",
    apiPath: "/api/scanner",
  },
  toolManager: {
    /* ... */
  },
  clampingPlateManager: {
    /* ... */
  },
};
```

---

## Technology Stack

### Frontend Framework

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server

### UI Components

- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix + Tailwind
- **Lucide React**: Icon system

### State Management

- **React Context**: Cross-module state coordination
- **Local Storage**: Persistent user preferences (theme, font size, etc.)

### Build & Development

- **Vite**: Development server and production builds
- **ESLint**: Code linting with TypeScript rules
- **PostCSS**: CSS processing with Tailwind

---

## Project Structure

```
CNCManagementDashboard/
├── index.html              # Entry HTML
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── README.md
├── PROJECT_OVERVIEW.md     # This file
├── ARCHITECTURE.md         # Detailed architecture docs
├── INTEGRATION_SETUP.md    # Backend integration guide
├── SETUP_GUIDE.md          # Initial setup instructions
├── src/
│   ├── main.tsx            # React app entry point
│   ├── App.tsx             # Main component with routing
│   ├── services/           # Backend API communication
│   │   ├── jsonScannerService.ts
│   │   ├── toolManagerService.ts
│   │   └── clampingPlateService.ts
│   ├── contexts/           # React context providers
│   │   ├── ModuleContext.tsx
│   │   └── ThemeContext.tsx
│   ├── components/         # UI components
│   │   ├── Dashboard/
│   │   ├── Scanner/
│   │   ├── ToolManager/
│   │   ├── PlateManager/
│   │   └── ui/             # shadcn/ui components
│   ├── styles/
│   │   └── globals.css     # Global styles and Tailwind
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   └── utils/              # Utility functions
├── config/
│   └── unified.config.ts   # Centralized module configuration
└── public/                 # Static assets
    └── demo-data/          # Demo data for development
```

---

## Module Integration

### Backend Services

Dashboard integrates with 3 backend services:

1. **JSONScanner** (Port 3001)

   - CNC project analysis
   - Business rule violations
   - Quality control reports

2. **ToolManager** (Port 3002)

   - Tool inventory tracking
   - Work order tool requirements
   - Availability reports

3. **ClampingPlateManager** (Port 3003)
   - Plate inventory management
   - Work order assignments
   - Plate lifecycle tracking

### Service Communication Pattern

```typescript
// Example: Fetch analysis data from JSONScanner
import { fetchAnalysisData } from "@/services/jsonScannerService";

const data = await fetchAnalysisData("W5270NS01001");
// Returns: { project: {...}, violations: [...], summary: {...} }
```

### Cross-Module State

```typescript
// ModuleContext provides global module state
const { modules, updateModule } = useModuleContext();

// Access module status
console.log(modules.jsonScanner.enabled); // true
console.log(modules.toolManager.status); // 'connected' | 'disconnected' | 'error'
```

---

## Development Workflows

### Starting Development Server

```bash
# Start dashboard only
npm run dev

# Start all modules + dashboard
npm run dev:all

# Start specific module + dashboard
npm run dev:with-scanner
npm run dev:with-tools
npm run dev:with-plates
```

### Module Management

```bash
# Install all module dependencies
npm run setup:all

# Setup specific module
npm run setup:json-scanner
npm run setup:tool-manager
npm run setup:clamping-plate

# Test all modules
npm run test:all
```

### Build & Deploy

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## Centralized Configuration

### unified.config.ts

All module settings in one place:

```typescript
export const unifiedConfig = {
  modules: {
    jsonScanner: {
      enabled: true,
      name: "JSONScanner",
      port: 3001,
      dataPath:
        "../CNC_TestData/working_data/BRK CNC Management Dashboard/jsonscanner",
      apiPath: "/api/scanner",
      healthCheck: "/api/health",
    },
    toolManager: {
      enabled: true,
      name: "ToolManager",
      port: 3002,
      dataPath:
        "../CNC_TestData/working_data/BRK CNC Management Dashboard/toolmanager",
      apiPath: "/api/tools",
      healthCheck: "/api/health",
    },
    clampingPlateManager: {
      enabled: true,
      name: "ClampingPlateManager",
      port: 3003,
      dataPath:
        "../CNC_TestData/working_data/BRK CNC Management Dashboard/clampingplatemanager",
      apiPath: "/api/plates",
      healthCheck: "/api/health",
    },
  },
  dashboard: {
    port: 5173, // Vite dev server default
    title: "CNC Management Dashboard",
    theme: "auto", // 'auto' | 'light' | 'dark'
    refreshInterval: 5000, // 5 seconds
  },
};
```

---

## User Interface Features

### Dashboard Views

1. **Overview Dashboard**

   - Summary cards for all modules
   - Recent activity feed
   - Quick actions
   - System health indicators

2. **Scanner Module View**

   - Project list with analysis status
   - Violation severity breakdown
   - Rule compliance overview
   - Detailed violation reports

3. **Tool Manager View**

   - Tool inventory table
   - Availability status
   - Work order tool requirements
   - Shortage alerts

4. **Plate Manager View**
   - Plate inventory grid
   - Status filtering (new/used/locked, free/in-use)
   - Work order assignments
   - Plate history timeline

### Accessibility Features

- **Theme Switching**: Auto/Light/Dark modes
- **Font Scaling**: Small/Normal/Large sizes
- **High Contrast**: Enhanced visibility mode
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML

### User Settings Persistence

Settings stored in `localStorage`:

```typescript
{
  theme: 'dark',
  fontSize: 'normal',
  highContrast: false,
  modulePreferences: {
    jsonScanner: { /* ... */ },
    toolManager: { /* ... */ },
    clampingPlateManager: { /* ... */ }
  }
}
```

---

## Data Flow Patterns

### Real-time Updates

```typescript
// Polling pattern for backend updates
useEffect(() => {
  const interval = setInterval(() => {
    fetchLatestData();
  }, config.dashboard.refreshInterval);

  return () => clearInterval(interval);
}, []);
```

### Optimistic UI Updates

```typescript
// Update UI immediately, sync with backend
const assignPlate = async (plateId, workName) => {
  // Optimistic update
  updateLocalState({ plateId, status: "in-use", workName });

  try {
    // Backend sync
    await clampingPlateService.assignPlate(plateId, workName);
  } catch (error) {
    // Rollback on error
    revertLocalState(plateId);
  }
};
```

### Error Handling

```typescript
// Centralized error handling
const handleModuleError = (moduleName, error) => {
  // Log error
  logger.error(`${moduleName} error:`, error);

  // Update module status
  updateModule(moduleName, { status: "error", error });

  // Show user notification
  toast.error(`${moduleName} is unavailable`);
};
```

---

## Integration with CNC_TestData

Dashboard reads processed data from centralized working_data:

```
CNC_TestData/working_data/BRK CNC Management Dashboard/
├── jsonscanner/
│   └── session_demo/results/
│       └── W5270NS01001_analysis.json  ← Dashboard reads
├── toolmanager/
│   └── session_demo/results/
│       └── tool_tracking_*.json        ← Dashboard reads
├── clampingplatemanager/
│   └── session_demo/results/
│       ├── plates.json                 ← Dashboard reads
│       └── work_orders.json            ← Dashboard reads
└── dashboard/
    └── session_demo/demo-data/         ← Dashboard writes demo data
```

---

## Common Development Tasks

### Adding a New Module

1. **Create service file**: `src/services/newModuleService.ts`

   ```typescript
   export const fetchModuleData = async () => {
     const response = await fetch(`${config.newModule.apiPath}/data`);
     return response.json();
   };
   ```

2. **Update config**: `config/unified.config.ts`

   ```typescript
   newModule: {
     enabled: true,
     port: 3004,
     apiPath: "/api/newmodule"
   }
   ```

3. **Create UI component**: `src/components/NewModule/`
4. **Add route**: `src/App.tsx`
5. **Update navigation**: Add menu item

### Adding a New Dashboard View

1. **Create component**: `src/components/Dashboard/NewView.tsx`
2. **Add route**: `src/App.tsx`
3. **Update navigation**: Add to sidebar/menu
4. **Fetch data**: Use service layer
5. **Handle state**: Use context or local state

### Customizing Theme

1. **Update Tailwind config**: `tailwind.config.js`
2. **Modify CSS variables**: `src/styles/globals.css`
3. **Update theme context**: `src/contexts/ThemeContext.tsx`

---

## Testing Strategies

### Component Testing

```typescript
// Example: Testing dashboard component
import { render, screen } from "@testing-library/react";
import Dashboard from "@/components/Dashboard/Dashboard";

test("renders dashboard with all modules", () => {
  render(<Dashboard />);
  expect(screen.getByText("JSONScanner")).toBeInTheDocument();
  expect(screen.getByText("ToolManager")).toBeInTheDocument();
  expect(screen.getByText("ClampingPlateManager")).toBeInTheDocument();
});
```

### Integration Testing

```typescript
// Example: Testing module communication
test("fetches and displays scanner data", async () => {
  render(<ScannerView />);

  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText("W5270NS01001")).toBeInTheDocument();
  });
});
```

### E2E Testing (Planned)

Future enhancement: Cypress or Playwright for end-to-end testing.

---

## Troubleshooting

### Issue: "Module not connecting"

**Solution**:

1. Verify backend service is running
2. Check port in `unified.config.ts`
3. Check CORS settings in backend
4. Use browser DevTools Network tab

### Issue: "Data not updating"

**Solution**:

1. Check refresh interval in config
2. Verify backend is generating new data
3. Check service layer fetch calls
4. Clear browser cache

### Issue: "Build errors"

**Solution**:

1. Run `npm run type-check` to find TypeScript errors
2. Run `npm run lint` to find linting issues
3. Check for missing imports
4. Verify all dependencies installed

### Issue: "Styling not applied"

**Solution**:

1. Check Tailwind class names
2. Verify `globals.css` is imported in `main.tsx`
3. Check PostCSS configuration
4. Clear Vite cache: `rm -rf node_modules/.vite`

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy load module components
const ScannerView = lazy(() => import("@/components/Scanner/ScannerView"));
const ToolManagerView = lazy(
  () => import("@/components/ToolManager/ToolManagerView")
);
```

### Memoization

```typescript
// Memoize expensive computations
const violationSummary = useMemo(() => {
  return calculateViolations(analysisData);
}, [analysisData]);
```

### Virtual Scrolling (Planned)

For large data sets (tool inventory, plate lists), implement virtual scrolling with `react-virtual`.

---

## Deployment

### Production Build

```bash
# Build optimized production bundle
npm run build

# Output in dist/ folder
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
```

### Environment Variables

```bash
# .env.production
VITE_API_BASE_URL=https://production-api.example.com
VITE_SCANNER_PORT=3001
VITE_TOOLS_PORT=3002
VITE_PLATES_PORT=3003
```

### Hosting Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Docker**: Container with nginx serving static files
- **Cloud**: AWS S3 + CloudFront, Azure Static Web Apps

---

## Future Enhancements

### Planned Features

- [ ] WebSocket integration for real-time updates
- [ ] Advanced filtering and search across all modules
- [ ] Export functionality (PDF, Excel reports)
- [ ] User roles and permissions
- [ ] Mobile responsive improvements
- [ ] Offline mode with service workers

### Technical Improvements

- [ ] Comprehensive test coverage (unit, integration, E2E)
- [ ] Performance monitoring and analytics
- [ ] Error boundary improvements
- [ ] State management library (Zustand/Redux if needed)
- [ ] GraphQL API option

---

## Related Documentation

- **Architecture**: `ARCHITECTURE.md`
- **Integration Setup**: `INTEGRATION_SETUP.md`
- **Setup Guide**: `SETUP_GUIDE.md`
- **AI Assistant Context**: `.github/copilot-instructions.md`
- **Ecosystem Context**: `../CNC_TestData/AI_AGENT_CONTEXT.md`

---

## Support

For issues or questions:

1. Check troubleshooting section above
2. Review `ARCHITECTURE.md` for design decisions
3. Check browser DevTools console
4. Refer to ecosystem context in `../CNC_TestData/AI_AGENT_CONTEXT.md`

---

**Last Updated**: 2025-01-XX  
**Version**: 1.0.0  
**Maintainer**: szborok
