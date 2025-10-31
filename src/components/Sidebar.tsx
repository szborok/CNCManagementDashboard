import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  LayoutDashboard,
  Grid3X3,
  Search,
  Wrench,
  Settings,
  LogOut,
  Activity,
  Database,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  username: string;
  isAdmin: boolean;
  avatar?: string;
}

interface SidebarProps {
  currentUser: User;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  { id: "plates", label: "Clamping Plates", icon: Grid3X3, href: "/plates" },
  { id: "scanner", label: "JSON Scanner", icon: Search, href: "/scanner" },
  { id: "tools", label: "Tool Manager", icon: Wrench, href: "/tools" },
] as const;

const adminItems = [
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
] as const;

export default function Sidebar({
  currentUser,
  currentView,
  onViewChange,
  onLogout,
}: SidebarProps) {
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
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Wrench className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            {isOpen && (
              <div className="min-w-0">
                <h2 className="text-sidebar-foreground truncate">
                  Clamping Plates Manager
                </h2>
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
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

          {/* All Plates */}
          <div>
            <Button
              variant={currentView === "all-plates" ? "default" : "ghost"}
              className={`w-full justify-start ${
                !isOpen && "lg:justify-center"
              }`}
              onClick={() => onViewChange("all-plates")}
            >
              <Grid3X3 className="h-4 w-4" />
              {isOpen && <span className="ml-3">All Plates</span>}
            </Button>
          </div>

          {/* Plate Health Section */}
          <div className="space-y-3">
            {isOpen && (
              <h3 className="text-xs text-muted-foreground uppercase tracking-wide px-3">
                Plate Health
              </h3>
            )}
            <Separator className="bg-sidebar-border" />
            <div className="space-y-1">
              {healthStatusItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      !isOpen && "lg:justify-center"
                    }`}
                    onClick={() => onViewChange(item.id as AppView)}
                  >
                    <Icon className="h-4 w-4" />
                    {isOpen && <span className="ml-3">{item.label}</span>}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Plate Occupancy Section */}
          <div className="space-y-3">
            {isOpen && (
              <h3 className="text-xs text-muted-foreground uppercase tracking-wide px-3">
                Plate Occupancy
              </h3>
            )}
            <Separator className="bg-sidebar-border" />
            <div className="space-y-1">
              {occupancyStatusItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      !isOpen && "lg:justify-center"
                    }`}
                    onClick={() => onViewChange(item.id as AppView)}
                  >
                    <Icon className="h-4 w-4" />
                    {isOpen && <span className="ml-3">{item.label}</span>}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* My Plates Section */}
          <div className="space-y-3">
            {isOpen && (
              <h3 className="text-xs text-muted-foreground uppercase tracking-wide px-3">
                My Plates
              </h3>
            )}
            <div className="space-y-1">
              {myPlatesItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      !isOpen && "lg:justify-center"
                    }`}
                    onClick={() => onViewChange(item.id as AppView)}
                  >
                    <Icon className="h-4 w-4" />
                    {isOpen && <span className="ml-3">{item.label}</span>}
                  </Button>
                );
              })}
            </div>
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

              <Separator className="bg-sidebar-border" />

              <div className="space-y-1">
                <Button
                  variant={currentView === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => onViewChange("settings")}
                >
                  <Settings className="h-4 w-4" />
                  <span className="ml-3">Settings</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  size="sm"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-3">Log Out</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant={currentView === "settings" ? "default" : "ghost"}
                size="icon"
                className="w-full"
                onClick={() => onViewChange("settings")}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-full text-destructive hover:text-destructive"
                onClick={onLogout}
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
