# Backend API Architecture

## Overview

Unified API structure for CNCManagementDashboard to communicate with all three backend modules:

- **JSONScanner** (Port 3001) - CNC quality control analysis
- **ToolManager** (Port 3002) - Tool inventory and matrix processing
- **ClampingPlateManager** (Port 3003) - Clamping plate management

## Architecture Pattern

### Communication Model

```
┌─────────────────────────────────┐
│  CNCManagementDashboard (5173)  │
│  React/TypeScript Frontend      │
└────────────┬────────────────────┘
             │
             ├──────────────────────────────────┐
             │                                  │
┌────────────▼───────────┐  ┌─────────────────▼──────────┐
│  JSONScanner (3001)    │  │  ToolManager (3002)        │
│  Node.js REST API      │  │  Node.js REST API          │
└────────────────────────┘  └────────────────────────────┘
             │
┌────────────▼──────────────┐
│ ClampingPlateManager      │
│ (3003) Node.js REST API   │
└───────────────────────────┘
```

### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **API Communication**: Fetch API / Axios
- **Backend**: Node.js + Express
- **Data Format**: JSON
- **Authentication**: JWT tokens (shared across all services)

## API Endpoints Structure

### 1. JSONScanner API (Port 3001)

#### Base URL: `http://localhost:3001/api`

##### Projects

- `GET /projects` - List all processed projects

  ```json
  {
    "projects": [
      {
        "id": "W5270NS01001A",
        "name": "W5270NS01001A",
        "status": "passed|failed|warning",
        "operationCount": 21,
        "ncFileCount": 9,
        "timestamp": "2025-11-11T16:43:57.000Z",
        "violations": []
      }
    ],
    "total": 9,
    "page": 1,
    "pageSize": 20
  }
  ```

- `GET /projects/:id` - Get project details
- `POST /projects/scan` - Trigger manual scan
- `DELETE /projects/:id` - Remove project

##### Analysis

- `GET /analysis/:projectId` - Get full analysis results
- `GET /analysis/:projectId/violations` - Get violations only
- `GET /analysis/:projectId/rules` - Get applied rules

##### Status

- `GET /status` - Service health check
  ```json
  {
    "status": "running|idle|error",
    "mode": "auto|manual",
    "lastScan": "2025-11-11T16:43:57.000Z",
    "projectsProcessed": 9,
    "autoScanEnabled": true,
    "scanInterval": 60000
  }
  ```

##### Configuration

- `GET /config` - Get current configuration
- `PUT /config` - Update configuration
- `POST /config/reload` - Reload from config.js

### 2. ToolManager API (Port 3002)

#### Base URL: `http://localhost:3002/api`

##### Tools

- `GET /tools` - List all tools in inventory

  ```json
  {
    "tools": [
      {
        "id": "8400xxx",
        "category": "ECUT",
        "name": "Tool Name",
        "description": "Tool description",
        "quantity": 5,
        "available": 3,
        "inUse": 2,
        "location": "Shelf A-01"
      }
    ],
    "total": 45,
    "categories": ["ECUT", "MFC", "XF", "XFEED"]
  }
  ```

- `GET /tools/:id` - Get tool details
- `PUT /tools/:id` - Update tool information
- `GET /tools/category/:category` - Filter by category

##### Projects

- `GET /projects` - List matrix processing projects
- `GET /projects/:id` - Get project tool requirements
- `POST /projects/analyze` - Analyze Excel matrix file
- `GET /projects/:id/tools` - Get tools used in project

##### Analysis

- `GET /analysis/upcoming` - Get upcoming tool requirements
- `GET /analysis/shortages` - Get tool shortage warnings
- `GET /analysis/usage` - Get tool usage statistics

##### Status

- `GET /status` - Service health check
  ```json
  {
    "status": "running",
    "mode": "auto|manual",
    "lastScan": "2025-11-11T16:44:03.000Z",
    "toolsTracked": 45,
    "projectsActive": 8
  }
  ```

### 3. ClampingPlateManager API (Port 3003)

#### Base URL: `http://localhost:3003/api`

##### Plates

- `GET /plates` - List all clamping plates

  ```json
  {
    "plates": [
      {
        "id": "plate_001",
        "shelf": "A-01",
        "health": "new|used|locked",
        "occupancy": "free|in-use",
        "lastWorkName": "W5270NS01001A",
        "lastModifiedBy": "user_001",
        "lastModifiedDate": "2025-11-11T12:00:00.000Z",
        "modelPath": "/models/1_alap/model.jpg",
        "historyCount": 5
      }
    ],
    "total": 156,
    "summary": {
      "new": 12,
      "inUse": 8,
      "locked": 5
    }
  }
  ```

- `GET /plates/:id` - Get plate details with full history
- `PUT /plates/:id` - Update plate status
- `POST /plates/:id/work/start` - Start work order
- `POST /plates/:id/work/finish` - Finish work order
- `POST /plates/:id/work/stop` - Stop/pause work order

##### Work Orders

- `GET /work` - List all active work orders
- `GET /work/:id` - Get work order details
- `GET /work/user/:userId` - Get user's active work
- `POST /work` - Create new work order
- `PUT /work/:id` - Update work order

##### History

- `GET /history` - Get activity history
- `GET /history/plate/:plateId` - Get plate history
- `GET /history/user/:userId` - Get user activity

##### Status

- `GET /status` - Service health check
  ```json
  {
    "status": "running",
    "platesTotal": 156,
    "platesInUse": 8,
    "activeWorkOrders": 8,
    "lastUpdate": "2025-11-11T12:00:00.000Z"
  }
  ```

