# 🔄 Startup Recovery Guide

## Overview

The CNC Management Dashboard includes an intelligent startup recovery system that helps users resume operations after system restarts, crashes, or configuration issues.

## Recovery Scenarios

### 1. **Fresh Session After Restart** 🖥️
**When**: Company restarts PC/server after successful setup
**Detection**: Missing `cncDashboardSession` in sessionStorage
**Flow**: 
- Shows StartupRecovery component automatically
- Checks all backend service health
- Provides guided service startup instructions
- Links to VS Code workspace for development mode

### 2. **Manual Recovery Request** 🔄
**When**: User clicks "Check System Status & Recovery" on login
**Flow**:
- Clears session storage to trigger recovery
- Performs system health check
- Shows current service status
- Provides recovery actions

### 3. **Complete Reset** 🔧
**When**: User clicks "Reset & Run Setup Wizard" 
**Flow**:
- Clears all configuration and session data
- Returns to initial setup wizard
- Fresh configuration process

## Recovery Interface Features

### Service Status Cards
```
✅ JSONScanner Service - Running (Port 3001)
❌ ToolManager Service - Not Running
⚠️  ClampingPlateManager - Connection Error
```

### Quick Actions
- **Start Backend Services**: Direct commands for each service
- **Open VS Code Workspace**: Launch development environment
- **View Service Logs**: Check for startup errors
- **Retry Health Check**: Re-scan system status

### Path Validation
- Verifies all configured paths exist
- Checks for required files and dependencies
- Reports missing components

## Technical Implementation

### StartupRecoveryService
```typescript
// Performs comprehensive system health check
performStartupCheck(config: SetupConfig): Promise<StartupCheckResult>

// Individual service health validation
checkServices(services: ServiceConfig[]): Promise<ServiceStatus[]>

// File system path validation
validatePaths(config: SetupConfig): PathValidationResult[]
```

### Session Detection
```typescript
// Detects fresh sessions after restart
const isFirstVisit = !sessionStorage.getItem("cncDashboardSession");

// Marks session as active
sessionStorage.setItem("cncDashboardSession", "active");
```

## User Instructions

### For End Users (Production)
1. **After PC Restart**:
   - Open browser to dashboard URL
   - System automatically detects restart
   - Follow recovery interface guidance
   - Use provided commands to restart services

2. **If Services Won't Start**:
   - Click "View Service Logs" to check errors
   - Verify paths in recovery interface
   - Use "Open VS Code Workspace" for troubleshooting

### For Developers
1. **Development Mode**:
   - Always use VS Code workspace file
   - Start services via workspace tasks
   - Monitor via integrated terminals

2. **Troubleshooting**:
   - Check individual service ports
   - Verify configuration file integrity
   - Use recovery interface for systematic diagnosis

## Integration Points

### With Setup Wizard
- Recovery system respects existing configuration
- Only suggests re-setup if critical paths missing
- Preserves user customizations

### With Main Dashboard
- Seamless transition after successful recovery
- No data loss during recovery process
- Maintains user session after recovery

### With Backend Services
- Uses same service endpoints as main application
- Timeout protection for unresponsive services
- Graceful error handling for partial failures

## Configuration

### Recovery Timeout Settings
```typescript
const RECOVERY_TIMEOUT = 5000; // 5 seconds per service check
const MAX_RETRIES = 3; // Maximum retry attempts
```

### Service Health Endpoints
```typescript
// Each service provides health check endpoint
GET /health -> { status: "ok", service: "JSONScanner", port: 3001 }
```

## Best Practices

### For System Administrators
- Include recovery guide in deployment documentation
- Test recovery flow during system setup
- Monitor service startup times and reliability

### For Users
- Use recovery interface before manual troubleshooting
- Save VS Code workspace file to desktop for quick access
- Document any recurring recovery issues

## Troubleshooting Common Issues

### "No Configuration Found"
- Indicates complete setup reset needed
- Use "Reset & Run Setup Wizard" option
- Reconfigure all service paths

### "Services Not Responding"
- Check if ports are in use by other applications
- Verify service executable paths exist
- Try manual service restart from command line

### "Path Validation Failed"
- Configured paths may have been moved/deleted
- Use recovery interface to see specific missing paths
- Update configuration or restore missing files

This recovery system ensures that companies can reliably resume CNC operations after any system interruption with minimal downtime and clear guidance.