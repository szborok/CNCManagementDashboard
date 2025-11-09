/**
 * Backend Data Loader
 * 
 * This service attempts to load real data from the backend modules (JSONScanner, ToolManager, ClampingPlateManager)
 * by importing their result files if they exist.
 */

import { DashboardData } from './DashboardDataService';

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
  status: 'passed' | 'failed' | 'warning';
}

export interface ToolManagerResult {
  tools: Array<{
    id: string;
    name: string;
    status: 'in_use' | 'available' | 'IN_MATRIX' | 'NOT_IN_MATRIX';
    isMatrix: boolean;
    usageTime?: number;
    usageCount?: number;
    projectCount?: number;
  }>;
}

export interface ClampingPlateResult {
  plates: Array<{
    id: string;
    plateNumber: string;
    isLocked: boolean;
    workHistory?: string;
    workProjects?: string[];
  }>;
}

export class BackendDataLoader {
  /**
   * Try to load JSONScanner results
   */
  static async loadJSONScannerData(): Promise<JSONScannerResult[] | null> {
    try {
      // Try to import from the test_data location if available
      const storedData = localStorage.getItem('jsonScannerResults');
      if (storedData) {
        return JSON.parse(storedData);
      }
      return null;
    } catch (error) {
      console.warn('Could not load JSONScanner data:', error);
      return null;
    }
  }

  /**
   * Try to load ToolManager results
   */
  static async loadToolManagerData(): Promise<ToolManagerResult | null> {
    try {
      const storedData = localStorage.getItem('toolManagerResults');
      if (storedData) {
        return JSON.parse(storedData);
      }
      return null;
    } catch (error) {
      console.warn('Could not load ToolManager data:', error);
      return null;
    }
  }

