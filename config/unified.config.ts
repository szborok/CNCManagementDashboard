/**
 * Unified Configuration for CNC Management Dashboard
 * Coordinates all modules and provides centralized settings
 */

export interface ModuleConfig {
  enabled: boolean;
  port: number;
  dataPath: string;
  apiPath: string;
}

export interface UnifiedConfig {
  dashboard: {
    port: number;
    title: string;
    version: string;
    env: "development" | "production" | "test";
  };
  modules: {
    jsonScanner: ModuleConfig;
    toolManager: ModuleConfig;
    clampingPlateManager: ModuleConfig;
  };
  database: {
    url: string;
    type: "sqlite" | "postgresql" | "mysql";
  };
  storage: {
    basePath: string;
    logsPath: string;
    backupPath: string;
  };
  features: {
    downloadTestData: boolean;
    autoBackup: boolean;
    realTimeSync: boolean;
  };
}

export const defaultConfig: UnifiedConfig = {
  dashboard: {
    port: 3000,
    title: "CNC Management Dashboard",
    version: "1.0.0",
    env: "development",
  },
  modules: {
    jsonScanner: {
      enabled: true,
      port: 3001,
      dataPath: "./modules/JSONScanner/test_data",
      apiPath: "/api/v1/json-scanner",
    },
    toolManager: {
      enabled: true,
      port: 3002,
      dataPath: "./modules/ToolManager/test_data",
      apiPath: "/api/v1/tool-manager",
    },
    clampingPlateManager: {
      enabled: true,
      port: 3003,
      dataPath: "./modules/ClampingPlateManager/test_data",
      apiPath: "/api/v1/clamping-plate",
    },
  },
  database: {
    url: "./data/cnc_management.db",
    type: "sqlite",
  },
  storage: {
    basePath: "./cnc_management_data",
    logsPath: "./logs",
    backupPath: "./backups",
  },
  features: {
    downloadTestData: true,
    autoBackup: true,
    realTimeSync: true,
  },
};

/**
 * Configuration manager for the unified system
 */
class ConfigManager {
  private config: UnifiedConfig;

  constructor(customConfig?: Partial<UnifiedConfig>) {
    this.config = { ...defaultConfig, ...customConfig };
  }

  /**
   * Get the full configuration
   */
  getConfig(): UnifiedConfig {
    return this.config;
  }

  /**
   * Get configuration for a specific module
   */
  getModuleConfig(module: keyof UnifiedConfig["modules"]): ModuleConfig {
    return this.config.modules[module];
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<UnifiedConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Check if a module is enabled
   */
  isModuleEnabled(module: keyof UnifiedConfig["modules"]): boolean {
    return this.config.modules[module].enabled;
  }

  /**
   * Get API endpoints for all enabled modules
   */
  getApiEndpoints(): Record<string, string> {
    const endpoints: Record<string, string> = {};

    Object.entries(this.config.modules).forEach(([name, config]) => {
      if (config.enabled) {
        endpoints[name] = `http://localhost:${config.port}${config.apiPath}`;
      }
    });

    return endpoints;
  }

  /**
   * Generate module-specific configurations
   */
  generateModuleConfigs(): Record<string, any> {
    return {
      jsonScanner: {
        mode:
          this.config.dashboard.env === "production" ? "production" : "test",
        paths: {
          testDataPath: this.config.modules.jsonScanner.dataPath,
          productionDataPath: `${this.config.storage.basePath}/JSONScanner`,
        },
        api: {
          port: this.config.modules.jsonScanner.port,
          basePath: this.config.modules.jsonScanner.apiPath,
        },
      },
      toolManager: {
        app: {
          testMode: this.config.dashboard.env !== "production",
        },
        paths: {
          test: {
            testDataPath: this.config.modules.toolManager.dataPath,
            filesToProcess: `${this.config.modules.toolManager.dataPath}/filesToProcess`,
            filesProcessed: `${this.config.modules.toolManager.dataPath}/filesProcessedArchive`,
          },
          production: {
            filesToProcess: `${this.config.storage.basePath}/tool_manager/filesToProcess`,
            filesProcessed: `${this.config.storage.basePath}/tool_manager/filesProcessed`,
          },
        },
        api: {
          port: this.config.modules.toolManager.port,
          basePath: this.config.modules.toolManager.apiPath,
        },
      },
      clampingPlateManager: {
        storage: {
          type: this.config.database.type,
          url: this.config.database.url,
        },
        paths: {
          testDataPath: this.config.modules.clampingPlateManager.dataPath,
          productionDataPath: `${this.config.storage.basePath}/clamping_plates`,
        },
        api: {
          port: this.config.modules.clampingPlateManager.port,
          basePath: this.config.modules.clampingPlateManager.apiPath,
        },
      },
    };
  }

  /**
   * Get module configuration as JSON string
   */
  getModuleConfigJson(module: keyof UnifiedConfig["modules"]): string {
    const moduleConfigs = this.generateModuleConfigs();
    return JSON.stringify(moduleConfigs[module], null, 2);
  }
}

export default ConfigManager;
