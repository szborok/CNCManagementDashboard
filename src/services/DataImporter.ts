import { SetupConfig } from '../hooks/useSetupConfig';

export interface ImportResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}

export class DataImporter {
  static async importEmployees(file: File): Promise<ImportResult> {
    console.log('DataImporter.importEmployees called with file:', file.name, file.type, file.size);
    try {
      const text = await file.text();
      console.log('File content length:', text.length);
      console.log('File content preview:', text.substring(0, 200));
      
      // Try to parse as JSON first
      try {
        const data = JSON.parse(text);
        console.log('Successfully parsed as JSON, data:', data);
        const validation = this.validateEmployeeData(data);
        console.log('Validation result:', validation);
        
        if (!validation.isValid) {
          return {
            success: false,
            message: 'Invalid employee data format',
            errors: validation.errors
          };
        }
        
        return {
          success: true,
          message: `Successfully imported ${data.length} employees`,
          data: data
        };
      } catch (jsonError) {
        console.log('JSON parsing failed, trying CSV:', jsonError);
        // Try to parse as CSV
        return this.importEmployeesFromCSV(text);
      }
    } catch (error) {
      console.error('File reading error:', error);
      return {
        success: false,
        message: 'Failed to read file',
        errors: [(error as Error).message]
      };
    }
  }

  static async importPlatesData(file: File): Promise<ImportResult> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const validation = this.validatePlatesData(data);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Invalid plates data format',
          errors: validation.errors
        };
      }
      
      return {
        success: true,
        message: `Successfully imported ${data.plates?.length || 0} plates`,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to parse plates data',
        errors: [(error as Error).message]
      };
    }
  }

  static async importToolsData(file: File): Promise<ImportResult> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const validation = this.validateToolsData(data);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Invalid tools data format',
          errors: validation.errors
        };
      }
      
      return {
        success: true,
        message: `Successfully imported ${data.tools?.length || 0} tools and ${data.projects?.length || 0} projects`,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to parse tools data',
        errors: [(error as Error).message]
      };
    }
  }

  private static importEmployeesFromCSV(csvText: string): ImportResult {
    try {
      const lines = csvText.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        return {
          success: false,
          message: 'CSV file must have at least a header and one data row',
          errors: ['Invalid CSV format']
        };
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['username', 'password', 'role', 'firstname', 'lastname'];
      
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        return {
          success: false,
          message: 'Missing required CSV columns',
          errors: [`Missing columns: ${missingHeaders.join(', ')}`]
        };
      }

      const employees = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: Column count mismatch`);
          continue;
        }

        const employee: any = { id: `emp_${i}` };
        headers.forEach((header, index) => {
          employee[header] = values[index];
        });

        // Set defaults for missing fields
        employee.email = employee.email || `${employee.username}@company.com`;
        employee.department = employee.department || 'Production';
        employee.profilePicture = employee.profilepicture || `./assets/profiles/${employee.username}.jpg`;

        employees.push(employee);
      }

      return {
        success: true,
        message: `Successfully imported ${employees.length} employees from CSV`,
        data: employees,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to parse CSV file',
        errors: [(error as Error).message]
      };
    }
  }

  private static validateEmployeeData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!Array.isArray(data)) {
      errors.push('Employee data must be an array');
      return { isValid: false, errors };
    }

    data.forEach((employee, index) => {
      if (!employee.username) errors.push(`Employee ${index + 1}: Missing username`);
      if (!employee.password) errors.push(`Employee ${index + 1}: Missing password`);
      if (!employee.role) errors.push(`Employee ${index + 1}: Missing role`);
      if (!['admin', 'user'].includes(employee.role)) {
        errors.push(`Employee ${index + 1}: Invalid role (must be admin or user)`);
      }
      if (!employee.firstName) errors.push(`Employee ${index + 1}: Missing firstName`);
      if (!employee.lastName) errors.push(`Employee ${index + 1}: Missing lastName`);
    });

    return { isValid: errors.length === 0, errors };
  }

  private static validatePlatesData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.plates || !Array.isArray(data.plates)) {
      errors.push('Data must contain a "plates" array');
      return { isValid: false, errors };
    }

    data.plates.forEach((plate: any, index: number) => {
      if (!plate.id) errors.push(`Plate ${index + 1}: Missing id`);
      if (!plate.name) errors.push(`Plate ${index + 1}: Missing name`);
      if (!plate.status) errors.push(`Plate ${index + 1}: Missing status`);
      if (!['new', 'in-use', 'free', 'locked'].includes(plate.status)) {
        errors.push(`Plate ${index + 1}: Invalid status`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  private static validateToolsData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.tools || !Array.isArray(data.tools)) {
      errors.push('Data must contain a "tools" array');
    }

    if (data.tools) {
      data.tools.forEach((tool: any, index: number) => {
        if (!tool.id) errors.push(`Tool ${index + 1}: Missing id`);
        if (!tool.name) errors.push(`Tool ${index + 1}: Missing name`);
        if (!tool.status) errors.push(`Tool ${index + 1}: Missing status`);
        if (!['available', 'in_use', 'maintenance', 'retired'].includes(tool.status)) {
          errors.push(`Tool ${index + 1}: Invalid status`);
        }
      });
    }

    return { isValid: errors.length === 0, errors };
  }

  static generateEmployeeTemplate(): string {
    const template = [
      ['username', 'password', 'role', 'firstname', 'lastname', 'email', 'department', 'profilepicture'],
      ['john.smith', 'password123', 'user', 'John', 'Smith', 'john.smith@company.com', 'Production', './assets/profiles/john-smith.jpg'],
      ['jane.doe', 'password456', 'user', 'Jane', 'Doe', 'jane.doe@company.com', 'Quality Control', './assets/profiles/jane-doe.jpg'],
      ['admin', 'admin123', 'admin', 'System', 'Administrator', 'admin@company.com', 'IT', './assets/profiles/admin.jpg']
    ];

    return template.map(row => row.join(',')).join('\n');
  }

  static async exportConfiguration(config: SetupConfig): Promise<Blob> {
    const exportData = {
      config,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    return new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
  }

  static async importConfiguration(file: File): Promise<ImportResult> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.config) {
        return {
          success: false,
          message: 'Invalid configuration file format',
          errors: ['Missing config object']
        };
      }

      return {
        success: true,
        message: 'Configuration imported successfully',
        data: data.config
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to import configuration',
        errors: [(error as Error).message]
      };
    }
  }
}