# Integration Requirements Analysis

## 🎯 Overview

This document outlines the integration requirements for connecting the CNC Management Dashboard with the three sub-projects: `json_scanner`, `ToolManager`, and `ClampingPlateManager`.

## 🔄 Auto-Scan Workflow

**Primary Workflow Sequence:**

1. **json_scanner** → processes JSON files from CNC machines → generates analysis results
2. **ToolManager** → reads json_scanner results → processes tool matrix data → generates tool reports

**ClampingPlateManager** operates independently as a standalone plate management system.

## 📊 Data Flow Architecture

### **1. json_scanner → Dashboard**

```
JSON Files (CNC Machines) → json_scanner Analysis → Dashboard Display
```

**Output Data:**

- **File:** `/data/scan_results.json`
- **File:** `/data/projects.json`
- **File:** `/data/rule_executions.json`

**Integration Points:**

- Dashboard reads scan results to display:
  - Project analysis status
  - Rule violations and warnings
  - Processing statistics
  - Timeline of scanned projects

### **2. ToolManager → Dashboard**

```
Excel Matrix Files + json_scanner results → ToolManager Analysis → Dashboard Display
```

**Output Data:**

- **File:** `/data/tools.json`
- **File:** `/data/tool_locations.json`
- **Directory:** `/working_data/analysis/` (tool reports)

**Integration Points:**

- Dashboard reads tool data to display:
  - Tool inventory status
  - Tool usage analytics
  - Matrix processing results
  - Work tracking information

### **3. ClampingPlateManager → Dashboard**

```
Plate Model Files → ClampingPlateManager → Dashboard Summary
```

**Integration Points:**

- Dashboard displays plate management summary:
  - Total plates count
  - Health status distribution (new/used/locked)
  - Occupancy status (free/in-use)
  - Recent activity

## 🛠 Technical Integration Strategy

### **Communication Method: File-Based Integration**

- **Primary:** JSON file exchange through shared data directories
- **Secondary:** Direct database integration (MongoDB) for real-time data
- **Fallback:** REST API endpoints for complex operations

### **Configuration Mapping**

#### **Dashboard Setup Wizard → Sub-project Configs**

| Dashboard Config                           | json_scanner           | ToolManager                 | ClampingPlateManager  |
| ------------------------------------------ | ---------------------- | --------------------------- | --------------------- |
| `modules.jsonAnalyzer.dataPath`            | `config.getScanPath()` | `config.getJsonScanPath()`  | N/A                   |
| `modules.jsonAnalyzer.mode`                | `config.app.autorun`   | Triggers ToolManager        | N/A                   |
| `modules.matrixTools.paths.excelInputPath` | N/A                    | `config.getExcelScanPath()` | N/A                   |
| `modules.matrixTools.paths.jsonInputPath`  | N/A                    | `config.getJsonScanPath()`  | N/A                   |
| `modules.platesManager.dataPath`           | N/A                    | N/A                         | Plate model directory |

## 📁 Directory Structure Integration

### **Shared Data Flow**

```
Setup Wizard Configured Paths:
├── JSON_DATA_PATH/                    # User-selected in wizard
│   ├── *.json                        # CNC machine files
│   └── processed/                    # json_scanner outputs
│
├── EXCEL_MATRIX_PATH/                # User-selected in wizard
│   ├── *.xlsx                       # Tool matrix files
│   └── processed/                   # ToolManager outputs
│
├── PLATE_MODELS_PATH/               # User-selected in wizard
│   ├── *.xt                        # CAD files
│   ├── *.step                      # 3D models
│   └── *.dwg                       # Technical drawings
│
└── DASHBOARD_DATA/                   # Dashboard working directory
    ├── json_scanner_results/
    ├── tool_manager_results/
    ├── plate_manager_results/
    └── consolidated_reports/
```

## 🔧 Implementation Requirements

### **Phase 1: Data Readers (Current Priority)**

