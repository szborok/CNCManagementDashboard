# Module Integration Setup Instructions

## Overview

This guide explains how to integrate the existing separate projects (JSONScanner, ToolManager, ClampingPlateManager) as Git submodules within the CNCManagementDashboard repository.

## Step 1: Prepare the Main Repository

### 1.1 Initialize Git Repository (if not already done)

```bash
cd CNCManagementDashboard
git init
git add .
git commit -m "Initial CNC Management Dashboard commit"
```

### 1.2 Create Remote Repository

Create a GitHub repository for CNCManagementDashboard and add it as remote:

```bash
git remote add origin https://github.com/your-org/CNCManagementDashboard.git
git branch -M main
git push -u origin main
```

## Step 2: Add Existing Projects as Submodules

### 2.1 Add JSONScanner as Submodule

```bash
# Navigate to the main repository
cd CNCManagementDashboard

# Add JSONScanner as submodule
git submodule add https://github.com/your-org/JSONScanner.git modules/JSONScanner

# Commit the submodule addition
git add .gitmodules modules/JSONScanner
git commit -m "Add JSONScanner as submodule"
```

### 2.2 Add ToolManager as Submodule

```bash
# Add ToolManager as submodule
git submodule add https://github.com/your-org/ToolManager.git modules/ToolManager

# Commit the submodule addition
git add .gitmodules modules/ToolManager
git commit -m "Add ToolManager as submodule"
```

### 2.3 Add ClampingPlateManager as Submodule

```bash
# Add ClampingPlateManager as submodule
git submodule add https://github.com/your-org/ClampingPlateManager.git modules/ClampingPlateManager

# Commit the submodule addition
git add .gitmodules modules/ClampingPlateManager
git commit -m "Add ClampingPlateManager as submodule"
```

## Step 3: Alternative Approach - Copy Existing Projects

If the projects don't have separate Git repositories yet, you can copy them directly:

```bash
# Create modules directory
mkdir -p modules

# Copy existing projects (adjust paths as needed)
cp -r ../JSONScanner modules/
cp -r ../ToolManager modules/
cp -r ../ClampingPlateManager modules/

# Initialize Git repositories in each module (if needed)
cd modules/JSONScanner && git init && git add . && git commit -m "Initial commit"
cd ../ToolManager && git init && git add . && git commit -m "Initial commit"
cd ../ClampingPlateManager && git init && git add . && git commit -m "Initial commit"
cd ../..

# Add and commit the modules
git add modules/
git commit -m "Add all modules to unified repository"
```

## Step 4: Update Package.json Dependencies

Install the concurrently package for running multiple dev servers:

```bash
npm install --save-dev concurrently @types/node
```

The package.json has already been updated with the necessary scripts:

- `npm run setup:all` - Install dependencies for all modules
- `npm run dev:all` - Start all development servers
- `npm run test:all` - Run tests for all modules

## Step 5: Configure Module Dependencies

### 5.1 Install Dependencies for All Modules

```bash
npm run setup:all
```

### 5.2 Individual Module Setup

```bash
# If you need to set up modules individually:
npm run setup:json-scanner
npm run setup:tool-manager
npm run setup:clamping-plate
```

## Step 6: Development Workflow

### 6.1 Clone the Repository with All Modules

```bash
# Clone main repository with all submodules
git clone --recursive https://github.com/your-org/CNCManagementDashboard.git

# Or clone main repo and initialize submodules separately
git clone https://github.com/your-org/CNCManagementDashboard.git
cd CNCManagementDashboard
git submodule init
git submodule update
```

### 6.2 Start Development Environment

```bash
# Start all modules in development mode
npm run dev:all
```

This will start:

- Main dashboard on http://localhost:3000
- JSON Scanner API on http://localhost:3001
- Tool Manager API on http://localhost:3002
- Clamping Plate Manager API on http://localhost:3003

## Step 7: Working with Submodules

### 7.1 Update Submodules

```bash
# Update all submodules to latest commits
git submodule update --remote

# Update specific submodule
git submodule update --remote modules/JSONScanner
```

### 7.2 Make Changes to Submodules

```bash
# Navigate to submodule
cd modules/JSONScanner

# Make changes and commit
git add .
git commit -m "Update feature X"
git push origin main

# Return to main repository and update submodule reference
cd ../..
git add modules/JSONScanner
git commit -m "Update JSONScanner submodule"
git push
```

### 7.3 Submodule Best Practices

- Always commit changes in the submodule first
- Then update the submodule reference in the main repository
- Keep submodules on stable branches for production
- Use specific commit hashes for releases

## Step 8: Configure Environment

### 8.1 Create Environment Configuration

Create `.env` file in the root:

```bash
# Development environment
NODE_ENV=development
DATABASE_URL=./data/cnc_management.db
STORAGE_BASE_PATH=./cnc_management_data

# Module ports (optional, defaults in config)
JSONSCANNER_PORT=3001
TOOL_MANAGER_PORT=3002
CLAMPING_PLATE_PORT=3003
```

### 8.2 Module Configuration

The unified configuration system will automatically configure each module based on the main settings.

## Step 9: Deployment Considerations

### 9.1 Production Build

```bash
# Build all modules for production
npm run build:all

# Or build individually
npm run build
cd modules/JSONScanner && npm run build
cd ../ToolManager && npm run build
cd ../ClampingPlateManager && npm run build
```

### 9.2 Docker Configuration (Optional)

Create a `docker-compose.yml` for containerized deployment:

```yaml
version: "3.8"
services:
  dashboard:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
      - ./modules:/app/modules
```

## Step 10: Testing the Integration

### 10.1 Verify Module Loading

```bash
# Test that all modules can be started
npm run dev:all

# Check that all services are accessible:
# http://localhost:3000 - Main Dashboard
# http://localhost:3001 - JSON Scanner
# http://localhost:3002 - Tool Manager
# http://localhost:3003 - Clamping Plate Manager
```

### 10.2 Test Data Integration

```bash
# Verify test data download feature works
# Open the setup wizard and try downloading test data packages
npm run dev
```

## Troubleshooting

### Common Issues

1. **Submodule not found**: Run `git submodule init && git submodule update`
2. **Port conflicts**: Update port configuration in `config/unified.config.ts`
3. **Dependency conflicts**: Run `npm run clean && npm run setup:all`
4. **Module build failures**: Check individual module README files for specific requirements

### Useful Commands

```bash
# Check submodule status
git submodule status

# Reset submodules to tracked commits
git submodule update --init --recursive

# Remove a submodule (if needed)
git submodule deinit modules/module_name
git rm modules/module_name
rm -rf .git/modules/module_name
```

## Next Steps

After completing the integration:

1. Update all README files to reflect the new structure
2. Set up CI/CD pipelines for the unified repository
3. Configure automated testing across all modules
4. Update deployment documentation
5. Train team members on the new workflow

The unified repository structure provides better organization, easier deployment, and a single source of truth for the entire CNC Management system.
