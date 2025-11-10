# CNC Management Dashboard

A comprehensive unified manufacturing management system that integrates JSON file analysis, tool management, and clamping plate operations. Built with React, TypeScript, and Tailwind CSS, this dashboard provides a single interface for all your CNC manufacturing needs.

## 🏗️ Unified Repository Architecture

This repository serves as the main hub containing three specialized modules:

- **🔍 JSON Scanner Module** - Analyzes CAD JSON files and applies manufacturing rules
- **🔧 Tool Manager Module** - Processes Excel tool matrices and manages work tracking
- **📋 Clamping Plate Manager Module** - Manages plate inventory and workflows

Each module can be used independently or as part of the integrated dashboard experience.

## 🆕 New in Version 2.1 - Complete Integration

### 🧙‍♂️ Enhanced Setup Wizard

**First-time users** are now greeted with an intuitive setup wizard that includes:

- **Company branding configuration** with logo upload and validation
- **Module selection and configuration** for all three applications
- **Test data download** - Try the system with sample data
- **Employee data import/setup** with file validation
- **Storage path configuration** with directory validation
- **Feature activation** and integration settings

### � Module Integration

- **Unified Configuration** - Single setup for all modules
- **Shared Data Models** - Consistent data flow between applications
- **Cross-Module APIs** - JSON analysis → Tool management → Plate assignment
- **Centralized Authentication** - One login for all features
- **Integrated Reporting** - Combined analytics across all modules

## 🚀 Quick Start

### For New Users (Recommended)

1. **Clone all repositories to the same parent directory**

   ```bash
   # Create workspace directory
   mkdir CNC-Manufacturing-Workspace
   cd CNC-Manufacturing-Workspace

   # Clone all repositories
   git clone https://github.com/szborok/JSONScanner.git
   git clone https://github.com/szborok/ToolManager.git  
   git clone https://github.com/szborok/ClampingPlateManager.git
   git clone https://github.com/szborok/CNCManagementDashboard.git
   git clone https://github.com/szborok/CNC_TestData.git
   ```

2. **Open the complete workspace**

   ```bash
   # Open the workspace file in VS Code
   code CNCManagementDashboard/BRK-CNC-Management-Dashboard.code-workspace
   ```

3. **Install all dependencies** (use VS Code Tasks or manually)

   **Via VS Code Tasks:** Press `Ctrl+Shift+P` → `Tasks: Run Task` → `🚀 Install All Dependencies`

   **Or manually:**
   ```bash
   # Install each project's dependencies
   cd JSONScanner && npm install
   cd ../ToolManager && npm install  
   cd ../ClampingPlateManager && npm install
   cd ../CNCManagementDashboard && npm install
   ```

4. **Start the complete system**

   **Via VS Code Tasks:** Press `Ctrl+Shift+P` → `Tasks: Run Task` → `🚀 Start All Services`

   **Or manually:** Each service will start in its own terminal window

## 🎯 VS Code Workspace Features

The included `BRK-CNC-Management-Dashboard.code-workspace` file provides:

### 📁 **Organized Project Structure**
- **🔍 JSONScanner** - CNC Quality Control
- **🔧 ToolManager** - Inventory Tracking  
- **📋 ClampingPlateManager** - Backend API
- **🎛️ CNCManagementDashboard** - Frontend
- **📊 CNC_TestData** - Centralized Test Data

### 🚀 **Ready-to-Use Tasks**
- `🚀 Install All Dependencies` - One-click setup
- `🧪 Run All Tests` - Test entire system
- `🖥️ Start Development Dashboard` - Frontend development
- `🔍 Start JSONScanner (Auto Mode)` - Background scanning
- `🔧 Start ToolManager (Auto Mode)` - Background tool processing
- `📋 Start ClampingPlateManager API` - Backend API server
- `🚀 Start All Services` - Complete system startup

### 🐛 **Debug Configurations**
- Individual debugging for each Node.js service
- Integrated terminal support
- Breakpoint debugging across the entire system

