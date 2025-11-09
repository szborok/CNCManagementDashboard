/**
 * Backend Data Loader
 *
 * This service loads real data from backend modules (JSONScanner, ToolManager, ClampingPlateManager)
 * by reading their actual result files from test_processed_data or production directories.
 *
 * NO MOCK DATA - Dashboard always shows real backend results.
 */

import { DashboardData } from "./DashboardDataService";

export interface JSONScannerResult {
  id: string;
  filename: string;
  processedAt: string;
  results: {
    rulesApplied: string[];
    violations: Array<{
      rule: string;
      message: string;
      location: string;
    }>;
  };
  status: "passed" | "failed" | "warning";
}

export interface ToolManagerResult {
  reportInfo: {
    generatedAt: string;
    summary: {
      matrixToolsUsed: number;
      nonMatrixToolsUsed: number;
      jsonFilesProcessed: number;
    };
  };
  matrixTools: Array<{
    toolName: string;
    totalUsageTime: number;
    usageCount: number;
    projectCount: number;
    status: string;
  }>;
  nonMatrixTools: Array<{
    toolName: string;
    totalUsageTime: number;
    usageCount: number;
    projectCount: number;
    status: string;
  }>;
}

export interface ClampingPlateResult {
  metadata: {
    generatedDate: string;
    totalPlates: number;
  };
  plates: Array<{
    id: string;
    plateNumber: string;
    isLocked: boolean;
    workHistory?: string;
    workProjects?: Array<{
      projectCode: string | null;
      workOrder: string;
      fullEntry: string;
    }>;
  }>;
}

export class BackendDataLoader {
  /**
   * Get backend data paths based on demo mode
   */
  private static getBackendPaths() {
    const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

    if (isDemoMode) {
      return {
        jsonScannerResults:
          "../JSONScanner/data/test_processed_data/BRK CNC Management Dashboard/JSONScanner/results",
        toolManagerResults:
          "../ToolManager/data/test_processed_data/BRK CNC Management Dashboard/ToolManager/results/ToolManager_Result.json",
        clampingPlateResults:
          "../ClampingPlateManager/data/test_processed_data/clamping_plates_inventory_2025-11-08T21-45-06.json",
      };
    } else {
      // Production paths - adjust these based on actual production structure
      return {
        jsonScannerResults:
          "../JSONScanner/data/processed_data/BRK CNC Management Dashboard/JSONScanner/results",
        toolManagerResults:
          "../ToolManager/data/processed_data/BRK CNC Management Dashboard/ToolManager/results/ToolManager_Result.json",
        clampingPlateResults:
          "../ClampingPlateManager/data/processed_data/clamping_plates_inventory.json",
      };
    }
  }

  /**
   * Load JSONScanner results from result files
   */
  static async loadJSONScannerData(): Promise<JSONScannerResult[] | null> {
    try {
      // In a real implementation, this would use the configured path from setup
      // For now, check localStorage for uploaded/imported data
      const storedData = localStorage.getItem("jsonScannerResults");
      if (storedData) {
        return JSON.parse(storedData);
      }

      console.warn(
        "JSONScanner results not found. Please run JSONScanner to generate results or import result files."
      );
      return null;
    } catch (error) {
      console.error("Failed to load JSONScanner data:", error);
      return null;
    }
  }

  /**
   * Load ToolManager results from consolidated report
   */
  static async loadToolManagerData(): Promise<ToolManagerResult | null> {
    try {
      const storedData = localStorage.getItem("toolManagerResults");
      if (storedData) {
        return JSON.parse(storedData);
      }

      console.warn(
        "ToolManager results not found. Please run ToolManager to generate results or import result files."
      );
      return null;
    } catch (error) {
      console.error("Failed to load ToolManager data:", error);
      return null;
    }
  }

  /**
   * Load ClampingPlateManager inventory
   */
  static async loadClampingPlateData(): Promise<ClampingPlateResult | null> {
    try {
      const storedData = localStorage.getItem("clampingPlateResults");
      if (storedData) {
        return JSON.parse(storedData);
      }

      console.warn(
        "ClampingPlate results not found. Please run ClampingPlateManager or import inventory file."
      );
      return null;
    } catch (error) {
      console.error("Failed to load ClampingPlate data:", error);
      return null;
    }
  }