1. **JSON Scanner Data Reader**

   - Read `/data/scan_results.json`
   - Parse rule execution results
   - Display project analysis status

2. **Tool Manager Data Reader**

   - Read `/data/tools.json`
   - Read `/data/tool_locations.json`
   - Parse tool analytics

3. **Plate Manager Integration**
   - Connect to ClampingPlateManager React app
   - Embed or link plate management interface
   - Display summary statistics

### **Phase 2: Process Integration**

1. **Auto-Scan Trigger Chain**

   - Dashboard triggers json_scanner
   - json_scanner completion triggers ToolManager
   - Status monitoring and error handling

2. **Real-time Status Updates**
   - File system watchers for result files
   - Progress indicators during processing
   - Error state management

### **Phase 3: Advanced Features**

1. **Unified Configuration Management**

   - Single config file for all modules
   - Dashboard-controlled settings
   - Environment-specific configurations

2. **Reporting and Analytics**
   - Consolidated reports across all modules
   - Historical trend analysis
   - Export capabilities

## 🚫 Mock Data Elimination

### **Current State:**

- Dashboard shows template/mock data
- `test_data` folders exist in all projects but are unused unless selected in wizard

### **Target State:**

- Dashboard displays only real data from configured paths
- Empty state when no data is available
- `test_data` folders remain for development but are not used by default

### **Implementation:**

- Remove all mock data displays from dashboard components
- Implement empty states with helpful messages
- Only populate dashboard when real data is available from the three sub-projects

## 📋 Integration Checklist

### **json_scanner Integration**

- [ ] Create data reader service for scan results
- [ ] Implement project status dashboard
- [ ] Add rule violation display
- [ ] Connect auto-scan configuration
- [ ] Handle file watching for updates

### **ToolManager Integration**

- [ ] Create tool data reader service
- [ ] Implement tool inventory dashboard
- [ ] Add matrix processing status
- [ ] Connect to json_scanner workflow
- [ ] Handle Excel file monitoring

### **ClampingPlateManager Integration**

- [ ] Analyze React app structure
- [ ] Determine integration method (embed/iframe/API)
- [ ] Create plate summary service
- [ ] Connect to dashboard navigation
- [ ] Handle plate data updates

### **Dashboard Updates**

- [ ] Remove all mock data components
- [ ] Implement real data services
- [ ] Add empty state handling
- [ ] Update navigation based on available data
- [ ] Test end-to-end workflow

## 🎛 Configuration Requirements

### **Environment Variables**

```bash
# Paths configured through Setup Wizard
JSON_SCANNER_DATA_PATH=/path/to/json/files
TOOL_MANAGER_EXCEL_PATH=/path/to/excel/files
PLATE_MANAGER_DATA_PATH=/path/to/plate/models

# Integration settings
ENABLE_AUTO_SCAN=true
SCAN_INTERVAL_MINUTES=60
USE_TEST_DATA=false  # Always false in production

# Database (optional for advanced features)
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=cnc_management
```

### **Dashboard Configuration Schema**

```typescript
interface IntegrationConfig {
  jsonScanner: {
    enabled: boolean;
    dataPath: string;
    resultPath: string;
    autoTrigger: boolean;
  };
  toolManager: {
    enabled: boolean;
    excelPath: string;
    jsonInputPath: string;
    outputPath: string;
    triggerAfterJsonScan: boolean;
  };
  plateManager: {
    enabled: boolean;
    dataPath: string;
    integration: "embedded" | "iframe" | "api";
  };
}
```

## 🔍 Next Steps

1. **Immediate:** Start implementing data readers for existing output files
2. **Short-term:** Create process integration for auto-scan workflow
3. **Medium-term:** Implement ClampingPlateManager integration
4. **Long-term:** Add advanced reporting and analytics features

This integration strategy ensures the dashboard becomes a true unified interface while maintaining the independence and functionality of each sub-project.
