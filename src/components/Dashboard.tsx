import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Grid3X3,
  Clock,
  FileJson,
  Archive,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { User as UserType } from "../App";
import {
  DashboardDataService,
  DashboardData,
} from "../services/DashboardDataService";
import jsonScannerAPI from "../services/api/jsonScanner";
import toolManagerAPI from "../services/api/toolManager";
import platesManagerAPI from "../services/api/platesManager";

interface DashboardProps {
  user: UserType;
}

export default function Dashboard({ user }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [useAPIMode, setUseAPIMode] = useState(() => {
    // Load API mode preference from localStorage
    const saved = localStorage.getItem("dashboardAPIMode");
    return saved === "true";
  });
  const [apiStatus, setApiStatus] = useState<{
    jsonScanner: boolean;
    toolManager: boolean;
    platesManager: boolean;
  }>({
    jsonScanner: false,
    toolManager: false,
    platesManager: false,
  });

  useEffect(() => {
    loadDashboardData();
  }, [useAPIMode]); // Reload when API mode changes

  const checkAPIStatus = async () => {
    const status = {
      jsonScanner: false,
      toolManager: false,
      platesManager: false,
    };

    try {
      await jsonScannerAPI.getStatus();
      status.jsonScanner = true;
    } catch {}

    try {
      await toolManagerAPI.getStatus();
      status.toolManager = true;
    } catch {}

    try {
      await platesManagerAPI.getStatus();
      status.platesManager = true;
    } catch {}

    setApiStatus(status);
    return status;
  };

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      if (useAPIMode) {
        // API MODE: Load data from real backend services
        console.log("📡 Loading data from API backends...");
        const status = await checkAPIStatus();

        if (
          !status.jsonScanner &&
          !status.toolManager &&
          !status.platesManager
        ) {
          console.warn(
            "⚠️ No API backends available, falling back to demo mode"
          );
          setDashboardData(DashboardDataService.generateFallbackData());
          return;
        }

        // Fetch data from APIs
        const [projectsData, toolsData, platesData] = await Promise.all([
          status.jsonScanner
            ? jsonScannerAPI
                .getProjects()
                .catch(() => ({ projects: [], total: 0 }))
            : Promise.resolve({ projects: [], total: 0 }),
          status.toolManager
            ? toolManagerAPI
                .getTools()
                .catch(() => ({ tools: [], total: 0, stats: {} }))
            : Promise.resolve({ tools: [], total: 0, stats: {} }),
          status.platesManager
            ? platesManagerAPI
                .getPlates()
                .catch(() => ({ plates: [], total: 0 }))
            : Promise.resolve({ plates: [], total: 0 }),
        ]);

        // Save API data to localStorage in legacy format for ToolManager component
        if (toolsData.tools && toolsData.tools.length > 0) {
          const matrixTools = toolsData.tools.filter((t: any) => t.isMatrix);
          const nonMatrixTools = toolsData.tools.filter((t: any) => !t.isMatrix);
          
          const legacyFormat = {
            reportInfo: {
              generatedAt: new Date().toISOString(),
              summary: {
                excelFilesProcessed: 1,
                jsonFilesProcessed: (toolsData as any).stats?.jsonFilesProcessed || 18,
                matrixToolsUsed: matrixTools.length,
                nonMatrixToolsUsed: nonMatrixTools.length,
                totalMatrixTools: matrixTools.length,
                unusedMatrixTools: 0
              }
            },
            matrixTools: matrixTools.map((t: any) => ({
              toolName: t.name,
              totalUsageTime: t.usageTime || 0,
              usageCount: t.usageCount || 0,
              projectCount: t.projectCount || 0,
              status: "IN_USE"
            })),
            nonMatrixTools: nonMatrixTools.map((t: any) => ({
              toolName: t.name,
              totalUsageTime: t.usageTime || 0,
              usageCount: t.usageCount || 0,
              projectCount: t.projectCount || 0,
              status: "NOT_IN_MATRIX"
            })),
            allMatrixTools: [],
            unusedMatrixTools: []
          };
          
          localStorage.setItem("toolManagerResults", JSON.stringify(legacyFormat));
          console.log(`✅ Saved ${toolsData.tools.length} tools to localStorage (${matrixTools.length} matrix, ${nonMatrixTools.length} non-matrix)`);
        }

        // Transform API data to DashboardData format
        const apiData: any = {
          overview: {
            totalProjects: projectsData.total || 0,
            activeProjects:
              projectsData.projects?.filter((p: any) => p.status !== "passed")
                .length || 0,
            completedToday: 0, // TODO: Calculate from project data
            toolsInUse:
              toolsData.tools?.filter((t: any) => t.status === "in_use")
                .length || 0,
            lastUpdate: new Date().toISOString(),
          },
          jsonScanner: {
            totalProjects: projectsData.total || 0,
            passedProjects:
              projectsData.projects?.filter((p: any) => p.status === "passed")
                .length || 0,
            failedProjects:
              projectsData.projects?.filter((p: any) => p.status === "failed")
                .length || 0,
            warningProjects:
              projectsData.projects?.filter((p: any) => p.status === "warning")
                .length || 0,
            recentProjects:
              projectsData.projects?.slice(0, 5).map((p: any) => ({
                id: p.id,
                name: p.name,
                status: p.status,
                timestamp: p.lastAnalyzed || new Date().toISOString(),
              })) || [],
          },
          toolManager: {
            totalTools: toolsData.total || 0,
            toolsInUse: (toolsData as any).stats?.toolsInUse || 0,
            availableTools: (toolsData as any).stats?.toolsAvailable || 0,
            upcomingRequirements: [],
          },
          clampingPlateManager: {
            totalPlates: platesData.total || 0,
            inUse:
              platesData.plates?.filter((p: any) => p.occupancy === "in-use")
                .length || 0,
            available:
              platesData.plates?.filter((p: any) => p.occupancy === "free")
                .length || 0,
            locked:
              platesData.plates?.filter((p: any) => p.health === "locked")
                .length || 0,
            recentActivity: [],
          },
          recentActivity: [],
          charts: {
            projectCompletion: [],
            toolUsage: [],
          },
          modules: {
            jsonScanner: {
              status: status.jsonScanner ? "active" : "disabled",
              lastScan: new Date().toISOString(),
              filesProcessed: projectsData.total || 0,
            },
            toolManager: {
              status: status.toolManager ? "active" : "disabled",
              lastUpdate: new Date().toISOString(),
              toolsTracked: toolsData.total || 0,
            },
            clampingPlateManager: {
              status: status.platesManager ? "active" : "disabled",
              lastUpdate: new Date().toISOString(),
              platesManaged: platesData.total || 0,
            },
          },
        };

        console.log("✅ Loaded data from API backends:", apiData);
        setDashboardData(apiData);
      } else {
        // No backends available - must start them
        console.warn("⚠️ All backends offline");
        console.log("💡 Start backends: cd JSONScanner/ToolManager/ClampingPlateManager && npm run serve");
        setDashboardData(DashboardDataService.generateFallbackData());
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setDashboardData(DashboardDataService.generateFallbackData());
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAPIMode = () => {
    const newMode = !useAPIMode;
    setUseAPIMode(newMode);
    localStorage.setItem("dashboardAPIMode", String(newMode));
    console.log(`🔄 Switched to ${newMode ? "API" : "Demo"} mode`);
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);

      // In demo mode, fetch fresh data from demo-data files
      try {
        const [jsonResponse, toolResponse, plateResponse] = await Promise.all([
          fetch("/demo-data/jsonscanner-results.json"),
          fetch("/demo-data/toolmanager-results.json"),
          fetch("/demo-data/clampingplate-results.json"),
        ]);

        if (jsonResponse.ok) {
          const jsonData = await jsonResponse.json();
          localStorage.setItem("jsonScannerResults", JSON.stringify(jsonData));
          console.log(`✅ Refreshed ${jsonData.length} JSON Scanner results`);
        }

        if (toolResponse.ok) {
          const toolData = await toolResponse.json();
          localStorage.setItem("toolManagerResults", JSON.stringify(toolData));
          console.log("✅ Refreshed Tool Manager results");
        }

        if (plateResponse.ok) {
          const plateData = await plateResponse.json();
          localStorage.setItem(
            "clampingPlateResults",
            JSON.stringify(plateData)
          );
          console.log(
            `✅ Refreshed ${
              plateData.plates?.length || 0
            } Clamping Plate results`
          );
        }
      } catch (fetchError) {
        console.log("ℹ️ Could not fetch fresh demo data, using cached data");
      }

      await DashboardDataService.refreshData();
      await loadDashboardData();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Unable to load dashboard data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user.username}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Here's what's happening with your CNC Management Dashboard.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {formatTimestamp(dashboardData.overview.lastUpdate)}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Badge
                variant={useAPIMode ? "default" : "secondary"}
                className="text-xs"
              >
                {useAPIMode ? (
                  <>
                    <Wifi className="h-3 w-3 mr-1" />
                    API Mode
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 mr-1" />
                    Demo Mode
                  </>
                )}
              </Badge>
              {useAPIMode && (
                <div className="flex items-center gap-1 text-xs">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      apiStatus.jsonScanner ? "bg-green-500" : "bg-red-500"
                    }`}
                    title="JSONScanner"
                  />
                  <span
                    className={`h-2 w-2 rounded-full ${
                      apiStatus.toolManager ? "bg-green-500" : "bg-red-500"
                    }`}
                    title="ToolManager"
                  />
                  <span
                    className={`h-2 w-2 rounded-full ${
                      apiStatus.platesManager ? "bg-green-500" : "bg-red-500"
                    }`}
                    title="PlatesManager"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAPIMode}
              className="flex items-center gap-2"
            >
              {useAPIMode ? (
                <WifiOff className="h-4 w-4" />
              ) : (
                <Wifi className="h-4 w-4" />
              )}
              {useAPIMode ? "Use Demo" : "Use API"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.overview.totalProjects}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData.overview.activeProjects}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardData.overview.completedToday}
            </div>
            <p className="text-xs text-muted-foreground">Tasks finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Tools in Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {dashboardData.overview.toolsInUse}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Module Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              JSON Scanner
              <Badge
                variant={
                  dashboardData.modules.jsonScanner.status === "active"
                    ? "default"
                    : "secondary"
                }
              >
                {dashboardData.modules.jsonScanner.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Files Processed
              </span>
              <span className="font-bold">
                {dashboardData.modules.jsonScanner.filesProcessed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Last Scan</span>
              <span className="text-xs">
                {dashboardData.modules.jsonScanner.lastScan
                  ? formatTimestamp(dashboardData.modules.jsonScanner.lastScan)
                  : "Never"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Tool Manager
              <Badge
                variant={
                  dashboardData.modules.toolManager.status === "active"
                    ? "default"
                    : "secondary"
                }
              >
                {dashboardData.modules.toolManager.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Tools Tracked
              </span>
              <span className="font-bold">
                {dashboardData.modules.toolManager.toolsTracked}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Last Update</span>
              <span className="text-xs">
                {dashboardData.modules.toolManager.lastUpdate
                  ? formatTimestamp(
                      dashboardData.modules.toolManager.lastUpdate
                    )
                  : "Never"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Clamping Plates
              <Badge
                variant={
                  dashboardData.modules.clampingPlateManager.status === "active"
                    ? "default"
                    : "secondary"
                }
              >
                {dashboardData.modules.clampingPlateManager.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Plates Managed
              </span>
              <span className="font-bold">
                {dashboardData.modules.clampingPlateManager.platesManaged}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Last Update</span>
              <span className="text-xs">
                {dashboardData.modules.clampingPlateManager.lastUpdate
                  ? formatTimestamp(
                      dashboardData.modules.clampingPlateManager.lastUpdate
                    )
                  : "Never"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest updates from all enabled modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.status === "completed"
                        ? "bg-green-500"
                        : activity.status === "processing"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {activity.type === "json_analysis" && (
                        <FileJson className="h-4 w-4" />
                      )}
                      {activity.type === "tool_inventory" && (
                        <Archive className="h-4 w-4" />
                      )}
                      {activity.type === "plate_management" && (
                        <Grid3X3 className="h-4 w-4" />
                      )}
                      <p className="text-sm font-medium">{activity.project}</p>
                      <Badge
                        variant={
                          activity.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {activity.status === "completed" && (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {activity.status === "processing" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {activity.status === "failed" && (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {activity.details}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity to display</p>
                <p className="text-xs">
                  Start using the enabled modules to see activity here
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Completion Chart */}
      {dashboardData.charts.projectCompletion.some(
        (item) => item.completed > 0 || item.active > 0
      ) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Project Summary
            </CardTitle>
            <CardDescription>
              Completed and active projects over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center">
              {dashboardData.charts.projectCompletion.map((day) => (
                <div key={day.name} className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    {day.name}
                  </div>
                  <div className="space-y-1">
                    <div
                      className="bg-green-200 dark:bg-green-800 rounded text-xs py-1"
                      title={`${day.completed} completed`}
                    >
                      {day.completed}
                    </div>
                    <div
                      className="bg-blue-200 dark:bg-blue-800 rounded text-xs py-1"
                      title={`${day.active} active`}
                    >
                      {day.active}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800 rounded"></div>
                <span>Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