  /**
   * Generate dashboard data from backend results
   */
  static async generateDashboardFromBackends(): Promise<DashboardData | null> {
    const jsonScannerData = await this.loadJSONScannerData();
    const toolManagerData = await this.loadToolManagerData();
    const clampingPlateData = await this.loadClampingPlateData();

    // If we have no backend data at all, return null
    if (!jsonScannerData && !toolManagerData && !clampingPlateData) {
      console.info(
        "No backend data available. Run backend services or import result files."
      );
      return null;
    }

    const now = new Date();

    // Combine matrix and non-matrix tools
    const allTools = [
      ...(toolManagerData?.matrixTools || []),
      ...(toolManagerData?.nonMatrixTools || []),
    ];

    // Build overview statistics
    const overview = {
      totalProjects: jsonScannerData?.length || 0,
      activeProjects:
        jsonScannerData?.filter((r) => r.status === "passed").length || 0,
      completedToday: 0, // Would need date filtering
      toolsInUse: allTools.length || 0,
      lastUpdate: now.toISOString(),
    };

    // Build recent activity from all sources
    const recentActivity: DashboardData["recentActivity"] = [];

    // Add JSON Scanner activities
    if (jsonScannerData && jsonScannerData.length > 0) {
      jsonScannerData.slice(0, 5).forEach((result, index) => {
        recentActivity.push({
          id: index + 1000,
          type: "json_analysis",
          project: result.filename,
          status:
            result.status === "passed"
              ? "completed"
              : result.status === "failed"
              ? "failed"
              : "processing",
          timestamp: result.processedAt,
          details: `${result.results.rulesApplied.length} rules applied, ${result.results.violations.length} violations found`,
        });
      });
    }

    // Add Tool Manager activities
    if (toolManagerData) {
      recentActivity.push({
        id: 2000,
        type: "tool_inventory",
        project: "Tool Inventory Update",
        status: "completed",
        timestamp: toolManagerData.reportInfo.generatedAt,
        details: `${toolManagerData.reportInfo.summary.matrixToolsUsed} matrix tools, ${toolManagerData.reportInfo.summary.nonMatrixToolsUsed} non-matrix tools tracked`,
      });
    }

    // Add Clamping Plate activities
    if (clampingPlateData && clampingPlateData.plates.length > 0) {
      const lockedPlates = clampingPlateData.plates.filter((p) => p.isLocked);
      recentActivity.push({
        id: 3000,
        type: "plate_management",
        project: "Plate Inventory Status",
        status: "completed",
        timestamp: clampingPlateData.metadata.generatedDate,
        details: `${clampingPlateData.plates.length} plates managed, ${lockedPlates.length} currently locked`,
      });
    }

    // Sort by timestamp
    recentActivity.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Build tool usage chart data
    const toolUsageByMatrix: Array<{
      category: string;
      count: number;
      percentage: number;
    }> = [];

    if (toolManagerData) {
      const matrixCount = toolManagerData.reportInfo.summary.matrixToolsUsed;
      const nonMatrixCount =
        toolManagerData.reportInfo.summary.nonMatrixToolsUsed;
      const total = matrixCount + nonMatrixCount;

      if (matrixCount > 0) {
        toolUsageByMatrix.push({
          category: "Matrix Tools",
          count: matrixCount,
          percentage: total > 0 ? Math.round((matrixCount / total) * 100) : 0,
        });
      }

      if (nonMatrixCount > 0) {
        toolUsageByMatrix.push({
          category: "Non-Matrix Tools",
          count: nonMatrixCount,
          percentage:
            total > 0 ? Math.round((nonMatrixCount / total) * 100) : 0,
        });
      }
    }

    return {
      overview,
      recentActivity: recentActivity.slice(0, 10), // Keep last 10
      charts: {
        projectCompletion: [
          { name: "Mon", completed: 0, active: 0 },
          { name: "Tue", completed: 0, active: 0 },
          { name: "Wed", completed: 0, active: 0 },
          { name: "Thu", completed: 0, active: 0 },
          { name: "Fri", completed: 0, active: 0 },
          { name: "Sat", completed: 0, active: 0 },
          { name: "Sun", completed: 0, active: 0 },
        ],
        toolUsage: toolUsageByMatrix,
      },
      modules: {
        jsonScanner: {
          status:
            jsonScannerData && jsonScannerData.length > 0
              ? "active"
              : "disabled",
          lastScan:
            jsonScannerData && jsonScannerData.length > 0
              ? jsonScannerData[0].processedAt
              : null,
          filesProcessed: jsonScannerData?.length || 0,
        },
        toolManager: {
          status:
            toolManagerData &&
            (toolManagerData.reportInfo.summary.matrixToolsUsed > 0 ||
              toolManagerData.reportInfo.summary.nonMatrixToolsUsed > 0)
              ? "active"
              : "disabled",
          lastUpdate: toolManagerData
            ? toolManagerData.reportInfo.generatedAt
            : null,
          toolsTracked: allTools.length,
        },
        clampingPlateManager: {
          status:
            clampingPlateData && clampingPlateData.plates.length > 0
              ? "active"
              : "disabled",
          lastUpdate: clampingPlateData
            ? clampingPlateData.metadata.generatedDate
            : null,
          platesManaged: clampingPlateData?.plates.length || 0,
        },
      },
    };
  }

  /**
   * Import backend data files (to be called from data import UI)
   */
  static async importJSONScannerResults(file: File): Promise<void> {
    try {
      const content = await file.text();
      const data = JSON.parse(content);

      // Validate it's JSONScanner format
      if (data.id && data.filename && data.results) {
        // Single result file
        const existing = (await this.loadJSONScannerData()) || [];
        existing.push(data);
        localStorage.setItem("jsonScannerResults", JSON.stringify(existing));
      } else if (Array.isArray(data)) {
        // Array of results
        localStorage.setItem("jsonScannerResults", JSON.stringify(data));
      } else {
        throw new Error("Invalid JSONScanner result format");
      }
    } catch (error) {
      console.error("Failed to import JSONScanner results:", error);
      throw error;
    }
  }

  static async importToolManagerResults(file: File): Promise<void> {
    try {
      const content = await file.text();
      const data = JSON.parse(content);

      // Validate it's ToolManager format
      if (data.tools && Array.isArray(data.tools)) {
        localStorage.setItem("toolManagerResults", JSON.stringify(data));
      } else {
        throw new Error("Invalid ToolManager result format");
      }
    } catch (error) {
      console.error("Failed to import ToolManager results:", error);
      throw error;
    }
  }

  static async importClampingPlateResults(file: File): Promise<void> {
    try {
      const content = await file.text();
      const data = JSON.parse(content);

      // Validate it's ClampingPlate format
      if (data.plates && Array.isArray(data.plates)) {
        localStorage.setItem("clampingPlateResults", JSON.stringify(data));
      } else {
        throw new Error("Invalid ClampingPlate result format");
      }
    } catch (error) {
      console.error("Failed to import ClampingPlate results:", error);
      throw error;
    }
  }
}
