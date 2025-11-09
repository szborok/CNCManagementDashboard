/**
 * Demo Mode Configuration
 *
 * When running in demo mode (npm run demo), the setup wizard will auto-populate
 * with test data paths from the backend modules.
 */

import { SetupConfig } from "../hooks/useSetupConfig";

// @ts-ignore - Vite env variables
export const isDemoMode = import.meta.env?.VITE_DEMO_MODE === "true";

export const demoConfig: Partial<SetupConfig> = {
  demoMode: true,
  companyName: "BRK Manufacturing (Demo)",
  companyLogo: "",
  companyFeatures: {
    jsonScanner: true,
    toolManager: true,
    clampingPlateManager: true,
  },
  modules: {
    jsonAnalyzer: {
      enabled: true,
      mode: "auto",
      dataPath: "../JSONScanner/data/test_source_data",
      autoProcessing: true,
    },
    matrixTools: {
      enabled: true,
      mode: "auto",
      dataPath: "../ToolManager/data/test_source_data",
      inventoryFile:
        "../ToolManager/data/test_source_data/testExcel/Euroform_Matrix_2024-01-15.xlsx",
      features: {
        excelProcessing: true,
        jsonScanning: true,
      },
      paths: {
        excelInputPath: "../ToolManager/data/test_source_data/testExcel",
        jsonInputPath: "../JSONScanner/data/test_source_data",
      },
    },
    platesManager: {
      enabled: true,
      mode: "auto",
      modelsPath: "../ClampingPlateManager/data/test_source_data",
      plateInfoFile:
        "../ClampingPlateManager/data/test_source_data/Készülékek.xlsx",
    },
  },
  authentication: {
    method: "file",
    employeeFile: "./test_data/employees.json",
  },
  storage: {
    mode: "simple",
    basePath: "./data",
    logsPath: "./logs",
    backupPath: "./backups",
    tempPath: "./temp",
    outputPath: "./output",
  },
  features: {
    themeMode: "system",
    notifications: {
      enabled: true,
      showTaskCompletion: true,
      showErrors: true,
      showWarnings: true,
      showSystemUpdates: true,
    },
    autoBackup: true,
    exportReports: true,
    autoScan: {
      enabled: true,
      interval: 60, // 1 hour
      jsonScannerEnabled: true,
      toolManagerEnabled: true,
      runOnStartup: false,
    },
  },
};

export function getDemoMessage(): string {
  return `🎭 Demo Mode Active - Setup wizard is pre-populated with test data paths. You can explore the system without configuring real data sources.`;
}
