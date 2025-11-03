import { SetupConfig } from '../hooks/useSetupConfig';

export class SetupProcessor {
  private config: SetupConfig;

  constructor(config: SetupConfig) {
    this.config = config;
  }

  async processSetup(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('🚀 Starting setup processing...');
      
      // 1. Create directory structure
      await this.createDirectories();
      
      // 2. Create employee file
      await this.createEmployeeFile();
      
      // 3. Create configuration files for each module
      await this.createModuleConfigs();
      
      // 4. Initialize data loading
      await this.initializeDataLoading();
      
      console.log('✅ Setup processing completed successfully');
      
      return {
        success: true,
        message: 'Setup completed successfully! Your CNC Management Dashboard is ready to use.',
        details: {
          directoriesCreated: this.getCreatedDirectories(),
          modulesConfigured: this.getConfiguredModules(),
          employeeFile: this.config.authentication.employeeFile
        }
      };
    } catch (error) {
      console.error('❌ Setup processing failed:', error);
      return {
        success: false,
        message: `Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      };
    }
  }

  private async createDirectories(): Promise<void> {
    const directories = this.getDirectoriesToCreate();
    
    console.log('📁 Creating directories:', directories);
    
    // In a real application, you would use Node.js fs module or Electron API
    // For now, we'll simulate this and show what would be created
    for (const dir of directories) {
      console.log(`Creating directory: ${dir}`);
      // await fs.mkdir(dir, { recursive: true });
    }
  }

  private async createEmployeeFile(): Promise<void> {
    if (this.config.authentication.method === 'file') {
      const employeeFilePath = this.config.authentication.employeeFile || './data/employees.json';
      
      const employeeTemplate = [
        {
          id: "emp001",
          name: "John Doe",
          email: "john.doe@company.com",
          role: "administrator",
          department: "IT",
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          id: "emp002", 
          name: "Jane Smith",
          email: "jane.smith@company.com",
          role: "operator",
          department: "Production",
          active: true,
          createdAt: new Date().toISOString()
        }
      ];

      console.log(`📄 Creating employee file: ${employeeFilePath}`);
      // await fs.writeFile(employeeFilePath, JSON.stringify(employeeTemplate, null, 2));
      
      // For demo purposes, store in localStorage
      localStorage.setItem('employeeData', JSON.stringify(employeeTemplate));
    }
  }

  private async createModuleConfigs(): Promise<void> {
    const moduleConfigs: any = {};

    // JSON Scanner configuration
    if (this.config.companyFeatures.jsonScanner) {
      moduleConfigs.jsonScanner = {
        enabled: true,
        mode: this.config.modules.jsonAnalyzer.mode,
        dataPath: this.config.modules.jsonAnalyzer.dataPath,
        outputPath: this.config.storage.outputPath + '/json_analysis',
        rules: ['AutoCorrectionContour', 'M110Contour', 'SingleToolInNC'],
        autoProcess: this.config.modules.jsonAnalyzer.mode === 'auto'
      };
    }

    // Tool Manager configuration  
    if (this.config.companyFeatures.toolManager) {
      moduleConfigs.toolManager = {
        enabled: true,
        mode: this.config.modules.matrixTools.mode,
        excelInputPath: this.config.modules.matrixTools.paths?.excelInputPath,
        jsonInputPath: this.config.companyFeatures.jsonScanner 
          ? this.config.modules.jsonAnalyzer.dataPath 
          : this.config.modules.matrixTools.paths?.jsonInputPath,
        outputPath: this.config.storage.outputPath + '/tool_analysis',
        autoProcess: this.config.modules.matrixTools.mode === 'auto'
      };
    }

    // Clamping Plate Manager configuration
    if (this.config.companyFeatures.clampingPlateManager) {
      moduleConfigs.clampingPlateManager = {
        enabled: true,
        modelPath: this.config.modules.platesManager.dataPath,
        plateDatabase: this.config.modules.platesManager.plateDatabase,
        outputPath: this.config.storage.outputPath + '/plate_analysis'
      };
    }

    console.log('⚙️ Creating module configurations:', moduleConfigs);
    localStorage.setItem('moduleConfigs', JSON.stringify(moduleConfigs));
  }

  private async initializeDataLoading(): Promise<void> {
    console.log('📊 Initializing data loading...');
    
    // Simulate loading sample data for dashboard
    const sampleData = this.generateSampleData();
    
    // Store sample data in localStorage for immediate dashboard population
    localStorage.setItem('dashboardData', JSON.stringify(sampleData));
    
    console.log('Sample data generated for dashboard');
  }

  private generateSampleData() {
    const now = new Date();
    
    return {
      overview: {
        totalProjects: 15,
        activeProjects: 8,
        completedToday: 3,
        toolsInUse: 142,
        lastUpdate: now.toISOString()
      },
      recentActivity: [
        {
          id: 1,
          type: 'json_analysis',
          project: 'W5270NS01001A',
          status: 'completed',
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          details: 'JSON analysis completed - 5 rules processed'
        },
        {
          id: 2,
          type: 'tool_inventory',
          project: 'Tool Matrix Update',
          status: 'processing',
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
          details: 'Processing Excel inventory file'
        },
        {
          id: 3,
          type: 'plate_management',
          project: 'Clamping Plate Database',
          status: 'completed',
          timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
          details: 'Updated plate information for 12 models'
        }
      ],
      charts: {
        projectCompletion: [
          { name: 'Mon', completed: 4, active: 2 },
          { name: 'Tue', completed: 3, active: 4 },
          { name: 'Wed', completed: 5, active: 3 },
          { name: 'Thu', completed: 2, active: 6 },
          { name: 'Fri', completed: 6, active: 1 },
          { name: 'Sat', completed: 1, active: 0 },
          { name: 'Sun', completed: 2, active: 2 }
        ],
        toolUsage: [
          { category: 'Drills', count: 45, percentage: 32 },
          { category: 'Mills', count: 38, percentage: 27 },
          { category: 'Taps', count: 29, percentage: 20 },
          { category: 'Reamers', count: 18, percentage: 13 },
          { category: 'Others', count: 12, percentage: 8 }
        ]
      },
      modules: {
        jsonScanner: {
          status: this.config.companyFeatures.jsonScanner ? 'active' : 'disabled',
          lastScan: this.config.companyFeatures.jsonScanner ? now.toISOString() : null,
          filesProcessed: this.config.companyFeatures.jsonScanner ? 23 : 0
        },
        toolManager: {
          status: this.config.companyFeatures.toolManager ? 'active' : 'disabled',
          lastUpdate: this.config.companyFeatures.toolManager ? now.toISOString() : null,
          toolsTracked: this.config.companyFeatures.toolManager ? 142 : 0
        },
        clampingPlateManager: {
          status: this.config.companyFeatures.clampingPlateManager ? 'active' : 'disabled',
          lastUpdate: this.config.companyFeatures.clampingPlateManager ? now.toISOString() : null,
          platesManaged: this.config.companyFeatures.clampingPlateManager ? 67 : 0
        }
      }
    };
  }

  private getDirectoriesToCreate(): string[] {
    const directories: string[] = [];
    
    if (this.config.storage.basePath) {
      // Mono folder strategy
      directories.push(
        this.config.storage.basePath,
        this.config.storage.logsPath,
        this.config.storage.backupPath,
        this.config.storage.tempPath,
        this.config.storage.outputPath
      );
    } else {
      // Individual folder strategy
      directories.push(
        this.config.storage.logsPath,
        this.config.storage.backupPath,
        this.config.storage.tempPath,
        this.config.storage.outputPath
      );
    }

    // Module-specific directories
    if (this.config.companyFeatures.jsonScanner && this.config.modules.jsonAnalyzer.dataPath) {
      directories.push(this.config.modules.jsonAnalyzer.dataPath);
    }
    
    if (this.config.companyFeatures.toolManager && this.config.modules.matrixTools.paths?.excelInputPath) {
      directories.push(this.config.modules.matrixTools.paths.excelInputPath);
    }
    
    if (this.config.companyFeatures.clampingPlateManager && this.config.modules.platesManager.dataPath) {
      directories.push(this.config.modules.platesManager.dataPath);
    }

    return [...new Set(directories)]; // Remove duplicates
  }

  private getCreatedDirectories(): string[] {
    return this.getDirectoriesToCreate();
  }

  private getConfiguredModules(): string[] {
    const modules: string[] = [];
    
    if (this.config.companyFeatures.jsonScanner) modules.push('JSON Scanner');
    if (this.config.companyFeatures.toolManager) modules.push('Tool Manager');
    if (this.config.companyFeatures.clampingPlateManager) modules.push('Clamping Plate Manager');
    
    return modules;
  }
}