import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  Grid3X3,
  Wrench,
  Settings,
  LogOut,
  X,
  Menu,
  Plus,
  Circle,
  Lock,
  Zap,
  Clock,
  History,
  Search,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Building2,
  FileJson,
  Upload,
  Archive,
  FolderOpen,
  Target,
} from "lucide-react";
import { AppView } from "../App";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  username: string;
  isAdmin: boolean;
  avatar?: string;
  company?: {
    name: string;
    logo?: string;
  };
}

interface SidebarProps {
  user: User;
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

const healthStatusItems = [
  { id: 'new-plates', label: 'New Plates', icon: Plus },
  { id: 'used-plates', label: 'Used Plates', icon: Circle },
  { id: 'locked-plates', label: 'Locked Plates', icon: Lock },
] as const;

const occupancyStatusItems = [
  { id: 'free-plates', label: 'Free Plates', icon: Circle },
  { id: 'in-use-plates', label: 'In Use Plates', icon: Zap },
] as const;

const myPlatesItems = [
  { id: 'ongoing-work', label: 'Ongoing Work', icon: Clock },
  { id: 'history', label: 'History', icon: History },
] as const;

export default function Sidebar({
  user,
  currentView,
  onViewChange,
  isOpen,
  onToggle,
  onLogout,
}: SidebarProps) {
  const [expandedApps, setExpandedApps] = useState<string[]>(['analyzer', 'plates']);

  const toggleApp = (appId: string) => {
    setExpandedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={onToggle}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-40 h-full bg-sidebar border-r border-sidebar-border
        transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isOpen ? "w-64" : "lg:w-16"}
        lg:relative lg:translate-x-0
        flex flex-col
      `}
      >
        {/* Header - Company Info */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            {/* Company Logo */}
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              {user.company?.logo ? (
                <img src={user.company.logo} alt="Company Logo" className="w-8 h-8 rounded" />
              ) : (
                <Building2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            {isOpen && (
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-sidebar-foreground truncate">
                  {user.company?.name || 'Your Company'}
                </h2>
                <p className="text-xs text-sidebar-muted-foreground">
                  CNC Management System
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Dashboard */}
          <div>
            <Button
              variant={currentView === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start ${
                !isOpen && "lg:justify-center"
              }`}
              onClick={() => onViewChange("dashboard")}
            >
              <Grid3X3 className="h-4 w-4" />
              {isOpen && <span className="ml-3">Dashboard</span>}
            </Button>
          </div>

          <Separator className="bg-sidebar-border" />

          {/* Apps Section */}
          {isOpen && (
            <h3 className="text-xs text-muted-foreground uppercase tracking-wide px-3">
              Applications
            </h3>
          )}

          {/* JSON File Analyzer App */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-between ${
                !isOpen && "lg:justify-center"
              }`}
              onClick={() => toggleApp('analyzer')}
            >
              <div className="flex items-center">
                <FileJson className="h-4 w-4" />
                {isOpen && <span className="ml-3">JSON File Analyzer</span>}
              </div>
              {isOpen && (
                expandedApps.includes('analyzer') ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            {isOpen && expandedApps.includes('analyzer') && (
              <div className="ml-6 space-y-1">
                <Button
                  variant={currentView === "my-auto-results" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onViewChange("my-auto-results")}
                >
                  <Archive className="h-3 w-3 mr-2" />
                  My Auto Results
                </Button>
                <Button
                  variant={currentView === "my-manual-results" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onViewChange("my-manual-results")}
                >
                  <Search className="h-3 w-3 mr-2" />
                  My Manual Results
                </Button>
                <Button
                  variant={currentView === "manual-upload" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onViewChange("manual-upload")}
                >
                  <Upload className="h-3 w-3 mr-2" />
                  Manual Upload
                </Button>
              </div>
            )}
          </div>

          {/* Matrix Tools Manager App */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-between ${
                !isOpen && "lg:justify-center"
              }`}
              onClick={() => toggleApp('tools')}
            >
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4" />
                {isOpen && <span className="ml-3">Matrix Tools Manager</span>}
              </div>
              {isOpen && (
                expandedApps.includes('tools') ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            {isOpen && expandedApps.includes('tools') && (
              <div className="ml-6 space-y-1">
                <Button
                  variant={currentView === "available-tools" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onViewChange("available-tools")}
                >
                  <Target className="h-3 w-3 mr-2" />
                  Currently Available
                </Button>
                <Button
                  variant={currentView === "projects-by-tools" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onViewChange("projects-by-tools")}
                >
                  <FolderOpen className="h-3 w-3 mr-2" />
                  Projects by Tools
                </Button>
                <Button
                  variant={currentView === "tools-by-projects" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onViewChange("tools-by-projects")}
                >
                  <Archive className="h-3 w-3 mr-2" />
                  Tools by Projects
                </Button>
              </div>
            )}
          </div>

          {/* Plates Manager App */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-between ${
                !isOpen && "lg:justify-center"
              }`}
              onClick={() => toggleApp('plates')}
            >
              <div className="flex items-center">
                <Wrench className="h-4 w-4" />
                {isOpen && <span className="ml-3">Plates Manager</span>}
              </div>
              {isOpen && (
                expandedApps.includes('plates') ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            {isOpen && expandedApps.includes('plates') && (
              <div className="ml-6 space-y-1">
                <Button
                  variant={currentView === "all-plates" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onViewChange("all-plates")}
                >
                  All Plates
                </Button>
                
                <div className="space-y-1 mt-2">
                  <div className="text-xs text-muted-foreground px-2 py-1">Health Status</div>
                  {healthStatusItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={currentView === item.id ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start pl-4"
                        onClick={() => onViewChange(item.id as AppView)}
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
                
                <div className="space-y-1 mt-2">
                  <div className="text-xs text-muted-foreground px-2 py-1">Occupancy</div>
                  {occupancyStatusItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={currentView === item.id ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start pl-4"
                        onClick={() => onViewChange(item.id as AppView)}
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
                
                <div className="space-y-1 mt-2">
                  <div className="text-xs text-muted-foreground px-2 py-1">My Plates</div>
                  {myPlatesItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={currentView === item.id ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start pl-4"
                        onClick={() => onViewChange(item.id as AppView)}
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border">
          {isOpen ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-sidebar-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.isAdmin ? "Administrator" : "User"}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => onViewChange("settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={onLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewChange("settings")}
                className="w-full"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}