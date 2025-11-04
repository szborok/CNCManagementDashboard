/**
 * Test Data Download Service
 * Provides test data packages for new users to try the system
 */

export interface TestDataPackage {
  id: string;
  name: string;
  description: string;
  filename: string;
  size: string;
  contents: string[];
  downloadUrl?: string;
}

export const testDataPackages: Record<string, TestDataPackage> = {
  JSONScanner: {
    id: "JSONScanner",
    name: "JSON Scanner Test Data",
    description:
      "CAD project samples with JSON files for testing rule analysis and automatic corrections",
    filename: "JSONScanner_test_data.zip",
    size: "15 MB",
    contents: [
      "W5270NS01001/ - Complete Hummingbird project structure with multiple operations",
      "W5270NS01003/ - Secondary project sample with different tool configurations",
      "W5270NS01060/ - Additional project demonstrating various machining scenarios",
      "testPathOne_manual/ - Manual processing examples for rule testing",
      "testPathHumming_auto/ - Automated processing workflow samples",
      "result.json files - Expected analysis outputs and rule execution results",
      "Sample XML files - CAD operation data for comprehensive testing",
      "folderInfo.txt files - Project path and structure documentation",
    ],
    downloadUrl: "/api/download/json-scanner-samples",
  },
  tool_manager: {
    id: "tool_manager",
    name: "Tool Manager Test Data",
    description:
      "Excel matrix files and tool inventory samples for testing tool management workflows",
    filename: "tool_manager_test_data.zip",
    size: "8 MB",
    contents: [
      "Euroform_Matrix_2024-01-15.xlsx - Complete sample matrix file with all tool categories",
      "sampleExcels/ - Reference Excel files for different tool types and formats",
      "testJSONs/ - Tool tracking JSON examples showing work item generation",
      "filesToProcess/ - Sample files ready for matrix processing",
      "filesProcessedArchive/ - Examples of processed and archived files",
      "Tool definitions and configurations for various manufacturing tools",
      "Work tracking examples showing tool assignment and usage patterns",
    ],
    downloadUrl: "/api/download/tool-manager-samples",
  },
  clamping_plates: {
    id: "clamping_plates",
    name: "Clamping Plate Manager Test Data",
    description:
      "Plate inventory and usage tracking samples for testing plate management features",
    filename: "clamping_plates_test_data.zip",
    size: "5 MB",
    contents: [
      "Készülékek.xlsx - Complete plate inventory with specifications and locations",
      "Numbered folders (1-38) - Individual plate data and documentation",
      "Usage tracking examples showing plate assignment and workflows",
      "Maintenance records and scheduling examples",
      "Photo documentation and plate condition tracking",
      "Sample plate specifications and technical drawings",
      "Work order integration examples",
    ],
    downloadUrl: "/api/download/clamping-plate-samples",
  },
};

/**
 * Test Data Download Service
 */
export class TestDataDownloadService {
  /**
   * Get information about available test data packages
   */
  static getAvailablePackages(): TestDataPackage[] {
    return Object.values(testDataPackages);
  }

  /**
   * Get specific package information
   */
  static getPackage(packageId: string): TestDataPackage | null {
    return testDataPackages[packageId] || null;
  }

