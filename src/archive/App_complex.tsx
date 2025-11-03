import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import PlatesTable from "./components/PlatesTable";
import ScannerResults from "./components/ScannerResults";
import ToolManager from "./components/ToolManager";
import Settings from "./components/Settings";
import Sidebar from "./components/Sidebar";
import ProtectedRoute, { 
  AdminRoute, 
  OperatorRoute,
  PermissionRoute,
  ProductionRoute,
} from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";

export interface Plate {
  id: string;
  name?: string;
  shelf: string;
  previewImage: string;
  xtFile: string;
  health: "new" | "used" | "locked";
  occupancy: "free" | "in-use";
  notes?: string;
  lastWorkName?: string;
  lastModifiedBy?: string;
  lastModifiedDate: Date;
  history: PlateHistoryEntry[];
}

export interface PlateHistoryEntry {
  id: string;
  action: string;
  user: string;
  date: Date;
  details?: string;
}

export type AppView =
  | "dashboard"
  | "all-plates"
  | "new-plates"
  | "used-plates"
  | "locked-plates"
  | "free-plates"
  | "in-use-plates"
  | "ongoing-work"
  | "history"
  | "scanner-results"
  | "tool-manager"
  | "settings";

// Legacy User interface for Sidebar compatibility
interface LegacyUser {
  id: string;
  name: string;
  username: string;
  isAdmin: boolean;
  email: string;
  role: 'operator' | 'technician' | 'supervisor' | 'admin';
  department: string;
  shift: 'day' | 'evening' | 'night';
  authorizedMachines: string[];
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
  avatar?: string;
}

// Main App Content Component (authenticated app)
function AppContent() {
  const { user, logout, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto");
  const [fontSize, setFontSize] = useState<"small" | "normal" | "large">("normal");
  const [highContrast, setHighContrast] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "auto"
      | "light"
      | "dark"
      | null;
    const savedFontSize = localStorage.getItem("fontSize") as
      | "small"
      | "normal"
      | "large"
      | null;
    const savedHighContrast = localStorage.getItem("highContrast") === "true";

    if (savedTheme) setTheme(savedTheme);
    if (savedFontSize) setFontSize(savedFontSize);
    setHighContrast(savedHighContrast);
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove("dark", "light", "high-contrast");

    const applyTheme = () => {
      // Apply theme
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        // Light is default, no class needed
      } else {
        // Auto theme - use system preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          root.classList.add("dark");
        }
      }
    };

    applyTheme();

    // Listen for system theme changes when in auto mode
    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        root.classList.remove("dark");
        if (mediaQuery.matches) {
          root.classList.add("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;

    // Apply high contrast
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Apply font size
    const fontSizes = {
      small: "12px",
      normal: "14px",
      large: "16px",
    };
    root.style.setProperty("--font-size", fontSizes[fontSize]);
  }, [fontSize, highContrast]);

  // Convert new User type to legacy interface for Sidebar compatibility
  const legacyUser: LegacyUser | null = user ? {
    id: user.id,
    name: user.username, // Use username as display name
    username: user.username,
    isAdmin: user.role === 'admin',
    email: user.email,
    role: user.role,
    department: user.department,
    shift: user.shift,
    authorizedMachines: user.authorizedMachines,
    permissions: user.permissions,
    lastLogin: user.lastLogin,
    isActive: user.isActive,
    avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`,
  } : null;

  // Show login page if not authenticated
  if (!isAuthenticated || !user || !legacyUser) {
    return (
      <div className="min-h-screen">
        <LoginPage />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar
        user={legacyUser}
        currentView={currentView}
        onViewChange={(view: string) => setCurrentView(view as AppView)}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={logout}
      />

      <main className="flex-1 overflow-auto">
        {/* Enhanced Navigation with Role Information */}
        <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentView("dashboard")}
              className={`px-3 py-1 rounded transition-colors ${
                currentView === "dashboard" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView("scanner-results")}
              className={`px-3 py-1 rounded transition-colors ${
                currentView === "scanner-results" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
              Scanner Results
            </button>
            <button 
              onClick={() => setCurrentView("tool-manager")}
              className={`px-3 py-1 rounded transition-colors ${
                currentView === "tool-manager" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
              Tool Manager
            </button>
            <button 
              onClick={() => setCurrentView("all-plates")}
              className={`px-3 py-1 rounded transition-colors ${
                currentView === "all-plates" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
              Plates
            </button>
          </div>
          
          {/* User Info with Role Badge */}
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-300">Welcome, </span>
              <span className="font-medium">{user.username}</span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              user.role === 'supervisor' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
              user.role === 'technician' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {user.role.toUpperCase()}
            </div>
            {user.shift && (
              <div className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {user.shift.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Main Content with Role-based Access Control */}
        <div className="p-4 lg:p-6 w-full">
          {currentView === "dashboard" && (
            <ProtectedRoute requiredPermissions={['read']}>
              <Dashboard user={legacyUser} />
            </ProtectedRoute>
          )}
          
          {currentView === "scanner-results" && (
            <ProductionRoute>
              <ScannerResults currentUser={legacyUser} />
            </ProductionRoute>
          )}
          
          {currentView === "tool-manager" && (
            <PermissionRoute permissions={['read', 'tool_management']}>
              <ToolManager currentUser={legacyUser} />
            </PermissionRoute>
          )}
          
          {currentView === "all-plates" && (
            <OperatorRoute>
              <PlatesTable user={legacyUser} />
            </OperatorRoute>
          )}
          
          {currentView === "new-plates" && (
            <OperatorRoute>
              <PlatesTable user={legacyUser} filter="new-health" />
            </OperatorRoute>
          )}
          
          {currentView === "used-plates" && (
            <OperatorRoute>
              <PlatesTable user={legacyUser} filter="used-health" />
            </OperatorRoute>
          )}
          
          {currentView === "locked-plates" && (
            <OperatorRoute>
              <PlatesTable user={legacyUser} filter="locked-health" />
            </OperatorRoute>
          )}
          
          {currentView === "free-plates" && (
            <OperatorRoute>
              <PlatesTable user={legacyUser} filter="free-occupancy" />
            </OperatorRoute>
          )}
          
          {currentView === "in-use-plates" && (
            <OperatorRoute>
              <PlatesTable user={legacyUser} filter="in-use-occupancy" />
            </OperatorRoute>
          )}
          
          {currentView === "ongoing-work" && (
            <OperatorRoute>
              <PlatesTable user={legacyUser} filter="ongoing-work" />
            </OperatorRoute>
          )}
          
          {currentView === "history" && (
            <OperatorRoute>
              <PlatesTable user={legacyUser} filter="history" />
            </OperatorRoute>
          )}
          
          {currentView === "settings" && (
            <AdminRoute>
              <Settings
                theme={theme}
                fontSize={fontSize}
                highContrast={highContrast}
                onThemeChange={(newTheme) => {
                  setTheme(newTheme);
                  localStorage.setItem("theme", newTheme);
                }}
                onFontSizeChange={(newSize) => {
                  setFontSize(newSize);
                  localStorage.setItem("fontSize", newSize);
                }}
                onHighContrastChange={(enabled) => {
                  setHighContrast(enabled);
                  localStorage.setItem("highContrast", enabled.toString());
                }}
              />
            </AdminRoute>
          )}
        </div>
      </main>

      <Toaster />
    </div>
  );
}

// Main App Component with Authentication Provider
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export { type User } from "./services/AuthService";
export type { LegacyUser };