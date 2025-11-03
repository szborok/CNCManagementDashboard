import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { 
  Settings,
  Play,
  Pause,
  RefreshCw,
  Save,
  FileJson,
  Archive,
  Grid3X3,
  FolderOpen,
  Building2,
  Database,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useSetupConfig } from '../hooks/useSetupConfig';

interface AdminSettingsProps {
  theme: "auto" | "light" | "dark";
  fontSize: "small" | "normal" | "large";
  highContrast: boolean;
  onThemeChange: (theme: "auto" | "light" | "dark") => void;
  onFontSizeChange: (size: "small" | "normal" | "large") => void;
  onHighContrastChange: (enabled: boolean) => void;
}

interface ModuleProcessingState {
  jsonScanner: boolean;
  toolManager: boolean;
  clampingPlateManager: boolean;
}

export default function AdminSettings({
  theme,
  fontSize,
  highContrast,
  onThemeChange,
  onFontSizeChange,
  onHighContrastChange,
}: AdminSettingsProps) {
  const { config, saveConfig } = useSetupConfig();
  const [localConfig, setLocalConfig] = useState(config);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [storageStrategy, setStorageStrategy] = useState<'mono' | 'individual'>('mono');
  const [processingStates, setProcessingStates] = useState<ModuleProcessingState>({
    jsonScanner: true,
    toolManager: true,
    clampingPlateManager: true
  });

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  useEffect(() => {
    // Load processing states from localStorage
    const savedStates = localStorage.getItem('moduleProcessingStates');
    if (savedStates) {
      setProcessingStates(JSON.parse(savedStates));
    }
  }, []);

  const updateLocalConfig = (updates: any) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    setHasChanges(true);
  };

  const handleSaveConfiguration = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('idle');
      
      const success = await saveConfig(localConfig);
      
      if (success) {
        setHasChanges(false);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleModuleProcessing = (module: keyof ModuleProcessingState) => {
    const newStates = {
      ...processingStates,
      [module]: !processingStates[module]
    };
    setProcessingStates(newStates);
    localStorage.setItem('moduleProcessingStates', JSON.stringify(newStates));
  };

  const handleFileSelect = (type: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const folderPath = target.files[0].webkitRelativePath.split('/')[0];
        if (type === 'jsonAnalyzerPath') {
          updateLocalConfig({
            modules: {
              ...localConfig.modules,
              jsonAnalyzer: {
                ...localConfig.modules.jsonAnalyzer,
                dataPath: folderPath
              }
            }
          });
        } else if (type === 'toolManagerExcelPath') {
          updateLocalConfig({
            modules: {
              ...localConfig.modules,
              matrixTools: {
                ...localConfig.modules.matrixTools,
                paths: {
                  ...localConfig.modules.matrixTools.paths,
                  excelInputPath: folderPath
                }
              }
            }
          });
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">
          Manage system configuration, auto-processing controls, and application preferences
        </p>
      </div>

      {/* Auto-Processing Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Auto-Processing Controls
          </CardTitle>
          <CardDescription>
            Control which modules are automatically processing data in the background
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* JSON Scanner Control */}
          {localConfig.companyFeatures.jsonScanner && (
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <FileJson className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">JSON Scanner</h4>
                  <p className="text-sm text-muted-foreground">
                    {localConfig.modules.jsonAnalyzer.mode === 'auto' 
                      ? 'Automatically processes JSON files from configured path'
                      : 'Manual processing mode - no auto-processing'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={processingStates.jsonScanner ? 'default' : 'secondary'}>
                  {processingStates.jsonScanner ? 'Running' : 'Stopped'}
                </Badge>
                {localConfig.modules.jsonAnalyzer.mode === 'auto' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleModuleProcessing('jsonScanner')}
                    className="flex items-center gap-1"
                  >
                    {processingStates.jsonScanner ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Tool Manager Control */}
          {localConfig.companyFeatures.toolManager && (
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Archive className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium">Tool Manager</h4>
                  <p className="text-sm text-muted-foreground">
                    {localConfig.modules.matrixTools.mode === 'auto' 
                      ? 'Automatically processes Excel files and tool inventory'
                      : 'Manual processing mode - no auto-processing'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={processingStates.toolManager ? 'default' : 'secondary'}>
                  {processingStates.toolManager ? 'Running' : 'Stopped'}
                </Badge>
                {localConfig.modules.matrixTools.mode === 'auto' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleModuleProcessing('toolManager')}
                    className="flex items-center gap-1"
                  >
                    {processingStates.toolManager ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Clamping Plate Manager */}
          {localConfig.companyFeatures.clampingPlateManager && (
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Grid3X3 className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-medium">Clamping Plate Manager</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitors plate database and model files for changes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={processingStates.clampingPlateManager ? 'default' : 'secondary'}>
                  {processingStates.clampingPlateManager ? 'Running' : 'Stopped'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleModuleProcessing('clampingPlateManager')}
                  className="flex items-center gap-1"
                >
                  {processingStates.clampingPlateManager ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Start
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 1. Company Information (matches SetupWizard step 1) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Basic company details and branding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={localConfig.companyName}
                onChange={(e) => updateLocalConfig({ companyName: e.target.value })}
                placeholder="Enter your company name"
              />
            </div>
            <div>
              <Label htmlFor="company-logo">Company Logo Path</Label>
              <Input
                id="company-logo"
                value={localConfig.companyLogo || ''}
                onChange={(e) => updateLocalConfig({ companyLogo: e.target.value })}
                placeholder="./assets/logo.png"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Module Configuration (matches SetupWizard step 2) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Module Configuration
          </CardTitle>
          <CardDescription>
            Configure application modules and their settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* JSON Scanner */}
            {localConfig.companyFeatures.jsonScanner && (
              <div className="p-3 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    JSON Scanner
                  </h5>
                  <Switch
                    checked={localConfig.modules.jsonAnalyzer.mode === 'auto'}
                    onCheckedChange={(checked) => updateLocalConfig({
                      modules: {
                        ...localConfig.modules,
                        jsonAnalyzer: {
                          ...localConfig.modules.jsonAnalyzer,
                          mode: checked ? 'auto' : 'manual'
                        }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="json-path">Data Path</Label>
                  <div className="flex gap-2">
                    <Input
                      id="json-path"
                      value={localConfig.modules.jsonAnalyzer.dataPath}
                      onChange={(e) => updateLocalConfig({
                        modules: {
                          ...localConfig.modules,
                          jsonAnalyzer: {
                            ...localConfig.modules.jsonAnalyzer,
                            dataPath: e.target.value
                          }
                        }
                      })}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileSelect('jsonAnalyzerPath')}
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tool Manager */}
            {localConfig.companyFeatures.toolManager && (
              <div className="p-3 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium flex items-center gap-2">
                    <Archive className="h-4 w-4" />
                    Tool Manager
                  </h5>
                  <Switch
                    checked={localConfig.modules.matrixTools.mode === 'auto'}
                    onCheckedChange={(checked) => updateLocalConfig({
                      modules: {
                        ...localConfig.modules,
                        matrixTools: {
                          ...localConfig.modules.matrixTools,
                          mode: checked ? 'auto' : 'manual'
                        }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="excel-path">Excel Input Path</Label>
                  <div className="flex gap-2">
                    <Input
                      id="excel-path"
                      value={localConfig.modules.matrixTools.paths.excelInputPath}
                      onChange={(e) => updateLocalConfig({
                        modules: {
                          ...localConfig.modules,
                          matrixTools: {
                            ...localConfig.modules.matrixTools,
                            paths: {
                              ...localConfig.modules.matrixTools.paths,
                              excelInputPath: e.target.value
                            }
                          }
                        }
                      })}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileSelect('toolManagerExcelPath')}
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Advanced Tool Manager Settings */}
                <div className="space-y-3 mt-4 pt-3 border-t">
                  <h6 className="text-sm font-medium text-gray-700">Advanced Settings</h6>
                  
                  <div>
                    <Label htmlFor="json-input-path">JSON Input Path</Label>
                    <div className="flex gap-2">
                      <Input
                        id="json-input-path"
                        value={localConfig.modules.matrixTools.paths.jsonInputPath}
                        onChange={(e) => updateLocalConfig({
                          modules: {
                            ...localConfig.modules,
                            matrixTools: {
                              ...localConfig.modules.matrixTools,
                              paths: {
                                ...localConfig.modules.matrixTools.paths,
                                jsonInputPath: e.target.value
                              }
                            }
                          }
                        })}
                        placeholder="./data/json-output"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileSelect('toolManagerJsonPath')}
                      >
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="inventory-file">Inventory File Path</Label>
                    <div className="flex gap-2">
                      <Input
                        id="inventory-file"
                        value={localConfig.modules.matrixTools.inventoryFile}
                        onChange={(e) => updateLocalConfig({
                          modules: {
                            ...localConfig.modules,
                            matrixTools: {
                              ...localConfig.modules.matrixTools,
                              inventoryFile: e.target.value
                            }
                          }
                        })}
                        placeholder="./inventory/tools.xlsx"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileSelect('toolManagerInventory')}
                      >
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Features</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Excel Processing</span>
                      <Switch
                        checked={localConfig.modules.matrixTools.features.excelProcessing}
                        onCheckedChange={(checked) => updateLocalConfig({
                          modules: {
                            ...localConfig.modules,
                            matrixTools: {
                              ...localConfig.modules.matrixTools,
                              features: {
                                ...localConfig.modules.matrixTools.features,
                                excelProcessing: checked
                              }
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">JSON Scanning</span>
                      <Switch
                        checked={localConfig.modules.matrixTools.features.jsonScanning}
                        onCheckedChange={(checked) => updateLocalConfig({
                          modules: {
                            ...localConfig.modules,
                            matrixTools: {
                              ...localConfig.modules.matrixTools,
                              features: {
                                ...localConfig.modules.matrixTools.features,
                                jsonScanning: checked
                              }
                            }
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Clamping Plates Manager */}
            {localConfig.companyFeatures.clampingPlateManager && (
              <div className="p-3 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    Clamping Plates Manager
                  </h5>
                  <Switch
                    checked={localConfig.modules.platesManager.mode === 'auto'}
                    onCheckedChange={(checked) => updateLocalConfig({
                      modules: {
                        ...localConfig.modules,
                        platesManager: {
                          ...localConfig.modules.platesManager,
                          mode: checked ? 'auto' : 'manual'
                        }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="plates-data-path">Data Path</Label>
                  <div className="flex gap-2">
                    <Input
                      id="plates-data-path"
                      value={localConfig.modules.platesManager.dataPath}
                      onChange={(e) => updateLocalConfig({
                        modules: {
                          ...localConfig.modules,
                          platesManager: {
                            ...localConfig.modules.platesManager,
                            dataPath: e.target.value
                          }
                        }
                      })}
                      placeholder="./data/plates"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileSelect('platesManagerPath')}
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="plates-database">Plate Database Path</Label>
                  <div className="flex gap-2">
                    <Input
                      id="plates-database"
                      value={localConfig.modules.platesManager.plateDatabase}
                      onChange={(e) => updateLocalConfig({
                        modules: {
                          ...localConfig.modules,
                          platesManager: {
                            ...localConfig.modules.platesManager,
                            plateDatabase: e.target.value
                          }
                        }
                      })}
                      placeholder="./database/plates.db"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileSelect('platesDatabase')}
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Authentication Configuration (matches SetupWizard step 3) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Authentication Settings
          </CardTitle>
          <CardDescription>
            Configure user authentication and access management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="auth-method">Authentication Method</Label>
              <select
                id="auth-method"
                value={localConfig.authentication.method}
                onChange={(e) => updateLocalConfig({
                  authentication: { 
                    ...localConfig.authentication, 
                    method: e.target.value as 'file' | 'database' | 'ldap' 
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="file">File-based Authentication</option>
                <option value="database">Database Authentication</option>
                <option value="ldap">LDAP Authentication</option>
              </select>
            </div>

            {localConfig.authentication.method === 'file' && (
              <div>
                <Label htmlFor="employee-file">Employee File Path</Label>
                <Input
                  id="employee-file"
                  value={localConfig.authentication.employeeFile || ''}
                  onChange={(e) => updateLocalConfig({
                    authentication: { ...localConfig.authentication, employeeFile: e.target.value }
                  })}
                  placeholder="./data/employees.txt"
                />
              </div>
            )}

            {localConfig.authentication.method === 'database' && (
              <div>
                <Label htmlFor="db-connection">Database Connection String</Label>
                <Input
                  id="db-connection"
                  value={localConfig.authentication.databaseConnection || ''}
                  onChange={(e) => updateLocalConfig({
                    authentication: { ...localConfig.authentication, databaseConnection: e.target.value }
                  })}
                  placeholder="Server=localhost;Database=CNCUsers;Trusted_Connection=true;"
                />
              </div>
            )}

            {localConfig.authentication.method === 'ldap' && (
              <div>
                <Label htmlFor="ldap-server">LDAP Server</Label>
                <Input
                  id="ldap-server"
                  value={localConfig.authentication.ldapServer || ''}
                  onChange={(e) => updateLocalConfig({
                    authentication: { ...localConfig.authentication, ldapServer: e.target.value }
                  })}
                  placeholder="ldap://company.com"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 4. Storage Configuration (matches SetupWizard step 4) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Configuration
          </CardTitle>
          <CardDescription>
            Configure data storage strategy and file paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Storage Strategy */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Storage Organization Strategy</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    storageStrategy === 'mono' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setStorageStrategy('mono')}
                >
                  <h5 className="font-medium mb-2">Mono Folder Strategy</h5>
                  <p className="text-sm text-gray-600">All data stored in a single base folder structure</p>
                </div>
                
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    storageStrategy === 'individual' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setStorageStrategy('individual')}
                >
                  <h5 className="font-medium mb-2">Individual Folders Strategy</h5>
                  <p className="text-sm text-gray-600">Separate folders for each module and data type</p>
                </div>
              </div>
            </div>

            {/* Storage Paths - conditionally shown based on strategy */}
            <div className="space-y-4">
              {storageStrategy === 'mono' ? (
                // Mono strategy paths
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="base-path">Base Path</Label>
                    <Input
                      id="base-path"
                      value={localConfig.storage.basePath || ''}
                      onChange={(e) => updateLocalConfig({
                        storage: { ...localConfig.storage, basePath: e.target.value }
                      })}
                      placeholder="./data"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="logs-path">Logs Path</Label>
                      <Input
                        id="logs-path"
                        value={localConfig.storage.logsPath}
                        onChange={(e) => updateLocalConfig({
                          storage: { ...localConfig.storage, logsPath: e.target.value }
                        })}
                        placeholder="./logs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="backup-path">Backup Path</Label>
                      <Input
                        id="backup-path"
                        value={localConfig.storage.backupPath}
                        onChange={(e) => updateLocalConfig({
                          storage: { ...localConfig.storage, backupPath: e.target.value }
                        })}
                        placeholder="./backups"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Individual strategy paths
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="temp-path">Temporary Files Path</Label>
                      <Input
                        id="temp-path"
                        value={localConfig.storage.tempPath || ''}
                        onChange={(e) => updateLocalConfig({
                          storage: { ...localConfig.storage, tempPath: e.target.value }
                        })}
                        placeholder="./temp"
                      />
                    </div>
                    <div>
                      <Label htmlFor="output-path">Output Files Path</Label>
                      <Input
                        id="output-path"
                        value={localConfig.storage.outputPath || ''}
                        onChange={(e) => updateLocalConfig({
                          storage: { ...localConfig.storage, outputPath: e.target.value }
                        })}
                        placeholder="./output"
                      />
                    </div>
                    <div>
                      <Label htmlFor="logs-path-ind">Logs Path</Label>
                      <Input
                        id="logs-path-ind"
                        value={localConfig.storage.logsPath}
                        onChange={(e) => updateLocalConfig({
                          storage: { ...localConfig.storage, logsPath: e.target.value }
                        })}
                        placeholder="./logs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="backup-path-ind">Backup Path</Label>
                      <Input
                        id="backup-path-ind"
                        value={localConfig.storage.backupPath}
                        onChange={(e) => updateLocalConfig({
                          storage: { ...localConfig.storage, backupPath: e.target.value }
                        })}
                        placeholder="./backups"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Additional Features (matches SetupWizard step 5) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Additional Features
          </CardTitle>
          <CardDescription>
            Configure additional system features and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Dark Mode Support</Label>
                <p className="text-xs text-gray-500">Enable dark theme support</p>
              </div>
              <Switch
                checked={localConfig.features.darkMode}
                onCheckedChange={(checked) => updateLocalConfig({
                  features: { ...localConfig.features, darkMode: checked }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Notifications</Label>
                <p className="text-xs text-gray-500">System notifications</p>
              </div>
              <Switch
                checked={localConfig.features.notifications}
                onCheckedChange={(checked) => updateLocalConfig({
                  features: { ...localConfig.features, notifications: checked }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto Backup</Label>
                <p className="text-xs text-gray-500">Automatic data backups</p>
              </div>
              <Switch
                checked={localConfig.features.autoBackup}
                onCheckedChange={(checked) => updateLocalConfig({
                  features: { ...localConfig.features, autoBackup: checked }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Export Reports</Label>
                <p className="text-xs text-gray-500">Enable report exports</p>
              </div>
              <Switch
                checked={localConfig.features.exportReports}
                onCheckedChange={(checked) => updateLocalConfig({
                  features: { ...localConfig.features, exportReports: checked }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              {saveStatus === 'success' && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">Configuration saved successfully</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Failed to save configuration</span>
                </div>
              )}
            </div>
            <Button
              onClick={handleSaveConfiguration}
              disabled={!hasChanges || isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}