## Frontend Service Layer

### Structure

```
src/services/
├── api/
│   ├── client.ts          # Base API client with auth
│   ├── jsonScanner.ts     # JSONScanner API calls
│   ├── toolManager.ts     # ToolManager API calls
│   └── platesManager.ts   # ClampingPlateManager API calls
├── types/
│   ├── jsonScanner.ts     # TypeScript interfaces
│   ├── toolManager.ts     # TypeScript interfaces
│   └── platesManager.ts   # TypeScript interfaces
└── index.ts               # Unified export
```

### Example Client Implementation

```typescript
// src/services/api/client.ts
import axios, { AxiosInstance } from "axios";

class APIClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add auth interceptor
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error.message);
        throw error;
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export default APIClient;
```

```typescript
// src/services/api/jsonScanner.ts
import APIClient from "./client";
import type { Project, ProjectDetails, ScanResult } from "../types/jsonScanner";

const API_BASE = "http://localhost:3001/api";

class JSONScannerAPI {
  private client: APIClient;

  constructor() {
    this.client = new APIClient(API_BASE);
  }

  async getProjects(
    page = 1,
    pageSize = 20
  ): Promise<{ projects: Project[]; total: number }> {
    return this.client.get("/projects", { page, pageSize });
  }

  async getProjectDetails(id: string): Promise<ProjectDetails> {
    return this.client.get(`/projects/${id}`);
  }

  async triggerScan(): Promise<ScanResult> {
    return this.client.post("/projects/scan");
  }

  async getStatus() {
    return this.client.get("/status");
  }
}

export default new JSONScannerAPI();
```

## Authentication & Authorization

### Shared JWT Strategy

- Single sign-on across all services
- Token generated by dashboard, validated by backend services
- Token payload:
  ```json
  {
    "userId": "user_001",
    "username": "operator",
    "role": "admin|user",
    "iat": 1699776000,
    "exp": 1699862400
  }
  ```

### Implementation

```typescript
// src/services/auth.ts
export class AuthService {
  private token: string | null = null;

  async login(username: string, password: string): Promise<void> {
    // Authenticate and get token
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const { token } = await response.json();
    this.setToken(token);
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem("authToken", token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem("authToken");
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem("authToken");
  }
}
```

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project with ID 'xyz' not found",
    "details": {},
    "timestamp": "2025-11-11T16:43:57.000Z"
  }
}
```

### Error Codes

- `AUTHENTICATION_FAILED` - Invalid credentials
- `UNAUTHORIZED` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `SERVICE_UNAVAILABLE` - Backend service down
- `INTERNAL_ERROR` - Server error

## Real-Time Updates (Optional Future Enhancement)

### WebSocket Integration

- Use Socket.IO for real-time updates
- Emit events when:
  - New projects are scanned
  - Analysis completes
  - Tool shortages detected
  - Plate status changes

```typescript
// Example WebSocket client
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

socket.on("project:analyzed", (project) => {
  console.log("New project analyzed:", project);
  // Update UI
});

socket.on("tool:shortage", (alert) => {
  console.log("Tool shortage alert:", alert);
  // Show notification
});
```

## Development & Testing

### Running All Services

```bash
# Terminal 1 - Dashboard
cd CNCManagementDashboard
npm run dev

# Terminal 2 - JSONScanner
cd JSONScanner
node main.js --serve

# Terminal 3 - ToolManager
cd ToolManager
node main.js --serve

# Terminal 4 - ClampingPlateManager
cd ClampingPlateManager
node main.js --serve
```

### Testing with Test Data

```bash
# All services should use --test flag to enable test mode
node main.js --test  # JSONScanner and ToolManager
node main.js --init-test  # ClampingPlateManager
```

## Next Implementation Steps

1. **Add Express servers to backend modules**

   - Create `/server` folder in each module
   - Implement REST endpoints
   - Add CORS configuration

2. **Create service layer in dashboard**

   - Implement API clients
   - Create TypeScript interfaces
   - Add error handling

3. **Update dashboard components**

   - Replace mock data with API calls
   - Add loading states
   - Implement error boundaries

4. **Add authentication**

   - Implement JWT token generation
   - Add auth middleware to backends
   - Create login flow in dashboard

5. **Testing & Integration**
   - Write API integration tests
   - Test cross-service communication
   - Validate data consistency

## Configuration

### Environment Variables (.env)

```bash
# Dashboard
VITE_API_JSON_SCANNER=http://localhost:3001/api
VITE_API_TOOL_MANAGER=http://localhost:3002/api
VITE_API_PLATES_MANAGER=http://localhost:3003/api
VITE_JWT_SECRET=your-secret-key-here

# Backends (shared)
JWT_SECRET=your-secret-key-here
NODE_ENV=development
LOG_LEVEL=info
```

### CORS Configuration

All backend services should allow dashboard origin:

```javascript
const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
```

## Security Considerations

1. **Never expose sensitive config** in API responses
2. **Validate all inputs** on backend
3. **Use HTTPS in production**
4. **Implement rate limiting** to prevent abuse
5. **Sanitize file paths** to prevent directory traversal
6. **Use environment variables** for secrets
7. **Implement proper CORS** policies
8. **Add request timeouts** to prevent hanging

---

**Status**: Architecture Planned - Ready for Implementation
**Next Phase**: Backend Express server implementation
**Priority**: High - Required for dashboard functionality