  /**
   * Try to load ClampingPlateManager results
   */
  static async loadClampingPlateData(): Promise<ClampingPlateResult | null> {
    try {
      const storedData = localStorage.getItem('clampingPlateResults');
      if (storedData) {
        return JSON.parse(storedData);
      }
      return null;
    } catch (error) {
      console.warn('Could not load ClampingPlateManager data:', error);
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
      return null;
    }

    const now = new Date();

    // Build overview statistics
    const overview = {
      totalProjects: (jsonScannerData?.length || 0),
      activeProjects: jsonScannerData?.filter(r => r.status === 'passed').length || 0,
      completedToday: 0, // Would need date filtering
      toolsInUse: toolManagerData?.tools.filter(t => t.status === 'in_use').length || 0,
      lastUpdate: now.toISOString()
    };

    // Build recent activity from all sources
    const recentActivity: DashboardData['recentActivity'] = [];

    // Add JSON Scanner activities
    if (jsonScannerData && jsonScannerData.length > 0) {
      jsonScannerData.slice(0, 5).forEach((result, index) => {
        recentActivity.push({
          id: index + 1000,
          type: 'json_analysis',
          project: result.filename,
          status: result.status === 'passed' ? 'completed' : result.status === 'failed' ? 'failed' : 'processing',
          timestamp: result.processedAt,
          details: `${result.results.rulesApplied.length} rules applied, ${result.results.violations.length} violations found`
        });
      });
    }

    // Add Tool Manager activities
    if (toolManagerData && toolManagerData.tools.length > 0) {
      const inUseTools = toolManagerData.tools.filter(t => t.status === 'in_use');
      if (inUseTools.length > 0) {
        recentActivity.push({
          id: 2000,
          type: 'tool_inventory',
          project: 'Tool Inventory Update',
          status: 'completed',
          timestamp: now.toISOString(),
          details: `${inUseTools.length} tools currently in use, ${toolManagerData.tools.length} total tools tracked`
        });
      }
    }

    // Add Clamping Plate activities
    if (clampingPlateData && clampingPlateData.plates.length > 0) {
      const lockedPlates = clampingPlateData.plates.filter(p => p.isLocked);
      recentActivity.push({
        id: 3000,
        type: 'plate_management',
        project: 'Plate Inventory Status',
        status: 'completed',
        timestamp: now.toISOString(),
        details: `${clampingPlateData.plates.length} plates managed, ${lockedPlates.length} currently locked`
      });
    }

    // Sort by timestamp
    recentActivity.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Build charts data
    const toolUsageByMatrix = toolManagerData?.tools.reduce((acc, tool) => {
      const category = tool.isMatrix ? 'Matrix Tools' : 'Non-Matrix Tools';
      const existing = acc.find(item => item.category === category);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ category, count: 1, percentage: 0 });
      }
      return acc;
    }, [] as Array<{ category: string; count: number; percentage: number }>);

    // Calculate percentages
    const totalTools = toolUsageByMatrix?.reduce((sum, item) => sum + item.count, 0) || 0;
    toolUsageByMatrix?.forEach(item => {
      item.percentage = totalTools > 0 ? Math.round((item.count / totalTools) * 100) : 0;
    });

    return {
      overview,
      recentActivity: recentActivity.slice(0, 10), // Keep last 10
      charts: {
        projectCompletion: [
          { name: 'Mon', completed: 0, active: 0 },
          { name: 'Tue', completed: 0, active: 0 },
          { name: 'Wed', completed: 0, active: 0 },
          { name: 'Thu', completed: 0, active: 0 },
          { name: 'Fri', completed: 0, active: 0 },
          { name: 'Sat', completed: 0, active: 0 },
          { name: 'Sun', completed: 0, active: 0 }
        ],
        toolUsage: toolUsageByMatrix || []
      },
      modules: {
        jsonScanner: {
          status: jsonScannerData && jsonScannerData.length > 0 ? 'active' : 'disabled',
          lastScan: jsonScannerData && jsonScannerData.length > 0 ? jsonScannerData[0].processedAt : null,
          filesProcessed: jsonScannerData?.length || 0
        },
        toolManager: {
          status: toolManagerData && toolManagerData.tools.length > 0 ? 'active' : 'disabled',
          lastUpdate: toolManagerData ? now.toISOString() : null,
          toolsTracked: toolManagerData?.tools.length || 0
        },
        clampingPlateManager: {
          status: clampingPlateData && clampingPlateData.plates.length > 0 ? 'active' : 'disabled',
          lastUpdate: clampingPlateData ? now.toISOString() : null,
          platesManaged: clampingPlateData?.plates.length || 0
        }
      }
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
        const existing = await this.loadJSONScannerData() || [];
        existing.push(data);
        localStorage.setItem('jsonScannerResults', JSON.stringify(existing));
      } else if (Array.isArray(data)) {
        // Array of results
        localStorage.setItem('jsonScannerResults', JSON.stringify(data));
      } else {
        throw new Error('Invalid JSONScanner result format');
      }
    } catch (error) {
      console.error('Failed to import JSONScanner results:', error);
      throw error;
    }
  }

  static async importToolManagerResults(file: File): Promise<void> {
    try {
      const content = await file.text();
      const data = JSON.parse(content);
      
      // Validate it's ToolManager format
      if (data.tools && Array.isArray(data.tools)) {
        localStorage.setItem('toolManagerResults', JSON.stringify(data));
      } else {
        throw new Error('Invalid ToolManager result format');
      }
    } catch (error) {
      console.error('Failed to import ToolManager results:', error);
      throw error;
    }
  }

  static async importClampingPlateResults(file: File): Promise<void> {
    try {
      const content = await file.text();
      const data = JSON.parse(content);
      
      // Validate it's ClampingPlate format
      if (data.plates && Array.isArray(data.plates)) {
        localStorage.setItem('clampingPlateResults', JSON.stringify(data));
      } else {
        throw new Error('Invalid ClampingPlate result format');
      }
    } catch (error) {
      console.error('Failed to import ClampingPlate results:', error);
      throw error;
    }
  }
}
