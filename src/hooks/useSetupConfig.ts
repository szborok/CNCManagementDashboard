import { useState, useEffect } from 'react';
import { SetupProcessor } from '../services/SetupProcessor';

export interface SetupConfig {
  isConfigured: boolean;
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
      mode: 'auto' | 'manual';
      dataPath: string;
      autoProcessing: boolean;
    };
    matrixTools: {
      enabled: boolean;
      mode: 'auto' | 'manual';
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
      mode: 'auto' | 'manual';
      dataPath: string;
      plateDatabase: string;
    };
  };
  authentication: {
    method: 'file' | 'database' | 'ldap';
    employeeFile?: string;
    databaseConnection?: string;
    ldapServer?: string;
  };
  storage: {
    basePath?: string;
    logsPath: string;
    backupPath: string;
    tempPath: string;
    outputPath: string;
  };
  features: {
    darkMode: boolean;
    notifications: boolean;
    autoBackup: boolean;
    exportReports: boolean;
  };
}

const defaultConfig: SetupConfig = {
  isConfigured: false,
  companyName: '',
  companyFeatures: {
    jsonScanner: true,
    toolManager: true,
    clampingPlateManager: true,
  },
  modules: {
    jsonAnalyzer: {
      enabled: true,
      mode: 'auto',
      dataPath: '',
      autoProcessing: true,
    },
    matrixTools: {
      enabled: true,
      mode: 'auto',
      dataPath: '',
      inventoryFile: '',
      features: {
        excelProcessing: true,
        jsonScanning: true,
      },
      paths: {
        excelInputPath: '',
        jsonInputPath: '',
      },
    },
    platesManager: {
      enabled: true,
      mode: 'auto',
      dataPath: '',
      plateDatabase: '',
    },
  },
  authentication: {
    method: 'file',
    employeeFile: '',
  },
  storage: {
    basePath: '',
    logsPath: '',
    backupPath: '',
    tempPath: '',
    outputPath: '',
  },
  features: {
    darkMode: false,
    notifications: true,
    autoBackup: true,
    exportReports: true,
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
      const savedConfig = localStorage.getItem('cncDashboardConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig({ ...defaultConfig, ...parsedConfig });
      }
    } catch (error) {
      console.error('Failed to load configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (newConfig: SetupConfig) => {
    try {
      console.log('💾 Saving configuration and processing setup...');
      
      // 1. Save configuration to localStorage
      localStorage.setItem('cncDashboardConfig', JSON.stringify(newConfig));
      
      // 2. Process the setup (create files, directories, sample data)
      const processor = new SetupProcessor(newConfig);
      const result = await processor.processSetup();
      
      if (result.success) {
        console.log('✅ Setup processing completed:', result.message);
        console.log('📋 Details:', result.details);
        
        // 3. Update state
        setConfig(newConfig);
        
        // 4. Show success notification (could be enhanced with a toast notification)
        if (result.details) {
          console.log('📁 Directories created:', result.details.directoriesCreated);
          console.log('⚙️ Modules configured:', result.details.modulesConfigured);
          console.log('👥 Employee file:', result.details.employeeFile);
        }
        
        return true;
      } else {
        console.error('❌ Setup processing failed:', result.message);
        // Still save config but show warning
        setConfig(newConfig);
        return false;
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
      return false;
    }
  };

  const resetConfig = () => {
    localStorage.removeItem('cncDashboardConfig');
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