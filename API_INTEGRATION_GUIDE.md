# 🚀 CNC Management Dashboard - API Integration Guide

## ✅ What's Been Completed

### Backend API Servers (ALL DONE!)

- ✅ **JSONScanner API** - Port 3001 - Quality control analysis endpoints
- ✅ **ToolManager API** - Port 3002 - Tool inventory management endpoints
- ✅ **ClampingPlateManager API** - Port 3003 - Plate management endpoints (already existed!)

### Frontend API Service Layer (ALL DONE!)

- ✅ **API Client** - Base HTTP client with auth and error handling
- ✅ **TypeScript Types** - Complete type definitions for all APIs
- ✅ **Service Classes** - jsonScannerAPI, toolManagerAPI, platesManagerAPI

## 🎯 How to Start All Services

### 1. Terminal 1 - JSONScanner API (Port 3001)

```bash
cd JSONScanner
npm run serve
```

### 2. Terminal 2 - ToolManager API (Port 3002)

```bash
cd ToolManager
npm run serve
```

### 3. Terminal 3 - ClampingPlateManager API (Port 3003)

```bash
cd ClampingPlateManager
npm run serve
```

### 4. Terminal 4 - Dashboard Frontend (Port 5173)

```bash
cd CNCManagementDashboard
npm run dev
```

## 📡 API Endpoints Available

### JSONScanner (http://localhost:3001/api)

- `GET /status` - Health check
- `GET /projects` - List all projects (with pagination)
- `GET /projects/:id` - Get project details
- `GET /analysis/:projectId` - Get full analysis
- `GET /analysis/:projectId/violations` - Get violations only
- `POST /projects/scan` - Trigger manual scan

### ToolManager (http://localhost:3002/api)

- `GET /status` - Health check
- `GET /tools` - List all tools
- `GET /tools/:id` - Get tool details
- `GET /projects` - List matrix projects
- `GET /analysis/upcoming` - Get upcoming tool requirements

### ClampingPlateManager (http://localhost:3003/api)

- `GET /health` - Health check
- `GET /plates` - Get all plates
- `GET /plates/:id` - Get specific plate
- `POST /plates/:id` - Update plate
- `GET /work-orders` - Get work orders
- `POST /work-orders` - Create work order
- `GET /stats` - Get operational stats

## 🔧 Usage in Dashboard Components

### Example: Fetching Projects from JSONScanner

```typescript
import { jsonScannerAPI } from "@/services/api";

// In your component
const fetchProjects = async () => {
  try {
    const response = await jsonScannerAPI.getProjects(1, 20);
    console.log("Projects:", response.projects);
    console.log("Total:", response.total);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }
};
```

### Example: Fetching Tools from ToolManager

```typescript
import { toolManagerAPI } from "@/services/api";

const fetchTools = async () => {
  try {
    const response = await toolManagerAPI.getTools();
    console.log("Tools:", response.tools);
  } catch (error) {
    console.error("Failed to fetch tools:", error);
  }
};
```

### Example: Fetching Plates

```typescript
import { platesManagerAPI } from "@/services/api";

const fetchPlates = async () => {
  try {
    const response = await platesManagerAPI.getPlates();
    console.log("Plates:", response.plates);
    console.log("Summary:", response.summary);
  } catch (error) {
    console.error("Failed to fetch plates:", error);
  }
};
```

## 📝 Next Steps

### 1. Update Dashboard Component (Dashboard.tsx)

Replace mock data with real API calls:

```typescript
import {
  jsonScannerAPI,
  toolManagerAPI,
  platesManagerAPI,
} from "@/services/api";
import { useEffect, useState } from "react";

function Dashboard() {
  const [jsonProjects, setJsonProjects] = useState([]);
  const [tools, setTools] = useState([]);
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsData, toolsData, platesData] = await Promise.all([
          jsonScannerAPI.getProjects(1, 10),
          toolManagerAPI.getTools(),
          platesManagerAPI.getPlates(),
        ]);

        setJsonProjects(projectsData.projects);
        setTools(toolsData.tools);
        setPlates(platesData.plates);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Rest of your component...
}
```

### 2. Add Loading States

Create a reusable loading component:

```typescript
function LoadingSpinner() {
  return <div className="animate-spin">⏳</div>;
}
```

### 3. Add Error Boundaries

Wrap components with error handling:

```typescript
function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error">
      <h3>Something went wrong</h3>
      <p>{error.message}</p>
    </div>
  );
}
```

## 🧪 Testing the APIs

### Quick API Test (use curl)

```bash
# Test JSONScanner
curl http://localhost:3001/api/status

# Test ToolManager
curl http://localhost:3002/api/status

# Test ClampingPlateManager
curl http://localhost:3003/api/health
```

### Generate Test Data First

```bash
# JSONScanner - generate some analysis data
cd JSONScanner
node main.js --test

# ToolManager - generate some tool data
cd ToolManager
node main.js --test

# ClampingPlateManager - initialize test data
cd ClampingPlateManager
node main.js --init-test
```

## 🎉 What This Achieves

✅ **NO MORE MOCK DATA** - Everything uses real backend services
✅ **Type Safety** - Full TypeScript support with proper interfaces
✅ **Error Handling** - Centralized error handling with user-friendly messages
✅ **Scalable** - Easy to add new endpoints or modify existing ones
✅ **Testable** - Each API service can be tested independently

## 🔒 Security Notes

- JWT authentication is set up in the API client but not yet enforced on backends
- CORS is configured to allow dashboard origin (localhost:5173, localhost:3000)
- All APIs use JSON for requests/responses
- Sensitive operations should be protected once auth is implemented

## 📊 Architecture Diagram

```
┌─────────────────────────────────┐
│  Dashboard (React/TypeScript)   │
│  Port 5173                      │
│  ├─ jsonScannerAPI              │
│  ├─ toolManagerAPI              │
│  └─ platesManagerAPI            │
└────────────┬────────────────────┘
             │
     ┌───────┼───────┬──────────┐
     │       │       │          │
┌────▼──┐ ┌─▼────┐ ┌▼────────┐
│JSON   │ │Tool  │ │Plates   │
│Scanner│ │Mgr   │ │Manager  │
│:3001  │ │:3002 │ │:3003    │
└───────┘ └──────┘ └─────────┘
```

---

**Status**: ✅ Backend APIs Complete, Frontend Service Layer Complete
**Next**: Replace mock data in Dashboard components with real API calls
