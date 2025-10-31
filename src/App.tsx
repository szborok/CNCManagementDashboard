import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./components/Dashboard";
import PlatesTable from "./components/PlatesTable";
import ScannerResults from "./components/ScannerResults";
import ToolManager from "./components/ToolManager";
import Settings from "./components/Settings";
import Sidebar from "./components/Sidebar";
import ProtectedRoute, { 
  AdminRoute
} from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";

// Enhanced Login Component - Clean and Simple
function WorkingLoginPage() {
  const { login, isLoading, error } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    machineId: 'default', // Set default values since we're removing the UI
    shiftCode: 'DAY'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your CNC Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your username"
                  required
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12 pr-12 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by BRK Spectrum
          </p>
        </div>
      </div>
    </div>
  );
}

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
  | "settings"
  // JSON File Analyzer views
  | "my-auto-results"
  | "my-manual-results" 
  | "manual-upload"
  // Matrix Tools Manager views
  | "available-tools"
  | "projects-by-tools"
  | "tools-by-projects";

// Legacy User interface for Sidebar compatibility
interface LegacyUser {
  id: string;
  name: string;
  username: string;
  isAdmin: boolean;
  email: string;
  role: 'admin' | 'user';
  department: string;
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
  avatar?: string;
  company?: {
    name: string;
    logo?: string;
  };
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
    permissions: user.permissions,
    lastLogin: user.lastLogin,
    isActive: user.isActive,
    avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`,
    company: {
      name: 'BRK Manufacturing',
      logo: undefined // Add company logo URL here if available
    }
  } : null;

  // Show login page if not authenticated
  if (!isAuthenticated || !user || !legacyUser) {
    return (
      <div className="min-h-screen">
        <WorkingLoginPage />
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
        {/* Main Content with Role-based Access Control */}
        <div className="p-4 lg:p-6 w-full">{/* Removed top navigation bar - all navigation now in sidebar */}
          {currentView === "dashboard" && (
            <ProtectedRoute>
              <Dashboard user={legacyUser} />
            </ProtectedRoute>
          )}
          
          {currentView === "scanner-results" && (
            <ProtectedRoute>
              <ScannerResults currentUser={legacyUser} />
            </ProtectedRoute>
          )}
          
          {currentView === "tool-manager" && (
            <AdminRoute>
              <ToolManager currentUser={legacyUser} />
            </AdminRoute>
          )}
          
          {currentView === "all-plates" && (
            <ProtectedRoute>
              <PlatesTable user={legacyUser} />
            </ProtectedRoute>
          )}
          
          {currentView === "new-plates" && (
            <ProtectedRoute>
              <PlatesTable user={legacyUser} filter="new-health" />
            </ProtectedRoute>
          )}
          
          {currentView === "used-plates" && (
            <ProtectedRoute>
              <PlatesTable user={legacyUser} filter="used-health" />
            </ProtectedRoute>
          )}
          
          {currentView === "locked-plates" && (
            <ProtectedRoute>
              <PlatesTable user={legacyUser} filter="locked-health" />
            </ProtectedRoute>
          )}
          
          {currentView === "free-plates" && (
            <ProtectedRoute>
              <PlatesTable user={legacyUser} filter="free-occupancy" />
            </ProtectedRoute>
          )}
          
          {currentView === "in-use-plates" && (
            <ProtectedRoute>
              <PlatesTable user={legacyUser} filter="in-use-occupancy" />
            </ProtectedRoute>
          )}
          
          {currentView === "ongoing-work" && (
            <ProtectedRoute>
              <PlatesTable user={legacyUser} filter="ongoing-work" />
            </ProtectedRoute>
          )}
          
          {currentView === "history" && (
            <ProtectedRoute>
              <PlatesTable user={legacyUser} filter="history" />
            </ProtectedRoute>
          )}
          
          {/* JSON File Analyzer Views */}
          {currentView === "my-auto-results" && (
            <ProtectedRoute>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">My Auto Results</h1>
                <p className="text-gray-600">This page will show your automatically processed JSON file results.</p>
              </div>
            </ProtectedRoute>
          )}
          
          {currentView === "my-manual-results" && (
            <ProtectedRoute>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">My Manual Results</h1>
                <p className="text-gray-600">This page will show your manually processed JSON file results.</p>
              </div>
            </ProtectedRoute>
          )}
          
          {currentView === "manual-upload" && (
            <ProtectedRoute>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Manual Upload</h1>
                <p className="text-gray-600">This page will allow you to manually upload JSON files for analysis.</p>
              </div>
            </ProtectedRoute>
          )}
          
          {/* Matrix Tools Manager Views */}
          {currentView === "available-tools" && (
            <ProtectedRoute>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Currently Available Matrix Tools</h1>
                <p className="text-gray-600">This page will show matrix tools that are currently available (not in use).</p>
              </div>
            </ProtectedRoute>
          )}
          
          {currentView === "projects-by-tools" && (
            <ProtectedRoute>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Projects by Tools</h1>
                <p className="text-gray-600">This page will show projects organized by the matrix tools used in them. Expand each tool to see which projects used it.</p>
              </div>
            </ProtectedRoute>
          )}
          
          {currentView === "tools-by-projects" && (
            <ProtectedRoute>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Tools by Projects</h1>
                <p className="text-gray-600">This page will show projects with expandable sections showing which matrix tools were used in each project.</p>
              </div>
            </ProtectedRoute>
          )}
          
          {currentView === "settings" && (
            <ProtectedRoute>
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
            </ProtectedRoute>
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
          <Route path="/login" element={<WorkingLoginPage />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export { type User } from "./services/AuthService";
export type { LegacyUser };
