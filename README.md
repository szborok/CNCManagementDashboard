# CNC Management Dashboard

A comprehensive manufacturing management system built with React, TypeScript, and Tailwind CSS. This dashboard integrates multiple manufacturing applications to provide a unified view of operations.

## 🚀 Features

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

### Tech Stack
- **Frontend**: React 18.3.1 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with shadcn/ui
- **Icons**: Lucide React
- **Authentication**: JWT tokens

### Project Structure
```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── Dashboard.tsx       # Main dashboard with multi-app data
│   ├── Sidebar.tsx         # Navigation with dropdown structure
│   ├── Settings.tsx        # User preferences and accessibility
│   └── placeholder-pages/  # Application view placeholders
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── App.tsx                 # Main application with routing
└── main.tsx               # Application entry point
```

## 🔄 Recent Major Updates

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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone repository
git clone [repository-url]
cd CNCManagementDashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

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

**Last Updated**: October 31, 2025
**Version**: 2.0.0
**Maintainer**: AI Development Team