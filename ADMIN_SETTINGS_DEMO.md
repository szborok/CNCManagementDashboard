# Admin Settings Demo Guide

## Overview
The new AdminSettings component provides comprehensive control over the CNC Management Dashboard for administrator users. It includes:

1. **Auto-Processing Controls** - Start/pause background processing for modules
2. **Setup Configuration Management** - Modify company settings and paths
3. **UI Preferences** - Standard theme and accessibility options

## Features

### 🎛️ Auto-Processing Controls
- **JSON Scanner**: Control automatic processing of JSON files
- **Tool Manager**: Control automatic Excel file processing and tool inventory
- **Clamping Plate Manager**: Control plate database monitoring
- **Play/Pause Buttons**: Real-time control of auto-processing modules
- **Status Badges**: Visual indicators for module states (Running/Stopped)

### ⚙️ Setup Configuration Management
- **Company Information**: Edit company name and logo path
- **Storage Configuration**: Configure base paths, logs, and backup locations
- **Module Configuration**: 
  - Toggle between auto/manual modes
  - Configure data paths for each module
  - Enable/disable module features
- **File Browser Integration**: Click folder icons to select directories
- **Real-time Validation**: Configuration changes are validated before saving

### 🎨 UI Preferences
- **Theme Selection**: Auto, Light, Dark modes
- **Font Size**: Small, Normal, Large options  
- **High Contrast**: Accessibility enhancement toggle

## Access Control
- **Admin Users**: See full AdminSettings component with all controls
- **Regular Users**: See basic Settings component with only UI preferences
- **Role-based Rendering**: Automatic switching based on user role

## Live Demo Features
1. **Configuration Persistence**: All changes are saved to localStorage
2. **Module State Tracking**: Processing states persist across sessions
3. **Dashboard Integration**: Changes affect real dashboard data
4. **Instant Feedback**: Success/error messages for configuration saves

## Testing the Admin Settings

### Login as Admin
Use credentials with admin role to access full AdminSettings interface.

### Login as Regular User  
Use standard user credentials to see basic Settings interface.

### Test Auto-Processing Controls
1. Navigate to Settings (admin users only see expanded interface)
2. Use Play/Pause buttons to control module processing
3. Observe status badge changes
4. Check Dashboard for updated module statuses

### Test Configuration Management
1. Modify company name or paths
2. Click "Save Configuration" button
3. Observe success/error feedback
4. Refresh to see persisted changes

## Technical Implementation
- **Conditional Rendering**: App.tsx renders AdminSettings or Settings based on user role
- **State Management**: Uses useSetupConfig hook for configuration management
- **Service Integration**: Connects with DashboardDataService for real-time updates
- **Form Validation**: Comprehensive input validation and error handling
- **File System Integration**: Directory selection via native file browser

## Benefits
1. **Administrative Control**: Full system configuration without code changes
2. **Operational Flexibility**: Real-time control of processing modules  
3. **User Experience**: Role-appropriate interface complexity
4. **System Maintenance**: Easy path updates and module management
5. **Scalability**: Extensible configuration system for future features