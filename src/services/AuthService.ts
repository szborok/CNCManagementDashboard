interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  department: string;
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
  machineId?: string;
  shiftCode?: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
  expiresIn?: number;
}

interface TokenPayload {
  sub: string;
  username: string;
  role: string;
  permissions: string[];
  exp: number;
  iat: number;
}

class AuthService {
  private readonly TOKEN_KEY = 'cnc_access_token';
  private readonly REFRESH_TOKEN_KEY = 'cnc_refresh_token';
  private readonly USER_KEY = 'cnc_user_data';
  private readonly API_BASE_URL = 'http://localhost:8080'; // Will be configurable via env in production

  // Users loaded from template file
  private mockUsers: User[] = [];
  private mockPasswords: { [key: string]: string } = {};
  private employeesLoaded: Promise<void>;

  constructor() {
    this.employeesLoaded = this.loadEmployees();
  }

  /**
   * Load employees from test data (demo mode) or template file (production setup)
   */
  private async loadEmployees(): Promise<void> {
    try {
      // Try loading from test-data folder first (demo mode with real employee data)
      let response = await fetch('/test-data/source_data/employees.json');
      let source = 'demo data';
      
      if (!response.ok) {
        // Fallback to template file (production setup)
        response = await fetch('/config/employees.template.json');
        source = 'template';
      }
      
      if (response.ok) {
        const employees = await response.json();
        this.mockUsers = employees.map((emp: any) => ({
          id: emp.id,
          username: emp.username,
          email: emp.email,
          role: emp.role,
          department: emp.department,
          permissions: emp.role === 'admin' 
            ? ['read', 'write', 'delete', 'manage_users', 'emergency_stop', 'system_config']
            : ['read', 'operate_machine', 'basic_reports'],
          lastLogin: new Date().toISOString(),
          isActive: true
        }));
        // Store passwords separately
        employees.forEach((emp: any) => {
          this.mockPasswords[emp.username] = emp.password;
        });
        console.log(`✅ Loaded ${this.mockUsers.length} employees from ${source}`);
      }
    } catch (error) {
      console.error('Failed to load employees:', error);
      // Fallback to default admin user
      this.mockUsers = [
        {
          id: 'admin',
          username: 'admin',
          email: 'admin@cnc.local',
          role: 'admin',
          department: 'Management',
          permissions: ['read', 'write', 'delete', 'manage_users', 'emergency_stop', 'system_config'],
          lastLogin: new Date().toISOString(),
          isActive: true
        }
      ];
      this.mockPasswords['admin'] = 'admin123';
      console.log('⚠️ Using fallback admin account');
    }
  }

  /**
   * Authenticate user with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Login attempt:', { username: credentials.username, hasPassword: !!credentials.password });
      
      // Wait for employees to be loaded
      await this.employeesLoaded;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // In production, this would be a real API call
      const user = this.mockUsers.find(u => 
        u.username === credentials.username && 
        u.isActive
      );

      if (!user) {
        console.error('❌ User not found:', credentials.username);
        return {
          success: false,
          message: 'Invalid credentials or user not found'
        };
      }

      // Check password
      if (this.mockPasswords[credentials.username] !== credentials.password) {
        console.error('❌ Invalid password for user:', credentials.username);
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      console.log('✅ User authenticated:', user);

      // Validate machine authorization if specified
      if (credentials.machineId && !this.canAccessMachine(user, credentials.machineId)) {
        return {
          success: false,
          message: `Access denied for machine ${credentials.machineId}`
        };
      }

      // Validate shift access
      if (credentials.shiftCode && !this.isValidShiftAccess(user, credentials.shiftCode)) {
        return {
          success: false,
          message: 'Access denied for current shift'
        };
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Store tokens and user data
      localStorage.setItem(this.TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      console.log('💾 User data stored in localStorage');
      console.log('👤 Current user:', user);

      return {
        success: true,
        user,
        accessToken,
        refreshToken,
        expiresIn: 3600, // 1 hour
        message: 'Login successful'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Authentication service unavailable'
      };
    }
  }

  /**
   * Logout and clear all stored data
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    // In production, also invalidate token on server
    this.revokeTokenOnServer();
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired(token);
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions.includes(permission) || false;
  }

  /**
   * Check if user can access specific machine
   * Admin users can access all machines, regular users can access all machines too for now
   */
  canAccessMachine(user: User | null, _machineId: string): boolean {
    if (!user) return false;
    // Simplified access control - all authenticated users can access machines
    // In production, this would check against user-specific machine permissions
    return user.isActive;
  }

  /**
   * Check role-based access
   */
  hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const roleHierarchy = {
      'operator': 1,
      'technician': 2,
      'supervisor': 3,
      'admin': 4
    };

    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (!refreshToken) return false;

      // In production, call refresh endpoint
      // For now, generate new token if refresh token is valid
      const user = this.getCurrentUser();
      if (!user) return false;

      const newAccessToken = this.generateAccessToken(user);
      localStorage.setItem(this.TOKEN_KEY, newAccessToken);
      
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Emergency authentication for critical situations
   */
  async emergencyAccess(emergencyCode: string, reason: string): Promise<boolean> {
    // This would implement emergency access protocols
    // For critical production situations
    console.warn('Emergency access attempted:', { emergencyCode, reason });
    
    // In production, this would:
    // 1. Validate emergency code
    // 2. Log incident
    // 3. Notify supervisors
    // 4. Grant temporary elevated access
    
    return emergencyCode === 'EMERGENCY_2024';
  }

  // Private helper methods

  private generateAccessToken(user: User): string {
    // In production, use proper JWT library like jose or jsonwebtoken
    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      iat: Math.floor(Date.now() / 1000)
    };

    // This is a mock implementation - use proper JWT signing in production
    return btoa(JSON.stringify(payload));
  }

  private generateRefreshToken(user: User): string {
    // In production, generate secure refresh token
    const payload = {
      sub: user.id,
      type: 'refresh',
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 3600) // 7 days
    };
    
    return btoa(JSON.stringify(payload));
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload: TokenPayload = JSON.parse(atob(token));
      return payload.exp < Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  }

  private isValidShiftAccess(user: User, _shiftCode: string): boolean {
    // Simplified shift access - all users can access all shifts
    // In production, this would check against user-specific shift permissions
    return user.isActive;
  }

  private async revokeTokenOnServer(): Promise<void> {
    try {
      // In production, call server to invalidate token
      const token = this.getAccessToken();
      if (token) {
        await fetch(`${this.API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error revoking token:', error);
    }
  }
}

// Export singleton instance
// Create singleton instance
const authServiceInstance = new AuthService();

export const authService = authServiceInstance;
export type { User, LoginCredentials, AuthResponse };