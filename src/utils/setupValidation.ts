// setupValidation.ts
/**
 * Validation utilities for Setup Wizard fields
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

export class SetupValidation {
  /**
   * Validate if a path is a valid directory
   */
  static validateDirectoryPath(path: string): ValidationResult {
    if (!path || path.trim() === "") {
      return { isValid: false, error: "Directory path is required" };
    }

    // Check if it looks like a file (has extension)
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(path);
    if (hasExtension) {
      return { isValid: false, error: "Please select a directory, not a file" };
    }

    // Check for common invalid characters
    const invalidChars = /[<>:"|?*]/;
    if (invalidChars.test(path)) {
      return {
        isValid: false,
        error: "Directory path contains invalid characters",
      };
    }

    // Check for protected directories (basic)
    const protectedPaths = [
      "/System",
      "/Library/System",
      "C:\\Windows",
      "C:\\Program Files",
      "C:\\Program Files (x86)",
    ];

    const isProtected = protectedPaths.some((protectedPath) =>
      path.toLowerCase().startsWith(protectedPath.toLowerCase())
    );

    if (isProtected) {
      return {
        isValid: false,
        error:
          "Cannot use system or protected directories. Please choose a user directory.",
      };
    }

    return { isValid: true };
  }

  /**
   * Validate image file selection
   */
  static validateImageFile(filePath: string): ValidationResult {
    if (!filePath || filePath.trim() === "") {
      return { isValid: false, error: "Image file is required" };
    }

    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".svg",
      ".webp",
    ];
    const extension = filePath
      .toLowerCase()
      .substring(filePath.lastIndexOf("."));

    if (!imageExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `Invalid image format. Supported formats: ${imageExtensions.join(
          ", "
        )}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate employee data file (CSV/JSON)
   */
  static validateEmployeeFile(filePath: string): ValidationResult {
    if (!filePath || filePath.trim() === "") {
      return { isValid: false, error: "Employee file is required" };
    }

    const validExtensions = [".csv", ".json"];
    const extension = filePath
      .toLowerCase()
      .substring(filePath.lastIndexOf("."));

    if (!validExtensions.includes(extension)) {
      return {
        isValid: false,
        error: "Employee file must be CSV or JSON format",
      };
    }

    return { isValid: true };
  }

  /**
   * Validate plate data file (Excel/CSV)
   */
  static validatePlateFile(filePath: string): ValidationResult {
    if (!filePath || filePath.trim() === "") {
      return { isValid: false, error: "Plate data file is required" };
    }

    const validExtensions = [".xlsx", ".xls", ".csv"];
    const extension = filePath
      .toLowerCase()
      .substring(filePath.lastIndexOf("."));

    if (!validExtensions.includes(extension)) {
      return {
        isValid: false,
        error: "Plate data file must be Excel (.xlsx, .xls) or CSV format",
      };
    }

    return { isValid: true };
  }

  /**
   * Validate Excel matrix file
   */
  static validateExcelFile(filePath: string): ValidationResult {
    if (!filePath || filePath.trim() === "") {
      return { isValid: false, error: "Excel file is required" };
    }

    const validExtensions = [".xlsx", ".xls"];
    const extension = filePath
      .toLowerCase()
      .substring(filePath.lastIndexOf("."));

    if (!validExtensions.includes(extension)) {
      return {
        isValid: false,
        error: "File must be Excel format (.xlsx or .xls)",
      };
    }

    return { isValid: true };
  }

  /**
   * Validate JSON file
   */
  static validateJsonFile(filePath: string): ValidationResult {
    if (!filePath || filePath.trim() === "") {
      return { isValid: false, error: "JSON file is required" };
    }

    const extension = filePath
      .toLowerCase()
      .substring(filePath.lastIndexOf("."));

    if (extension !== ".json") {
      return {
        isValid: false,
        error: "File must be JSON format (.json)",
      };
    }

    return { isValid: true };
  }

  /**
   * Validate CAD model files (for clamping plates)
   */
  static validateCADFile(filePath: string): ValidationResult {
    if (!filePath || filePath.trim() === "") {
      return { isValid: false, error: "CAD file is required" };
    }

    const validExtensions = [
      ".xt",
      ".step",
      ".stp",
      ".dwg",
      ".dxf",
      ".iges",
      ".igs",
    ];
    const extension = filePath
      .toLowerCase()
      .substring(filePath.lastIndexOf("."));

    if (!validExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `Invalid CAD format. Supported: ${validExtensions.join(", ")}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate company name
   */
  static validateCompanyName(name: string): ValidationResult {
    if (!name || name.trim() === "") {
      return { isValid: false, error: "Company name is required" };
    }

    if (name.trim().length < 2) {
      return {
        isValid: false,
        error: "Company name must be at least 2 characters",
      };
    }

    if (name.trim().length > 100) {
      return {
        isValid: false,
        error: "Company name must be less than 100 characters",
      };
    }

    return { isValid: true };
  }

  /**
   * Validate database connection string
   */
  static validateDatabaseConnection(
    connectionString: string
  ): ValidationResult {
    if (!connectionString || connectionString.trim() === "") {
      return {
        isValid: false,
        error: "Database connection string is required",
      };
    }

    // Basic validation for common database connection patterns
    const dbPatterns = [
      /^mongodb:\/\//,
      /^mysql:\/\//,
      /^postgresql:\/\//,
      /^sqlite:/,
      /^Server=.*Database=/i,
      /^Data Source=/i,
    ];

    const isValidPattern = dbPatterns.some((pattern) =>
      pattern.test(connectionString)
    );

    if (!isValidPattern) {
      return {
        isValid: false,
        error: "Invalid database connection string format",
      };
    }

    return { isValid: true };
  }

  /**
   * Validate LDAP server address
   */
  static validateLDAPServer(serverAddress: string): ValidationResult {
    if (!serverAddress || serverAddress.trim() === "") {
      return { isValid: false, error: "LDAP server address is required" };
    }

    // Basic LDAP server validation
    const ldapPattern = /^ldaps?:\/\/[\w.-]+(?::\d+)?$/i;

    if (!ldapPattern.test(serverAddress)) {
      return {
        isValid: false,
        error:
          "Invalid LDAP server format. Use ldap://server or ldaps://server",
      };
    }

    return { isValid: true };
  }

  /**
   * Get file type description for user guidance
   */
  static getFileTypeDescription(validationType: string): string {
    const descriptions: Record<string, string> = {
      image: "Image files (JPG, PNG, GIF, SVG, etc.)",
      employee: "Employee data (CSV or JSON format)",
      plate: "Plate data (Excel or CSV format)",
      excel: "Excel files (XLSX or XLS format)",
      json: "JSON files (JSON format)",
      cad: "CAD model files (XT, STEP, DWG, etc.)",
      directory: "Directory/Folder path",
    };

    return descriptions[validationType] || "Valid file format";
  }

  /**
   * Get appropriate file accept attribute for input elements
   */
  static getFileAccept(validationType: string): string {
    const accepts: Record<string, string> = {
      image: "image/*",
      employee: ".csv,.json",
      plate: ".xlsx,.xls,.csv",
      excel: ".xlsx,.xls",
      json: ".json",
      cad: ".xt,.step,.stp,.dwg,.dxf,.iges,.igs",
    };

    return accepts[validationType] || "*/*";
  }
}
