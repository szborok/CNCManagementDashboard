# Component Architecture Documentation

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── placeholder-pages/      # Application view components
│   │   ├── JsonAnalyzer/
│   │   ├── MatrixTools/
│   │   └── PlatesManager/
│   ├── Dashboard.tsx           # Main dashboard component
│   ├── Sidebar.tsx             # Navigation component
│   └── Settings.tsx            # User preferences
├── contexts/
│   └── AuthContext.tsx         # Authentication state
├── App.tsx                     # Main application + routing
└── main.tsx                    # Entry point
```

## 🎯 Core Components

### Dashboard.tsx
**Purpose**: Central hub displaying integrated data from all manufacturing applications

**Key Features**:
- Multi-application summary cards
- Cross-application recent activity feed
- System status monitoring
- Quick actions panel
- Application-specific detail sections

**Data Structure**:
```typescript
const dashboardData = {
  plates: {
    total: number,
    new: number,
    inUse: number,
    locked: number,
    myActive: number
  },
  jsonAnalyzer: {
    totalProcessed: number,
    autoResults: number,
    manualResults: number,
    pendingUpload: number,
    recentAnalysis: Array<{
      id: number,
      filename: string,
      status: string,
      timestamp: string,
      issues: number
    }>
  },
  matrixTools: {
    totalTools: number,
    available: number,
    inUse: number,
    activeProjects: number,
    recentActivity: Array<{
      id: number,
      project: string,
      operation: string,
      status: string
    }>
  }
}
```

**Props**:
```typescript
interface DashboardProps {
  user: UserType;
}
```

**Recent Changes**:
- ✅ Removed all colorful gradients and styling
- ✅ Added multi-application data integration
- ✅ Created summary cards for all three apps
- ✅ Added cross-application activity feed
- ✅ Integrated system status monitoring

### Sidebar.tsx
**Purpose**: Main navigation with company branding and dropdown structure

**Key Features**:
- Company branding header (BRK Manufacturing)
- Dropdown navigation sections
- Active state management
- Responsive design
- Collapsible application menus

**Navigation Structure**:
```typescript
type AppView = 
  | 'dashboard'
  | 'json-upload' | 'json-results' | 'json-auto' | 'json-manual' | 'json-settings'
  | 'matrix-inventory' | 'matrix-projects' | 'matrix-reports' | 'matrix-maintenance'
  | 'plates-overview' | 'plates-work' | 'plates-status' | 'plates-reports'
  | 'settings';
```

**Props**:
```typescript
interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  user: UserType;
}
```

**Recent Changes**:
- ✅ Complete redesign from scratch
- ✅ Added company branding header
- ✅ Implemented dropdown navigation structure
- ✅ Created organized app sections
- ✅ Added proper active state indicators

### Settings.tsx
**Purpose**: User preferences and accessibility controls

**Key Features**:
- Theme selection (light/dark)
- Font size adjustment
- High contrast mode
- Universal access (all users)

**Props**:
```typescript
interface SettingsProps {
  user: UserType;
}
```

**Recent Changes**:
- ✅ Made accessible to all users (was admin-only)
- ✅ Removed preview section
- ✅ Simplified to core functionality
- ✅ Cleaned up unused code

## 🔄 Authentication Flow

### AuthContext.tsx
**Purpose**: Manages user authentication state throughout the application

**Context Structure**:
```typescript
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}
```

**Test Credentials**:
- Admin: `admin` / `admin123`
- User: `operator` / `operator123`

## 🛣️ Routing Structure

### App.tsx
**Purpose**: Main application component with routing and authentication

**Route Protection**:
- `ProtectedRoute`: Requires authentication
- `AdminRoute`: Requires admin role (currently unused)

**View Components**:
All new application views are placeholder components that return:
```tsx
return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">[View Name]</h1>
    <p className="text-muted-foreground">
      This view is under development.
    </p>
  </div>
);
```

**Recent Changes**:
- ✅ Added all new AppView types
- ✅ Created routes for all placeholder pages
- ✅ Changed Settings from AdminRoute to ProtectedRoute
- ✅ Updated view switching logic

## 📦 Placeholder Components

### JSON File Analyzer Views
- **FileUpload**: JSON file upload interface
- **AnalysisResults**: Processing results display
- **AutoProcessing**: Automated analysis configuration
- **ManualReview**: Manual review interface
- **JsonAnalyzerSettings**: Analyzer-specific settings

### Matrix Tools Manager Views
- **ToolInventory**: Tool tracking and inventory
- **ProjectManagement**: Project assignment and tracking
- **MatrixReports**: Reporting and analytics
- **Maintenance**: Tool maintenance scheduling

### Plates Manager Views
- **PlateOverview**: Plate status overview
- **WorkManagement**: Work assignment interface
- **StatusTracking**: Real-time status tracking
- **PlatesReports**: Plate-related reporting

## 🎨 Styling Guidelines

### Design Principles
- **No gradient colors**: Professional neutral appearance
- **Consistent spacing**: Tailwind utilities only
- **Accessible contrast**: High contrast mode support
- **Responsive design**: Mobile-first approach

### Color Palette
- **Primary**: Neutral grays and whites
- **Accents**: Subtle blues, greens for status
- **Text**: High contrast for readability
- **Backgrounds**: Clean whites and light grays

### Component Patterns
```tsx
// Card component pattern
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>

// Status badge pattern
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Pending</Badge>

// Icon with text pattern
<div className="flex items-center gap-2">
  <Icon className="h-4 w-4" />
  Text
</div>
```

## 🔮 Future Development

### API Integration Points
- Replace mock data with real API calls
- Implement proper error handling
- Add loading states
- Create data fetching hooks

### Enhanced Features
- Real-time updates via WebSocket
- Advanced filtering and search
- Data export functionality
- Notification system

### Performance Optimizations
- Component lazy loading
- Data virtualization for large lists
- Memoization for expensive calculations
- Bundle size optimization

---

**Last Updated**: October 31, 2025  
**Architecture Version**: 2.0  
**Component Count**: 20+ (including placeholders)