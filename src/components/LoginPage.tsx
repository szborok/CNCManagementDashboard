import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield, Eye, EyeOff, AlertTriangle, Lock, Wrench, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../services/AuthService';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { login, isLoading, error, clearError } = useAuth();
  
  // Form state
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
    machineId: '',
    shiftCode: ''
  });
  
  const [formState, setFormState] = useState({
    rememberMe: false,
    showPassword: false,
    loginAttempts: 0,
    isLocked: false,
    lockoutTime: 0
  });
  
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [emergencyCode, setEmergencyCode] = useState('');
  
  // Predefined machines and shifts for dropdown
  const machines = [
    { id: 'DMU100P', name: 'DMU 100P duoblock' },
    { id: 'DMC105V', name: 'DMC 105 V Linear' },
    { id: 'XF_LINE', name: 'XF Production Line' },
    { id: 'ECUT_STATION', name: 'ECUT Station' }
  ];
  
  const shifts = [
    { code: 'DAY', name: 'Day Shift (06:00-14:00)' },
    { code: 'EVE', name: 'Evening Shift (14:00-22:00)' },
    { code: 'NIGHT', name: 'Night Shift (22:00-06:00)' }
  ];

  // Lockout management
  useEffect(() => {
    if (formState.isLocked && formState.lockoutTime > 0) {
      const timer = setTimeout(() => {
        setFormState(prev => ({
          ...prev,
          lockoutTime: prev.lockoutTime - 1
        }));
      }, 1000);
      
      if (formState.lockoutTime === 1) {
        setFormState(prev => ({
          ...prev,
          isLocked: false,
          loginAttempts: 0,
          lockoutTime: 0
        }));
      }
      
      return () => clearTimeout(timer);
    }
  }, [formState.isLocked, formState.lockoutTime]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!credentials.username.trim()) {
      errors.username = 'Username is required';
    } else if (credentials.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!credentials.password) {
      errors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Check for common weak passwords
    const weakPasswords = ['password', '123456', 'admin', 'user', 'test'];
    if (weakPasswords.includes(credentials.password.toLowerCase())) {
      errors.password = 'Please use a stronger password';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear general errors
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formState.isLocked) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await login(credentials);
      
      if (response.success) {
        // Reset form state on successful login
        setFormState(prev => ({
          ...prev,
          loginAttempts: 0,
          isLocked: false,
          lockoutTime: 0
        }));
        
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        // Handle failed login attempt
        const newAttempts = formState.loginAttempts + 1;
        
        if (newAttempts >= 3) {
          // Lock account after 3 failed attempts
          setFormState(prev => ({
            ...prev,
            loginAttempts: newAttempts,
            isLocked: true,
            lockoutTime: 300 // 5 minutes
          }));
        } else {
          setFormState(prev => ({
            ...prev,
            loginAttempts: newAttempts
          }));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleEmergencyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emergencyCode.trim()) {
      return;
    }
    
    // This would integrate with the emergency access system
    console.warn('Emergency access requested with code:', emergencyCode);
    
    // Reset emergency mode
    setEmergencyMode(false);
    setEmergencyCode('');
  };

  const getRemainingAttempts = () => {
    return Math.max(0, 3 - formState.loginAttempts);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-4">
            <Wrench className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">CNC Management Dashboard</h1>
          <p className="text-muted-foreground mt-2">Unified Production Control System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Secure Access
            </CardTitle>
            <CardDescription>
              {emergencyMode 
                ? 'Emergency access mode - Enter emergency code'
                : 'Enter your credentials to access the CNC management system'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Lockout Alert */}
            {formState.isLocked && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Account locked due to multiple failed attempts. 
                  Unlock in {Math.floor(formState.lockoutTime / 60)}:
                  {String(formState.lockoutTime % 60).padStart(2, '0')}
                </AlertDescription>
              </Alert>
            )}

            {/* General Error Alert */}
            {error && !formState.isLocked && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                  {formState.loginAttempts > 0 && (
                    <div className="mt-1 text-sm">
                      {getRemainingAttempts()} attempts remaining
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Emergency Access Form */}
            {emergencyMode ? (
              <form onSubmit={handleEmergencyAccess} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyCode">Emergency Access Code</Label>
                  <Input
                    id="emergencyCode"
                    type="password"
                    value={emergencyCode}
                    onChange={(e) => setEmergencyCode(e.target.value)}
                    placeholder="Enter emergency code"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    variant="destructive" 
                    className="flex-1"
                    disabled={isLoading || !emergencyCode.trim()}
                  >
                    {isLoading ? 'Verifying...' : 'Emergency Access'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEmergencyMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              /* Regular Login Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Enter your username"
                    disabled={isLoading || formState.isLocked}
                    className={validationErrors.username ? 'border-red-500' : ''}
                  />
                  {validationErrors.username && (
                    <p className="text-sm text-red-600">{validationErrors.username}</p>
                  )}
                </div>
                
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={formState.showPassword ? 'text' : 'password'}
                      value={credentials.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading || formState.isLocked}
                      className={validationErrors.password ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setFormState(prev => ({ 
                        ...prev, 
                        showPassword: !prev.showPassword 
                      }))}
                      disabled={isLoading || formState.isLocked}
                    >
                      {formState.showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-600">{validationErrors.password}</p>
                  )}
                </div>

                {/* Machine Selection (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="machine">Machine (Optional)</Label>
                  <Select 
                    value={credentials.machineId} 
                    onValueChange={(value) => handleInputChange('machineId', value)}
                    disabled={isLoading || formState.isLocked}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select machine (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific machine</SelectItem>
                      {machines.map(machine => (
                        <SelectItem key={machine.id} value={machine.id}>
                          {machine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Shift Selection (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="shift">Shift (Optional)</Label>
                  <Select 
                    value={credentials.shiftCode} 
                    onValueChange={(value) => handleInputChange('shiftCode', value)}
                    disabled={isLoading || formState.isLocked}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any shift</SelectItem>
                      {shifts.map(shift => (
                        <SelectItem key={shift.code} value={shift.code}>
                          {shift.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formState.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormState(prev => ({ ...prev, rememberMe: checked as boolean }))
                    }
                    disabled={isLoading || formState.isLocked}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Remember me on this device
                  </Label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || formState.isLocked}
                >
                  {isLoading ? (
                    <>
                      <Settings className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>

                {/* Emergency Access Button */}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => setEmergencyMode(true)}
                  disabled={isLoading}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Emergency Access
                </Button>
              </form>
            )}

            {/* Demo Credentials Info */}
            {!emergencyMode && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div><strong>Admin:</strong> admin / password</div>
                  <div><strong>Operator:</strong> operator1 / password</div>
                  <div><strong>Technician:</strong> tech_smith / password</div>
                  <div><strong>Supervisor:</strong> supervisor_jane / password</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * For demo purposes only. Production systems use secure authentication.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}