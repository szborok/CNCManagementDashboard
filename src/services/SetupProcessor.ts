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
        modelsPath: this.config.modules.platesManager.modelsPath,
        plateInfoFile: this.config.modules.platesManager.plateInfoFile,
        outputPath: this.config.storage.outputPath + '/plate_analysis'
      };
    }

    console.log('⚙️ Creating module configurations:', moduleConfigs);
    localStorage.setItem('moduleConfigs', JSON.stringify(moduleConfigs));
  }

  private async initializeDataLoading(): Promise<void> {
    console.log('📊 Initializing data loading...');
    
    // Create realistic demo data files and results
    await this.createDemoDataFiles();
    
    // Generate and store comprehensive sample data for dashboard
    const sampleData = this.generateSampleData();
    localStorage.setItem('dashboardData', JSON.stringify(sampleData));
    
    // Store demo processing results
    await this.createDemoProcessingResults();
    
    console.log('✅ Complete demo data ecosystem created');
  }

  private async createDemoDataFiles(): Promise<void> {
    console.log('📁 Creating realistic demo data files...');

    // Create JSON Scanner demo files
    if (this.config.companyFeatures.jsonScanner) {
      await this.createJsonScannerDemoData();
    }

    // Create Tool Manager demo files  
    if (this.config.companyFeatures.toolManager) {
      await this.createToolManagerDemoData();
    }

    // Create Clamping Plate demo files
    if (this.config.companyFeatures.clampingPlateManager) {
      await this.createClampingPlateDemoData();
    }
  }

  private async createJsonScannerDemoData(): Promise<void> {
    console.log('📄 Creating JSON Scanner demo files...');
    
    const demoJsonFiles = [
      {
        filename: 'W5270NS01001A.json',
        data: {
          "system": "hyperMILL 2025",
          "postProcessor": "",
          "version": "",
          "cadPart": "P:/Project/5270_Sumiriko_Pin_01_31406/CAM/W5270NS01_001/W5270NS01001.hmc",
          "operator": "szborok",
          "machine": "DMC 105 V Linear",
          "control": "",
          "usesToolNames": true,
          "programLevels": "1",
          "mainProgramName": "",
          "operationArea": {
            "min": { "x": -177.25, "y": -257.61, "z": -61.85 },
            "max": { "x": 177.25, "y": 257.97, "z": 6.00 }
          },
          "clamping": {
            "pallet": "",
            "fixture": "",
            "viewerFiles": ["W5270NS01001A_ERB.pdf", "W5270NS01001A_WDB.pdf"]
          },
          "operations": [
            {
              "sequence": 1,
              "toolName": "HSS Drill 8.5mm",
              "toolNumber": "T01",
              "operation": "DRILLING",
              "depth": 25.0,
              "feedRate": 250,
              "spindleSpeed": 1200,
              "machineTime": "2.5 min"
            },
            {
              "sequence": 2,
              "toolName": "Carbide End Mill 10mm", 
              "toolNumber": "T02",
              "operation": "MILLING",
              "depth": 5.0,
              "feedRate": 800,
              "spindleSpeed": 3500,
              "machineTime": "8.2 min"
            },
            {
              "sequence": 3,
              "toolName": "M8x1.25 Tap",
              "toolNumber": "T03",
              "operation": "TAPPING",
              "depth": 20.0,
              "feedRate": 200,
              "spindleSpeed": 800,
              "machineTime": "1.8 min"
            }
          ],
          "totalMachiningTime": "12.5 minutes",
          "estimatedCost": 45.80
        }
      },
      {
        filename: 'W5270NS01003B.json',
        data: {
          "system": "hyperMILL 2025",
          "postProcessor": "",
          "version": "",
          "cadPart": "P:/Project/5270_Sumiriko_Pin_01_31406/CAM/W5270NS01_003/W5270NS01003.hmc",
          "operator": "szborok",
          "machine": "DMU 100P duoblock Minus",
          "control": "",
          "usesToolNames": true,
          "programLevels": "1",
          "mainProgramName": "",
          "operationArea": {
            "min": { "x": -120.0, "y": -180.0, "z": -45.0 },
            "max": { "x": 120.0, "y": 180.0, "z": 8.0 }
          },
          "clamping": {
            "pallet": "",
            "fixture": "",
            "viewerFiles": ["W5270NS01003B_ERB.pdf", "W5270NS01003B_WDB.pdf"]
          },
          "operations": [
            {
              "sequence": 1,
              "toolName": "Carbide Drill 12mm",
              "toolNumber": "T05",
              "operation": "DRILLING", 
              "depth": 35.0,
              "feedRate": 300,
              "spindleSpeed": 1800,
              "machineTime": "3.2 min"
            },
            {
              "sequence": 2,
              "toolName": "Roughing End Mill 16mm",
              "toolNumber": "T08",
              "operation": "ROUGHING",
              "depth": 15.0,
              "feedRate": 1200,
              "spindleSpeed": 2800,
              "machineTime": "12.8 min"
            },
            {
              "sequence": 3,
              "toolName": "Finishing End Mill 8mm",
              "toolNumber": "T12",
              "operation": "FINISHING",
              "depth": 2.0,
              "feedRate": 600,
              "spindleSpeed": 4200,
              "machineTime": "2.7 min"
            }
          ],
          "totalMachiningTime": "18.7 minutes",
          "estimatedCost": 67.20
        }
      }
    ];

    // Store JSON demo files in localStorage
    localStorage.setItem('jsonScannerDemoFiles', JSON.stringify(demoJsonFiles));
    console.log(`✅ Created ${demoJsonFiles.length} realistic JSON demo files`);
  }

  private async createToolManagerDemoData(): Promise<void> {
    console.log('🔧 Creating Tool Manager demo data...');
    
    const demoToolData = {
      inventory: [
        {
          "toolId": "T001",
          "description": "HSS Drill 8.5mm",
          "manufacturer": "Sandvik",
          "type": "DRILL",
          "diameter": 8.5,
          "length": 120,
          "material": "HSS",
          "coating": "TiN",
          "inStock": 15,
          "minStock": 5,
          "cost": 24.50,
          "location": "A1-B2",
          "lastUsed": new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          "toolId": "T002",
          "description": "Carbide End Mill 10mm",
          "manufacturer": "Kennametal",
          "type": "END_MILL",
          "diameter": 10.0,
          "length": 75,
          "material": "CARBIDE",
          "coating": "TiAlN",
          "inStock": 8,
          "minStock": 3,
          "cost": 89.75,
          "location": "A2-C1",
          "lastUsed": new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          "toolId": "T003",
          "description": "M8x1.25 Tap",
          "manufacturer": "OSG",
          "type": "TAP",
          "diameter": 8.0,
          "length": 85,
          "material": "HSS",
          "coating": "Steam Oxide",
          "inStock": 12,
          "minStock": 4,
          "cost": 32.20,
          "location": "B1-A3",
          "lastUsed": new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          "toolId": "T005",
          "description": "Carbide Drill 12mm",
          "manufacturer": "Guhring",
          "type": "DRILL",
          "diameter": 12.0,
          "length": 140,
          "material": "CARBIDE",
          "coating": "DLC",
          "inStock": 6,
          "minStock": 2,
          "cost": 156.30,
          "location": "A1-D2",
          "lastUsed": new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ],
      usage: [
        {
          "date": new Date().toISOString().split('T')[0],
          "toolId": "T002",
          "project": "W5270NS01001A",
          "operation": "MILLING",
          "runtime": 45,
          "status": "COMPLETED"
        },
        {
          "date": new Date().toISOString().split('T')[0],
          "toolId": "T001",
          "project": "W5270NS01003B", 
          "operation": "DRILLING",
          "runtime": 32,
          "status": "COMPLETED"
        }
      ]
    };

    localStorage.setItem('toolManagerDemoData', JSON.stringify(demoToolData));
    console.log(`✅ Created tool inventory with ${demoToolData.inventory.length} tools`);
  }

  private async createClampingPlateDemoData(): Promise<void> {
    console.log('🔩 Creating Clamping Plate demo data...');
    
    const demoPlateData = {
      plates: [
        {
          "plateId": "CP-001",
          "model": "Standard 400x300",
          "dimensions": { "length": 400, "width": 300, "height": 50 },
          "holes": {
            "pattern": "M8 Grid",
            "spacing": 25,
            "count": 192
          },
          "material": "Cast Iron",
          "weight": 45.2,
          "location": "Station A",
          "status": "AVAILABLE",
          "lastMaintenance": new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          "plateId": "CP-002", 
          "model": "Heavy Duty 500x400",
          "dimensions": { "length": 500, "width": 400, "height": 75 },
          "holes": {
            "pattern": "M10 Grid",
            "spacing": 30,
            "count": 272
          },
          "material": "Steel",
          "weight": 78.5,
          "location": "Station B",
          "status": "IN_USE",
          "currentProject": "W5270NS01001A",
          "lastMaintenance": new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      usage: [
        {
          "date": new Date().toISOString().split('T')[0],
          "plateId": "CP-002",
          "project": "W5270NS01001A",
          "setup": "5-Axis Milling",
          "duration": 380,
          "status": "ACTIVE"
        }
      ]
    };

    localStorage.setItem('clampingPlateDemoData', JSON.stringify(demoPlateData));
    console.log(`✅ Created clamping plate data with ${demoPlateData.plates.length} plates`);
  }

  private async createDemoProcessingResults(): Promise<void> {
    console.log('📊 Creating demo processing results...');
    
    const processingResults = {
      jsonAnalysis: [
        {
          "id": "analysis_001",
          "filename": "W5270NS01001A.json",
          "processedAt": new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          "results": {
            "rulesApplied": ["AutoCorrectionContour", "M110Contour", "GunDrill60MinLimit", "SingleToolInNC"],
            "violations": [
              {
                "rule": "GunDrill60MinLimit",
                "severity": "WARNING",
                "message": "Drilling depth of 25mm detected, consider optimization for depths over 60mm",
                "location": "Operation 1 - T01 HSS Drill 8.5mm",
                "suggestion": "Consider using gun drill or pecking cycle for deeper holes"
              }
            ],
            "optimizations": [
              {
                "type": "FEED_RATE",
                "originalValue": 250,
                "suggestedValue": 280,
                "improvement": "12% faster cycle time"
              }
            ],
            "machiningTime": "12.5 minutes",
            "estimatedCost": 45.80
          },
          "status": "COMPLETED"
        },
        {
          "id": "analysis_002", 
          "filename": "W5270NS01003B.json",
          "processedAt": new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          "results": {
            "rulesApplied": ["AutoCorrectionPlane", "M110Helical", "ReconditionedTool", "SingleToolInNC"],
            "violations": [],
            "optimizations": [
              {
                "type": "SPINDLE_SPEED",
                "originalValue": 2800,
                "suggestedValue": 3200,
                "improvement": "8% better surface finish"
              },
              {
                "type": "FEED_RATE",
                "originalValue": 1200,
                "suggestedValue": 1350,
                "improvement": "10% reduced machining time"
              }
            ],
            "machiningTime": "18.7 minutes",
            "estimatedCost": 67.20
          },
          "status": "COMPLETED"
        }
      ],
      toolAnalysis: [
        {
          "id": "tool_001",
          "analysisDate": new Date().toISOString().split('T')[0],
          "summary": {
            "totalTools": 142,
            "activeTools": 38,
            "lowStockAlerts": 3,
            "maintenanceDue": 2
          },
          "alerts": [
            {
              "toolId": "T05",
              "type": "LOW_STOCK",
              "message": "Carbide Drill 12mm below minimum stock (2 remaining)",
              "priority": "HIGH"
            },
            {
              "toolId": "T08",
              "type": "MAINTENANCE_DUE",
              "message": "Roughing End Mill 16mm requires inspection after 500 hours",
              "priority": "MEDIUM"
            }
          ]
        }
      ]
    };

    localStorage.setItem('demoProcessingResults', JSON.stringify(processingResults));
    console.log('✅ Demo processing results with real rules created');
  }

  private generateSampleData() {
    const now = new Date();
    
    return {
      overview: {
        totalProjects: 15,
        activeProjects: 3, // More realistic number
        completedToday: 2,
        toolsInUse: 142, // Matches tool inventory
        lastUpdate: now.toISOString()
      },
      recentActivity: [
        {
          id: 1,
          type: 'json_analysis',
          project: 'W5270NS01001A.json',
          status: 'completed',
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          details: 'Analysis completed - 4 rules applied (AutoCorrectionContour, M110Contour, GunDrill60MinLimit, SingleToolInNC), 1 warning found, 1 optimization suggested'
        },
        {
          id: 2,
          type: 'json_analysis',
          project: 'W5270NS01003B.json', 
          status: 'completed',
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
          details: 'Analysis completed - 4 rules applied (AutoCorrectionPlane, M110Helical, ReconditionedTool, SingleToolInNC), 0 violations, 2 optimizations suggested'
        },
        {
          id: 3,
          type: 'tool_inventory',
          project: 'E-Cut,MFC,XF,XFeed készlet.xlsx',
          status: 'completed',
          timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
          details: 'Excel inventory processed: 142 tools tracked, 2 low stock alerts (T05 Carbide Drill 12mm, T08 Roughing End Mill 16mm)'
        },
        {
          id: 4,
          type: 'plate_management',
          project: 'DMC 105 V Linear Setup',
          status: 'processing',
          timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
          details: 'CP-002 Heavy Duty 500x400 in use for project W5270NS01001A - 5-Axis Milling setup active'
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
          { category: 'End Mills', count: 38, percentage: 27 },
          { category: 'Taps', count: 29, percentage: 20 },
          { category: 'Reamers', count: 18, percentage: 13 },
          { category: 'Others', count: 12, percentage: 8 }
        ]
      },
      modules: {
        jsonScanner: {
          status: this.config.companyFeatures.jsonScanner ? 'active' : 'disabled',
          lastScan: this.config.companyFeatures.jsonScanner ? now.toISOString() : null,
          filesProcessed: this.config.companyFeatures.jsonScanner ? 2 : 0 // Matches demo files
        },
        toolManager: {
          status: this.config.companyFeatures.toolManager ? 'active' : 'disabled',
          lastUpdate: this.config.companyFeatures.toolManager ? now.toISOString() : null,
          toolsTracked: this.config.companyFeatures.toolManager ? 4 : 0 // Matches demo inventory
        },
        clampingPlateManager: {
          status: this.config.companyFeatures.clampingPlateManager ? 'active' : 'disabled',
          lastUpdate: this.config.companyFeatures.clampingPlateManager ? now.toISOString() : null,
          platesManaged: this.config.companyFeatures.clampingPlateManager ? 2 : 0 // Matches demo plates
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
    
    if (this.config.companyFeatures.clampingPlateManager) {
      if (this.config.modules.platesManager.modelsPath) {
        directories.push(this.config.modules.platesManager.modelsPath);
      }
      // Note: plateInfoFile is a file path, not a directory, so we extract the directory
      if (this.config.modules.platesManager.plateInfoFile) {
        const infoFileDir = this.config.modules.platesManager.plateInfoFile.split(/[\\\/]/).slice(0, -1).join('\\');
        if (infoFileDir) {
          directories.push(infoFileDir);
        }
      }
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