### ⚙️ **Workspace Settings**
- Consistent code formatting across all projects
- ESLint integration for all JavaScript/TypeScript files
- Git integration with smart commits
- Extension recommendations for optimal development experience

3. **Download test data (optional)**

   ```bash
   npm run dev
   # Use the setup wizard to download sample data for evaluation
   ```

4. **Start the unified environment**
   ```bash
   npm run dev:all
   ```

### For Existing Users

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the dashboard**

   ```bash
   npm run dev
   ```

3. **Follow the Setup Wizard**
   - Configure company information and branding
   - Select which modules to enable
   - Import existing data or download test samples
   - Set up authentication and storage paths

## 🎯 Demo Mode - Try Before You Configure

**Want to explore the system immediately?** Run in demo mode with pre-configured test data paths:

```bash
npm run demo
```

### How Demo Mode Works

Demo mode automatically populates the setup wizard with paths to test data from all backend modules:

- **JSON Scanner**: `../JSONScanner/data/test_source_data`
- **Tool Manager**: `../ToolManager/data/test_source_data`
- **Clamping Plate Manager**: `../ClampingPlateManager/data/test_source_data`

**Important**: Demo mode shows **real backend results** from test data processing - no mock data!

### To See Data on Dashboard:

1. **Run backend services in test mode** to generate result files:

   ```bash
   # In JSONScanner directory
   npm run test

   # In ToolManager directory
   npm run test

   # In ClampingPlateManager directory
   npm run test
   ```

2. **Import result files** into dashboard:
   - Dashboard reads from `test_processed_data/BRK CNC Management Dashboard/` folders
   - Or use dashboard's import feature to upload result JSON files
   - All data comes from actual backend processing - zero mock data

### Dashboard Data Sources

The dashboard displays **real data only**:

- **JSONScanner Results**: Reads `*_BRK_result.json` files from backend's results folder
- **ToolManager Results**: Reads `ToolManager_Result.json` consolidated report
- **ClampingPlate Inventory**: Reads `clamping_plates_inventory_*.json` files

**No sample/mock data** - If you don't see data on the dashboard, run the backend services first to generate results!

This lets you:

- ✅ Complete the setup wizard with working test data paths
- ✅ Explore all features without manual configuration
- ✅ See how the system works with real-world sample data
- ✅ Test the complete workflow from setup to dashboard

## 🎯 Download Individual Test Data Packages

Alternatively, download comprehensive test data packages through the setup wizard:

- **JSON Scanner Samples** (15 MB) - Complete CAD projects with analysis results
- **Tool Manager Samples** (8 MB) - Excel matrices and tool tracking examples
- **Clamping Plate Samples** (5 MB) - Plate inventory and usage data

Available through the setup wizard's "Try It Out" section.

### For Existing Users

If you've already configured the system, you'll go directly to the login page.

**To reconfigure**: Clear browser localStorage and refresh the page to restart the setup wizard.

### Multi-Application Integration

- **JSON File Analyzer**: Automated processing and analysis of manufacturing JSON files
- **Matrix Tools Manager**: Tool inventory management and project tracking
- **Plates Manager**: Clamping plate lifecycle management

### Modern UI/UX

- Clean, professional interface with no distracting colors
- Responsive design for desktop and mobile
- Dark/light theme support
- High contrast accessibility mode
- Company branding integration

### Authentication & Security

- JWT-based authentication
- Role-based access control (Admin/User)
- Secure credential management

### Dashboard Features

- Multi-application summary cards
- Real-time system status monitoring
- Cross-application activity feed
- Quick action panels
- Integrated recent activity tracking

## 🏗️ Architecture

### Unified Repository Structure

