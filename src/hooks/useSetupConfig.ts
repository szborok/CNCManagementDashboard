import { useState, useEffect } from "react";
import { SetupProcessor } from "../services/SetupProcessor";

export interface SetupConfig {
  isConfigured: boolean;
  demoMode: boolean;
  companyName: string;
  companyLogo?: string;
  companyFeatures: {
    jsonScanner: boolean;
    toolManager: boolean;
    clampingPlateManager: boolean;
  };
  modules: {
    jsonAnalyzer: {
      enabled: boolean;
      mode: "auto" | "manual";
      dataPath: string;
      autoProcessing: boolean;
    };
    matrixTools: {
      enabled: boolean;
      mode: "auto" | "manual";
      dataPath: string;
      inventoryFile: string;
      features: {
        excelProcessing: boolean;
        jsonScanning: boolean;
      };
      paths: {
        excelInputPath: string;
        jsonInputPath: string;
      };
    };
    platesManager: {
      enabled: boolean;
      mode: "auto" | "manual";
      modelsPath?: string;
      plateInfoFile?: string;
      dataPath?: string;
      plateDatabase?: string;
    };
  };
  authentication: {
    method: "file" | "database" | "ldap";
    employeeFile?: string;
    databaseConnection?: string;
    ldapServer?: string;
  };
  storage: {
    mode: "simple" | "advanced";
    basePath?: string;
    logsPath: string;
    backupPath: string;
    tempPath: string;
    outputPath: string;
    jsonFoundPath?: string;
    jsonFixedPath?: string;
    resultFilesPath?: string;
  };
  features: {
    themeMode: "light" | "dark" | "system";
    notifications: {
      enabled: boolean;
      showTaskCompletion: boolean;
      showErrors: boolean;
      showWarnings: boolean;
      showSystemUpdates: boolean;
    };
    autoBackup: boolean;
    exportReports: boolean;
    autoScan: {
      enabled: boolean;
      interval: number; // in minutes: 15, 30, 60, 120, 240 (4 hours), 480 (8 hours), 720 (12 hours), 1440 (daily)
      jsonScannerEnabled: boolean;
      toolManagerEnabled: boolean;
      runOnStartup: boolean;
    };
  };
}

const defaultConfig: SetupConfig = {
  isConfigured: false,
  demoMode: true, // Enable demo mode by default for easier testing
  companyName: "BRK Manufacturing",
  companyFeatures: {
    jsonScanner: true,
    toolManager: true,
    clampingPlateManager: true,
  },
  modules: {
    jsonAnalyzer: {
      enabled: false,
      mode: "auto",
      dataPath: "",
      autoProcessing: true,
    },
    matrixTools: {
      enabled: false,
      mode: "auto",
      dataPath: "",
      inventoryFile: "",
      features: {
        excelProcessing: true,
        jsonScanning: true,
      },
      paths: {
        excelInputPath: "",
        jsonInputPath: "",
      },
    },
    platesManager: {
      enabled: false,
      mode: "auto",
      modelsPath: "",
      plateInfoFile: "",
      dataPath: "",
      plateDatabase: "",
    },
  },
  authentication: {
    method: "file",
    employeeFile: "",
  },
  storage: {
    mode: "simple",
    basePath: "",
    logsPath: "",
    backupPath: "",
    tempPath: "",
    outputPath: "",
    jsonFoundPath: "",
    jsonFixedPath: "",
    resultFilesPath: "",
  },
  features: {
    themeMode: "system",
    notifications: {
      enabled: true,
      showTaskCompletion: true,
      showErrors: true,
      showWarnings: true,
      showSystemUpdates: false,
    },
    autoBackup: true,
    exportReports: true,
    autoScan: {
      enabled: false,
      interval: 60, // 1 hour default
      jsonScannerEnabled: true,
      toolManagerEnabled: true,
      runOnStartup: false,
    },
  },
};

export function useSetupConfig() {
  const [config, setConfig] = useState<SetupConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      // 1. First check if filesystem config exists via backend
      try {
        const response = await fetch('http://localhost:3001/api/config');
        if (response.ok) {
          const systemConfig = await response.json();
          if (systemConfig && systemConfig.isConfigured) {
            console.log("✅ Loaded config from filesystem (via backend)");
            setConfig({ ...defaultConfig, ...systemConfig });
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.log("⚠️ Filesystem config not found, checking localStorage");
      }

      // 2. Fall back to localStorage only if no filesystem config
      const savedConfig = localStorage.getItem("cncDashboardConfig");
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        console.log("⚠️ Using localStorage config (consider migrating to filesystem)");
        setConfig({ ...defaultConfig, ...parsedConfig });
      }
    } catch (error) {
      console.error("Failed to load configuration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (newConfig: SetupConfig) => {
    try {
      console.log("💾 Saving configuration and processing setup...");

      // Mark as configured when saving
      const configWithStatus = {
        ...newConfig,
        isConfigured: true,
        configVersion: "1.0.0"
      };

      // 1. Save configuration to localStorage (for Dashboard)
      localStorage.setItem("cncDashboardConfig", JSON.stringify(configWithStatus));

      // 2. Save configuration to filesystem (for backend services)
      try {
        const configData = JSON.stringify(configWithStatus, null, 2);
        const blob = new Blob([configData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'brk-cnc-system.config.json';
        a.click();
        URL.revokeObjectURL(url);
        console.log("✅ Configuration file downloaded - place it in your BRK_CNC_CORE folder");
      } catch (err) {
        console.warn("⚠️ Could not download config file", err);
      }

      // 3. Process the setup (create files, directories, sample data)
      const processor = new SetupProcessor(configWithStatus);
      const result = await processor.processSetup();

      if (result.success) {
        console.log("✅ Setup processing completed:", result.message);
        console.log("📋 Details:", result.details);

        // 4. Update state with configured flag
        setConfig(configWithStatus);

        // 5. Show success notification (could be enhanced with a toast notification)
        if (result.details) {
          console.log(
            "📁 Directories created:",
            result.details.directoriesCreated
          );
          console.log(
            "⚙️ Modules configured:",
            result.details.modulesConfigured
          );
          console.log("👥 Employee file:", result.details.employeeFile);
        }

        return true;
      } else {
        console.error("❌ Setup processing failed:", result.message);
        // Still save config but show warning
        setConfig(configWithStatus);
        return false;
      }
    } catch (error) {
      console.error("Failed to save configuration:", error);
      return false;
    }
  };

  const resetConfig = () => {
    // Clear both the main config and wizard progress
    localStorage.removeItem("cncDashboardConfig");
    localStorage.removeItem("setupWizardStep");
    localStorage.removeItem("setupWizardProgress");
    setConfig(defaultConfig);
  };

  return {
    config,
    isLoading,
    saveConfig,
    resetConfig,
    isFirstTimeSetup: !config.isConfigured,
  };
}