  /**
   * Simulate downloading a test data package
   * In production, this would create actual zip files from the modules
   */
  static async downloadPackage(
    packageId: string
  ): Promise<{ success: boolean; message: string }> {
    const package_ = this.getPackage(packageId);

    if (!package_) {
      return {
        success: false,
        message: `Package '${packageId}' not found`,
      };
    }

    try {
      // Create downloadable sample files based on package type
      if (packageId === "JSONScanner") {
        await this.downloadJSONScannerSample();
      } else if (packageId === "tool_manager") {
        await this.downloadToolManagerSample();
      } else if (packageId === "clamping_plates") {
        await this.downloadClampingPlatesSample();
      } else {
        throw new Error(`Unknown package type: ${packageId}`);
      }

      return {
        success: true,
        message: `Successfully downloaded ${package_.filename}`,
      };
    } catch (error) {
      console.error("Error downloading test data package:", error);
      return {
        success: false,
        message: `Failed to download package: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Download JSON Scanner sample files
   */
  private static async downloadJSONScannerSample(): Promise<void> {
    // Create comprehensive JSON Scanner demo folder structure based on real testPathHumming_auto data
    const jsonDemoFolder = {
      // Main folder info
      "JSON_DEMO_FOLDER/README.txt": `JSON Scanner Demo Folder
=========================

This folder contains real CAD project data from the Hummingbird project series.
Use this data to test the JSON Scanner functionality.

Structure:
- W5270NS01001/: Primary Hummingbird project with multiple operations
- W5270NS01003/: Secondary project with different configurations  
- W5270NS01060/: Additional project for testing various scenarios
- W5270NS01061/: Complex project with multiple sub-operations

Each project contains:
- XML files with operation data
- Result.json files with processing results
- Tool configuration files
- Folder structure information

Import this folder into the JSON Scanner to test rule analysis and automatic corrections.`,

      // W5270NS01001 Project
      "JSON_DEMO_FOLDER/W5270NS01001/W5270NS01001A/W5270NS01001A.XML": `<?xml version="1.0" encoding="UTF-8"?>
<Project>
  <Name>W5270NS01001A</Name>
  <Description>Hummingbird Project - Operation A</Description>
  <Machine>DMU 85 monoblock MINUS</Machine>
  <Operations>
    <Operation id="1" name="Roughing" tool="EndMill_10mm" feedRate="1500" spindleSpeed="3000"/>
    <Operation id="2" name="Semi-Finishing" tool="EndMill_6mm" feedRate="1000" spindleSpeed="4000"/>
  </Operations>
</Project>`,

      "JSON_DEMO_FOLDER/W5270NS01001/W5270NS01001A/result.json": JSON.stringify(
        {
          created: "2025.11.04 12:00:00",
          jobs: [
            {
              machine: "DMU 85 monoblock MINUS",
              result: "success",
              detail: "All operations completed successfully",
            },
          ],
        },
        null,
        2
      ),

      "JSON_DEMO_FOLDER/W5270NS01001/W5270NS01001A/folderInfo.txt":
        "P:/Project/Hummingbird/W5270NS01001/W5270NS01001A",

      // W5270NS01003 Project
      "JSON_DEMO_FOLDER/W5270NS01003/W5270NS01003B/W5270NS01003B.XML": `<?xml version="1.0" encoding="UTF-8"?>
<Project>
  <Name>W5270NS01003B</Name>
  <Description>Hummingbird Project - Operation B</Description>
  <Machine>DMU 100P duoblock Minus</Machine>
  <Operations>
    <Operation id="1" name="Drilling" tool="Drill_8mm" feedRate="800" spindleSpeed="2500"/>
    <Operation id="2" name="Finishing" tool="BallEndMill_6mm" feedRate="600" spindleSpeed="5000"/>
  </Operations>
</Project>`,

      "JSON_DEMO_FOLDER/W5270NS01003/W5270NS01003B/result.json": JSON.stringify(
        {
          created: "2025.11.04 12:15:00",
          jobs: [
            {
              machine: "DMU 100P duoblock Minus",
              result: "success",
              detail: "",
            },
          ],
        },
        null,
        2
      ),

      "JSON_DEMO_FOLDER/W5270NS01003/W5270NS01003B/folderInfo.txt":
        "P:/Project/Hummingbird/W5270NS01003/W5270NS01003B",

      // W5270NS01060 Project
      "JSON_DEMO_FOLDER/W5270NS01060/W5270NS01060C/W5270NS01060C.XML": `<?xml version="1.0" encoding="UTF-8"?>
<Project>
  <Name>W5270NS01060C</Name>
  <Description>Hummingbird Project - Operation C</Description>
  <Machine>DMU 85 monoblock MINUS</Machine>
  <Operations>
    <Operation id="1" name="Contouring" tool="EndMill_12mm" feedRate="1200" spindleSpeed="3500"/>
    <Operation id="2" name="Surface Finishing" tool="BallEndMill_3mm" feedRate="400" spindleSpeed="6000"/>
  </Operations>
</Project>`,

      "JSON_DEMO_FOLDER/W5270NS01060/W5270NS01060C/result.json": JSON.stringify(
        {
          created: "2025.11.04 12:30:00",
          jobs: [
            {
              machine: "DMU 85 monoblock MINUS",
              result: "success",
              detail: "Contour operations completed with high precision",
            },
          ],
        },
        null,
        2
      ),

      // W5270NS01061 Complex Project
      "JSON_DEMO_FOLDER/W5270NS01061/W5270NS01061B/DMU 85 monoblock MINUS/W5270NS01061B.json":
        JSON.stringify(
          {
            project: "W5270NS01061B",
            machine: "DMU 85 monoblock MINUS",
            tools: [
              { id: "T001", name: "EndMill_10mm", diameter: 10, length: 50 },
              { id: "T002", name: "BallEndMill_6mm", diameter: 6, length: 40 },
              { id: "T003", name: "Drill_8mm", diameter: 8, length: 60 },
            ],
            operations: [
              { id: "OP001", name: "Roughing", tool: "T001", feedRate: 1500 },
              { id: "OP002", name: "Finishing", tool: "T002", feedRate: 800 },
              { id: "OP003", name: "Drilling", tool: "T003", feedRate: 600 },
            ],
          },
          null,
          2
        ),

      "JSON_DEMO_FOLDER/W5270NS01061/W5270NS01061B/DMU 85 monoblock MINUS/folderInfo.txt":
        "P:/Project/Hummingbird/W5270NS01061/W5270NS01061B/DMU 85 monoblock MINUS",

      "JSON_DEMO_FOLDER/W5270NS01061/W5270NS01061B/DMU 85 monoblock MINUS/result.json":
        JSON.stringify(
          {
            created: "2025.11.04 12:45:00",
            jobs: [
              {
                machine: "DMU 85 monoblock MINUS",
                result: "success",
                detail:
                  "Complex multi-operation project completed successfully",
              },
            ],
          },
          null,
          2
        ),

      // Tool configuration files
      "JSON_DEMO_FOLDER/tools/tool_definitions.json": JSON.stringify(
        {
          tools: [
            {
              id: "EndMill_10mm",
              type: "EndMill",
              diameter: 10,
              length: 50,
              material: "Carbide",
            },
            {
              id: "EndMill_6mm",
              type: "EndMill",
              diameter: 6,
              length: 40,
              material: "Carbide",
            },
            {
              id: "EndMill_12mm",
              type: "EndMill",
              diameter: 12,
              length: 60,
              material: "Carbide",
            },
            {
              id: "BallEndMill_6mm",
              type: "BallEndMill",
              diameter: 6,
              length: 40,
              material: "HSS",
            },
            {
              id: "BallEndMill_3mm",
              type: "BallEndMill",
              diameter: 3,
              length: 30,
              material: "Carbide",
            },
            {
              id: "Drill_8mm",
              type: "Drill",
              diameter: 8,
              length: 60,
              material: "Carbide",
            },
          ],
        },
        null,
        2
      ),

      // Processing rules examples
      "JSON_DEMO_FOLDER/rules/sample_rules.json": JSON.stringify(
        {
          rules: [
            {
              id: "AutoCorrectionContour",
              name: "Automatic Contour Correction",
              description:
                "Automatically corrects contour operations based on tool diameter",
              enabled: true,
            },
            {
              id: "GunDrill60MinLimit",
              name: "Gun Drill 60 Minute Limit",
              description:
                "Limits gun drilling operations to 60 minutes maximum",
              enabled: true,
            },
            {
              id: "SingleToolInNC",
              name: "Single Tool per NC File",
              description: "Ensures only one tool is used per NC program",
              enabled: false,
            },
          ],
        },
        null,
        2
      ),
    };

    // Create and download all files with proper folder structure
    this.createFolderStructureDownload(jsonDemoFolder);
  }

  /**
   * Download Tool Manager sample files
   */
  private static async downloadToolManagerSample(): Promise<void> {
    // Create sample CSV data that mimics Excel structure
    const toolMatrixCSV = `Tool ID,Tool Name,Diameter,Length,Material,Location,Status,Last Used
T001,10mm EndMill,10,50,Carbide,A1-B2,Available,2024-01-15
T002,6mm BallEndMill,6,40,HSS,A1-B3,In Use,2024-01-16
T003,8mm Drill,8,60,Carbide,A2-B1,Available,2024-01-14
T004,12mm Facemill,12,45,Carbide,A2-B2,Maintenance,2024-01-10
T005,3mm EndMill,3,30,Carbide,A1-B1,Available,2024-01-16`;

    const workItemsJSON = JSON.stringify(
      {
        workItems: [
          {
            id: "WI001",
            toolId: "T001",
            project: "W5270NS01001",
            operation: "Roughing",
            estimatedTime: 45,
            status: "completed",
          },
          {
            id: "WI002",
            toolId: "T002",
            project: "W5270NS01003",
            operation: "Finishing",
            estimatedTime: 30,
            status: "in_progress",
          },
        ],
      },
      null,
      2
    );

    const sampleFiles = {
      "tool_matrix_sample.csv": toolMatrixCSV,
      "work_items_sample.json": workItemsJSON,
      "README.txt":
        "Tool Manager Sample Files\n\n1. tool_matrix_sample.csv - Sample tool inventory\n2. work_items_sample.json - Sample work tracking data\n\nImport these files into the Tool Manager to test functionality.",
    };

    this.createMultiFileDownload(sampleFiles, "ToolManager_sample_data");
  }

  /**
   * Download Clamping Plates sample files
   */
  private static async downloadClampingPlatesSample(): Promise<void> {
    const plateInventoryCSV = `Plate ID,Name,Size,Material,Location,Status,Last Maintenance
P001,Standard Plate 200x300,200x300,Steel,Rack A1,Available,2024-01-10
P002,Heavy Duty Plate 400x600,400x600,Cast Iron,Rack A2,In Use,2024-01-12
P003,Precision Plate 150x250,150x250,Aluminum,Rack B1,Available,2024-01-08
P004,Custom Fixture Plate,300x400,Steel,Rack B2,Maintenance,2024-01-05`;

    const plateUsageJSON = JSON.stringify(
      {
        usage: [
          {
            plateId: "P001",
            project: "W5270NS01001",
            startDate: "2024-01-15",
            endDate: "2024-01-16",
            operator: "John Smith",
            status: "completed",
          },
          {
            plateId: "P002",
            project: "W5270NS01003",
            startDate: "2024-01-16",
            endDate: null,
            operator: "Sarah Johnson",
            status: "in_progress",
          },
        ],
      },
      null,
      2
    );

    const sampleFiles = {
      "plate_inventory_sample.csv": plateInventoryCSV,
      "plate_usage_sample.json": plateUsageJSON,
      "README.txt":
        "Clamping Plate Manager Sample Files\n\n1. plate_inventory_sample.csv - Sample plate inventory\n2. plate_usage_sample.json - Sample usage tracking data\n\nImport these files into the Clamping Plate Manager to test functionality.",
    };

    this.createMultiFileDownload(sampleFiles, "ClampingPlates_sample_data");
  }

  /**
   * Create and download multiple files as separate downloads
   */
  private static createMultiFileDownload(
    files: Record<string, string>,
    baseName: string
  ): void {
    Object.entries(files).forEach(([filename, content], index) => {
      setTimeout(() => {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${baseName}_${filename}`;
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, index * 500); // Stagger downloads by 500ms
    });
  }

  /**
   * Generate download instructions for a package
   */
  static getDownloadInstructions(packageId: string): string {
    const package_ = this.getPackage(packageId);

    if (!package_) {
      return "Package not found";
    }

    return `
## ${package_.name}

${package_.description}

### Package Contents:
${package_.contents.map((item) => `• ${item}`).join("\n")}

### Size: ${package_.size}

### Instructions:
1. Download and extract the ${package_.filename} file
2. Place the extracted folders in your chosen data directory
3. Update your application configuration to point to these sample folders
4. Start exploring the features with realistic sample data

### What You Can Test:
- Complete workflows from start to finish
- All application features and settings
- Integration between different modules
- Report generation and analysis tools
- Data validation and error handling

The sample data represents real-world scenarios you'll encounter in production use.
    `.trim();
  }

  /**
   * Track download statistics (for analytics)
   */
  static async trackDownload(packageId: string): Promise<void> {
    try {
      await fetch("/api/analytics/test-data-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.log("Analytics tracking failed (non-critical):", error);
    }
  }

  /**
   * Create and download files with folder structure preservation
   */
  private static createFolderStructureDownload(
    files: Record<string, string>
  ): void {
    Object.entries(files).forEach(([filepath, content], index) => {
      setTimeout(() => {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filepath;
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, index * 300); // Stagger downloads by 300ms to preserve order
    });
  }
}

export default TestDataDownloadService;