```
CNCManagementDashboard/
├── src/                           # Main dashboard application
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   ├── Dashboard.tsx         # Unified dashboard with all module data
│   │   ├── SetupWizard.tsx       # Enhanced setup with module integration
│   │   └── AdminSettings.tsx     # System administration
│   ├── services/
│   │   ├── TestDataDownloadService.ts  # Test data management
│   │   └── SetupProcessor.ts     # Setup configuration processing
│   └── contexts/
│       └── AuthContext.tsx       # Authentication state management
├── modules/                       # Integrated sub-applications
│   ├── JSONScanner/              # JSON file analysis module
│   │   ├── src/                  # Scanner application code
│   │   ├── test_data/           # CAD project samples (KEEP)
│   │   ├── rules/               # Analysis rules and corrections
│   │   └── package.json         # Module dependencies
│   ├── ToolManager/              # Tool management module
│   │   ├── src/                  # Tool management code
│   │   ├── test_data/           # Excel matrix samples (KEEP)
│   │   ├── working_data/        # Active processing folders
│   │   └── package.json         # Module dependencies
│   └── ClampingPlateManager/     # Plate management module
│       ├── src/                  # Plate management code
│       ├── test_data/           # Plate inventory samples (KEEP)
│       └── package.json         # Module dependencies
├── config/
│   └── unified.config.ts         # Central configuration for all modules
├── test_data_samples/            # Downloadable test data packages
├── docs/                         # Comprehensive documentation
│   ├── REPOSITORY_ARCHITECTURE.md
│   ├── INTEGRATION_SETUP.md
│   └── API_INTEGRATION.md
└── package.json                  # Main package with module scripts
```

### Module Integration

- **Git Submodules**: Each module maintains its own repository while being integrated
- **Unified Configuration**: Central config coordinates all module settings
- **Shared APIs**: Cross-module communication for data flow
- **Common Dependencies**: Shared utilities and UI components
- **Integrated Development**: Single command starts all modules

## 🔄 Recent Major Updates

### Admin Settings Enhancement (November 2025)

- **Complete AdminSettings Redesign**: Reorganized with feature toggles and conditional UI
- **SetupWizard Integration**: AdminSettings now matches SetupWizard configuration options
- **Vertical Sidebar Layout**: Admin settings and logout buttons stacked vertically
- **Enhanced File Management**: Improved file browser functionality and path handling
- **Feature Parity**: Complete alignment between AdminSettings and SetupWizard capabilities

### UI Redesign (October 2025)

- **Removed all gradient colors** for professional appearance
- **Redesigned sidebar** with company branding and dropdown navigation
- **Updated application names**:
  - QC Scanner → JSON File Analyzer
  - Tool Manager → Matrix Tools Manager
- **Integrated dashboard** showing data from all connected applications
- **Made settings universal** (previously admin-only)

### Navigation Structure

```
BRK Manufacturing
├── Dashboard
├── JSON File Analyzer
│   ├── File Upload
│   ├── Analysis Results
│   ├── Auto Processing
│   ├── Manual Review
│   └── Settings
├── Matrix Tools Manager
│   ├── Tool Inventory
│   ├── Project Management
│   ├── Reports
│   └── Maintenance
├── Plates Manager
│   ├── Plate Overview
│   ├── Work Management
│   ├── Status Tracking
│   └── Reports
└── Settings (Universal Access)
```

## 🚀 Development Workflow

### Available Scripts

#### Setup Commands

```bash
# Setup all modules (main + sub-modules)
npm run setup:all

# Setup individual modules
npm run setup:json-scanner
npm run setup:tool-manager
npm run setup:clamping-plate
```

#### Development Commands

```bash
# Start main dashboard only
npm run dev

# Start all modules in development mode
npm run dev:all

# Start individual modules
npm run dev:json-scanner
npm run dev:tool-manager
npm run dev:clamping-plate
```

#### Testing Commands

```bash
# Run all tests (main + modules)
npm run test:all

# Test individual modules
npm run test:json-scanner
npm run test:tool-manager
npm run test:clamping-plate
```

#### Maintenance Commands

