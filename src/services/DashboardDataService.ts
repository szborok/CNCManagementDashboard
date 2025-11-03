export interface DashboardData {
  overview: {
    totalProjects: number;
    activeProjects: number;
    completedToday: number;
    toolsInUse: number;
    lastUpdate: string;
  };
  recentActivity: Array<{
    id: number;
    type: 'json_analysis' | 'tool_inventory' | 'plate_management';
    project: string;
    status: 'completed' | 'processing' | 'failed';
    timestamp: string;
    details: string;
  }>;
  charts: {
    projectCompletion: Array<{
      name: string;
      completed: number;
      active: number;
    }>;
    toolUsage: Array<{
      category: string;
      count: number;
      percentage: number;
    }>;
  };
  modules: {
    jsonScanner: {
      status: 'active' | 'disabled';
      lastScan: string | null;
      filesProcessed: number;
    };
    toolManager: {
      status: 'active' | 'disabled';
      lastUpdate: string | null;
      toolsTracked: number;
    };
    clampingPlateManager: {
      status: 'active' | 'disabled';
      lastUpdate: string | null;
      platesManaged: number;
    };
  };
}

export class DashboardDataService {
  static async loadDashboardData(): Promise<DashboardData | null> {
    try {
      const storedData = localStorage.getItem('dashboardData');
      if (storedData) {
        return JSON.parse(storedData);
      }
      return null;
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      return null;
    }
  }

  static async loadEmployeeData(): Promise<any[]> {
    try {
      const storedData = localStorage.getItem('employeeData');
      if (storedData) {
        return JSON.parse(storedData);
      }
      return [];
    } catch (error) {
      console.error('Failed to load employee data:', error);
      return [];
    }
  }

  static async loadModuleConfigs(): Promise<any> {
    try {
      const storedData = localStorage.getItem('moduleConfigs');
      if (storedData) {
        return JSON.parse(storedData);
      }
      return {};
    } catch (error) {
      console.error('Failed to load module configs:', error);
      return {};
    }
  }

  static generateFallbackData(): DashboardData {
    const now = new Date();
    
    return {
      overview: {
        totalProjects: 0,
        activeProjects: 0,
        completedToday: 0,
        toolsInUse: 0,
        lastUpdate: now.toISOString()
      },
      recentActivity: [
        {
          id: 1,
          type: 'json_analysis',
          project: 'Setup Complete',
          status: 'completed',
          timestamp: now.toISOString(),
          details: 'CNC Management Dashboard has been configured and is ready to use'
        }
      ],
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
        toolUsage: []
      },
      modules: {
        jsonScanner: {
          status: 'disabled',
          lastScan: null,
          filesProcessed: 0
        },
        toolManager: {
          status: 'disabled',
          lastUpdate: null,
          toolsTracked: 0
        },
        clampingPlateManager: {
          status: 'disabled',
          lastUpdate: null,
          platesManaged: 0
        }
      }
    };
  }

  static async refreshData(): Promise<void> {
    // This would typically fetch fresh data from the actual applications
    // For now, we'll simulate some data updates
    const currentData = await this.loadDashboardData();
    if (currentData) {
      // Update timestamps and add some variation
      currentData.overview.lastUpdate = new Date().toISOString();
      
      // Simulate some activity
      const newActivity = {
        id: Date.now(),
        type: 'json_analysis' as const,
        project: 'Data Refresh',
        status: 'completed' as const,
        timestamp: new Date().toISOString(),
        details: 'Dashboard data refreshed successfully'
      };
      
      currentData.recentActivity.unshift(newActivity);
      
      // Keep only last 10 activities
      if (currentData.recentActivity.length > 10) {
        currentData.recentActivity = currentData.recentActivity.slice(0, 10);
      }
      
      localStorage.setItem('dashboardData', JSON.stringify(currentData));
    }
  }

  static async updateModuleStatus(module: keyof DashboardData['modules'], status: 'active' | 'disabled'): Promise<void> {
    const currentData = await this.loadDashboardData();
    if (currentData) {
      currentData.modules[module].status = status;
      if (status === 'active') {
        const timestamp = new Date().toISOString();
        if (module === 'jsonScanner') {
          currentData.modules.jsonScanner.lastScan = timestamp;
        } else if (module === 'toolManager') {
          currentData.modules.toolManager.lastUpdate = timestamp;
        } else if (module === 'clampingPlateManager') {
          currentData.modules.clampingPlateManager.lastUpdate = timestamp;
        }
      }
      localStorage.setItem('dashboardData', JSON.stringify(currentData));
    }
  }
}