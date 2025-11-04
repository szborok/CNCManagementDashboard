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
      // In development mode, just show information
      const isDevelopment =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      if (isDevelopment) {
        return {
          success: true,
          message: `Test data package info:\n\n${package_.name}\n${
            package_.description
          }\n\nContents:\n${package_.contents
            .map((item) => `• ${item}`)
            .join("\n")}\n\nSize: ${package_.size}`,
        };
      }

      // In production, this would:
      // 1. Create a zip file from the actual test_data directories
      // 2. Serve it for download
      // 3. Track download analytics

      const response = await fetch(`/api/test-data/download/${packageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // Trigger actual file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = package_.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

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
}

export default TestDataDownloadService;