```bash
# Clean all node_modules and package-lock.json files
npm run clean

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

### Development Environment Setup

1. **Clone with submodules**

   ```bash
   git clone --recursive https://github.com/your-org/CNCManagementDashboard.git
   cd CNCManagementDashboard
   ```

2. **Install all dependencies**

   ```bash
   npm run setup:all
   ```

3. **Start development environment**

   ```bash
   npm run dev:all
   ```

4. **Access applications**
   - Main Dashboard: http://localhost:3000
   - JSON Scanner API: http://localhost:3001
   - Tool Manager API: http://localhost:3002
   - Clamping Plate API: http://localhost:3003

### Prerequisites

- Node.js 18+
- npm or yarn
- Git (for submodule management)

### Test Credentials

```
Admin User:
Username: admin
Password: admin123

Regular User:
Username: operator
Password: operator123
```

## 📱 Component Overview

### Dashboard.tsx

- **Purpose**: Central hub displaying data from all applications
- **Features**: Multi-app summary cards, system status, recent activity
- **Data Sources**: Integrated data from JSON Analyzer, Matrix Tools, and Plates

### Sidebar.tsx

- **Purpose**: Main navigation with company branding
- **Features**: Dropdown navigation, responsive design, active state indicators
- **Structure**: Company header + expandable application sections

### Settings.tsx

- **Purpose**: User preferences and accessibility controls
- **Features**: Theme selection, font sizing, high contrast mode
- **Access**: Available to all authenticated users

### AdminSettings.tsx (NEW!)

- **Purpose**: Administrative configuration panel with comprehensive controls
- **Features**: Company Information toggles, conditional module configuration, enhanced file management
- **Integration**: Feature parity with SetupWizard, Auto/Manual mode selection
- **Access**: Admin-only with role-based restrictions

## 🔗 Integration Points

### JSON File Analyzer Integration

- File upload and processing status
- Analysis results and issue tracking
- Auto vs manual processing statistics

### Matrix Tools Manager Integration

- Tool inventory and availability
- Project status and assignments
- Maintenance tracking

### Plates Manager Integration

- Plate status and location tracking
- Work assignments and progress
- User activity monitoring

## 🛠️ Development Notes

### State Management

- Authentication context for user state
- Local state management in components
- Mock data structure for multi-app integration

### Styling Guidelines

- No gradient colors or bright styling
- Professional neutral color palette
- Consistent spacing using Tailwind utilities
- Accessible color contrasts

### Data Structure

```typescript
// Multi-application dashboard data
const dashboardData = {
  plates: { total, inUse, myActive, ... },
  jsonAnalyzer: { totalProcessed, autoResults, recentAnalysis, ... },
  matrixTools: { totalTools, available, activeProjects, ... }
}
```

## 🔮 Future Development

### Planned Features

- Real API integration (currently using mock data)
- Advanced reporting and analytics
- Notification system
- Mobile app companion
- Advanced user permissions

### Technical Debt

- Replace mock data with real API calls
- Implement proper error handling
- Add comprehensive testing
- Performance optimization
- Database integration

## 🤝 AI Agent Handoff Guide

### Current State

- UI redesign completed with professional styling
- Multi-application dashboard integration finished
- Navigation structure fully implemented
- All placeholder pages created and routed

### Key Files to Understand

1. `src/components/Dashboard.tsx` - Main dashboard component
2. `src/components/Sidebar.tsx` - Navigation component
3. `src/App.tsx` - Routing and application structure
4. `src/components/Settings.tsx` - User preferences

### Next Priority Items

1. Replace mock data with real API integration
2. Implement backend services for each application
3. Add comprehensive error handling
4. Create real authentication system
5. Add data persistence

### Development Environment

- TypeScript strict mode enabled
- ESLint configuration active
- Vite development server on port 5173
- Hot reload functional

## 📄 License

Private project for BRK Manufacturing

---

**Last Updated**: November 12, 2025
**Version**: 2.1.0
**Maintainer**: AI Development Team
