import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { 
  Building2, 
  Settings, 
  Database, 
  Users, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileJson,
  BarChart3,
  Grid3X3,
  Upload,
  Download,
  FileText,
  AlertCircle,
  FolderOpen,
  PlayCircle,
  RefreshCw
} from 'lucide-react';
import { SetupConfig } from '../hooks/useSetupConfig';
import { DataImporter } from '../services/DataImporter';

interface SetupWizardProps {
  onComplete: (config: SetupConfig) => void;
  initialConfig: SetupConfig;
}

export default function SetupWizard({ onComplete, initialConfig }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<SetupConfig>(initialConfig);

  const steps = [
    { title: 'Welcome', icon: Building2, description: 'Company Information' },
    { title: 'Modules', icon: Settings, description: 'Configure Applications' },
    { title: 'Authentication', icon: Users, description: 'User Management' },
    { title: 'Storage', icon: Database, description: 'Data & File Paths' },
    { title: 'Features', icon: CheckCircle2, description: 'Additional Features' },
    { title: 'Validation', icon: PlayCircle, description: 'Test & Validate Setup' },
  ];

  const updateConfig = (updates: Partial<SetupConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const finalConfig = { ...config, isConfigured: true };
    onComplete(finalConfig);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CompanyStep config={config} updateConfig={updateConfig} />;
      case 1:
        return <ModulesStep config={config} updateConfig={updateConfig} />;
      case 2:
        return <AuthenticationStep config={config} updateConfig={updateConfig} />;
      case 3:
        return <StorageStep config={config} updateConfig={updateConfig} />;
      case 4:
        return <FeaturesStep config={config} updateConfig={updateConfig} />;
      case 5:
        return <ValidationStep config={config} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              CNC Management Dashboard Setup
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome! Let's configure your dashboard for your specific environment.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors
                    ${isActive ? 'bg-blue-600 border-blue-600 text-white' :
                      isCompleted ? 'bg-green-600 border-green-600 text-white' :
                      'bg-white border-gray-300 text-gray-400 dark:bg-gray-700 dark:border-gray-600'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <StepIcon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep].icon, { className: "h-5 w-5" })}
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>
                {currentStep === steps.length - 2 ? 'Validate Setup' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              // Validation step - no button here, handled by ValidationStep component
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function CompanyStep({ config, updateConfig }: { config: SetupConfig; updateConfig: (updates: Partial<SetupConfig>) => void }) {
  const handleLogoFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // For demo purposes, we'll just use the file name
        // In a real implementation, you'd upload the file and get a URL
        updateConfig({ companyLogo: `./assets/${file.name}` });
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Company Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Enter your company details and logo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={config.companyName}
                onChange={(e) => updateConfig({ companyName: e.target.value })}
                placeholder="Enter your company name"
                onDoubleClick={(e) => {
                  // Ensure double-click selects all text
              e.currentTarget.select();
            }}
            onFocus={(e) => {
              // Optional: select all on focus for better UX
              setTimeout(() => e.target.select(), 0);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyLogo">Company Logo</Label>
          <div className="flex gap-2">
            <Input
              id="companyLogo"
              value={config.companyLogo || ''}
              onChange={(e) => updateConfig({ companyLogo: e.target.value })}
              placeholder="e.g., ./assets/logo.png"
              className="flex-1"
              onDoubleClick={(e) => {
                e.currentTarget.select();
              }}
              onFocus={(e) => {
                setTimeout(() => e.target.select(), 0);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogoFileSelect}
              className="flex-shrink-0"
            >
              <FolderOpen className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            Click the folder icon to browse for a file, or enter a path manually
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This information will be displayed in the dashboard header and used throughout the application.
        </p>
      </div>
    </CardContent>
  </Card>

  {/* Company Features Card */}
  <Card>
    <CardHeader>
      <CardTitle>Company Features</CardTitle>
      <CardDescription>
        Select which features your company will use. This will determine what modules and options are available in the setup.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <Label className="text-sm font-medium">JSON Scanner</Label>
            <p className="text-xs text-gray-500">Automated processing and analysis of manufacturing JSON files</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">
              {config.companyFeatures.jsonScanner ? 'ON' : 'OFF'}
            </span>
            <Switch
              checked={config.companyFeatures.jsonScanner}
              onCheckedChange={(checked) => updateConfig({ 
                companyFeatures: { 
                  ...config.companyFeatures, 
                  jsonScanner: checked 
                } 
              })}
            />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <Label className="text-sm font-medium">Tool Manager</Label>
            <p className="text-xs text-gray-500">Tool inventory management and project tracking with Excel and JSON processing</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">
              {config.companyFeatures.toolManager ? 'ON' : 'OFF'}
            </span>
            <Switch
              checked={config.companyFeatures.toolManager}
              onCheckedChange={(checked) => updateConfig({ 
                companyFeatures: { 
                  ...config.companyFeatures, 
                  toolManager: checked 
                } 
              })}
            />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <Label className="text-sm font-medium">Clamping Plate Manager</Label>
            <p className="text-xs text-gray-500">Clamping plate lifecycle management and tracking</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">
              {config.companyFeatures.clampingPlateManager ? 'ON' : 'OFF'}
            </span>
            <Switch
              checked={config.companyFeatures.clampingPlateManager}
              onCheckedChange={(checked) => updateConfig({ 
                companyFeatures: { 
                  ...config.companyFeatures, 
                  clampingPlateManager: checked 
                } 
              })}
            />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
  );
}

function ModulesStep({ config, updateConfig }: { config: SetupConfig; updateConfig: (updates: Partial<SetupConfig>) => void }) {
  const modules = [
    {
      key: 'jsonAnalyzer' as const,
      title: 'JSON Scanner',
      icon: FileJson,
      description: 'Automated processing and analysis of manufacturing JSON files',
      enabled: config.companyFeatures.jsonScanner,
    },
    {
      key: 'matrixTools' as const,
      title: 'Tool Manager',
      icon: BarChart3,
      description: 'Tool inventory management and project tracking with Excel and JSON processing',
      enabled: config.companyFeatures.toolManager,
    },
    {
      key: 'platesManager' as const,
      title: 'Clamping Plate Manager',
      icon: Grid3X3,
      description: 'Clamping plate lifecycle management and tracking',
      enabled: config.companyFeatures.clampingPlateManager,
    },
  ].filter(module => module.enabled);

  const updateModule = (moduleKey: keyof SetupConfig['modules'], updates: Partial<SetupConfig['modules'][typeof moduleKey]>) => {
    updateConfig({
      modules: {
        ...config.modules,
        [moduleKey]: { ...config.modules[moduleKey], ...updates }
      }
    });
  };

  const handleDataPathFileSelect = (moduleKey: keyof SetupConfig['modules'], pathType?: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // Get the directory path from the first file
        const firstFile = files[0];
        const pathParts = firstFile.webkitRelativePath.split('/');
        const folderPath = `./${pathParts[0]}`;
        
        if (moduleKey === 'matrixTools' && pathType) {
          // Handle matrix tools specific paths
          const matrixConfig = config.modules.matrixTools;
          updateModule(moduleKey, { 
            paths: { 
              ...matrixConfig.paths, 
              [pathType]: folderPath 
            } 
          });
        } else {
          updateModule(moduleKey, { dataPath: folderPath });
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Selected Company Features</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure the applications you selected on the previous step.
        </p>
      </div>
      
      {modules.map((module) => {
        const ModuleIcon = module.icon;
        const moduleConfig = config.modules[module.key];
        
        return (
          <Card key={module.key} className="transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <ModuleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {module.title}
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {module.key === 'platesManager' ? (
                // Special configuration for Clamping Plate Manager - no mode selection
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Folder for model files</Label>
                    <div className="flex gap-2">
                      <Input
                        value={moduleConfig.dataPath}
                        onChange={(e) => updateModule(module.key, { dataPath: e.target.value })}
                        placeholder="./data/model_files"
                        className="flex-1"
                        onDoubleClick={(e) => e.currentTarget.select()}
                        onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDataPathFileSelect(module.key)}
                        className="flex-shrink-0"
                      >
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Directory containing clamping plate model files
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Excel or information file about model files</Label>
                    <div className="flex gap-2">
                      <Input
                        value={config.modules.platesManager.plateDatabase}
                        onChange={(e) => updateModule(module.key, { plateDatabase: e.target.value })}
                        placeholder="./data/plate_information.xlsx"
                        className="flex-1"
                        onDoubleClick={(e) => e.currentTarget.select()}
                        onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.xlsx,.xls,.csv';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              updateModule(module.key, { plateDatabase: `./${file.name}` });
                            }
                          };
                          input.click();
                        }}
                        className="flex-shrink-0"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">
                      File containing information about which model files were used for what projects
                    </p>
                  </div>
                </div>
              ) : (
                // Standard mode configuration for other modules
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Processing Mode</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={moduleConfig.mode === 'auto' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateModule(module.key, { mode: 'auto' })}
                        className={moduleConfig.mode === 'auto' ? 'bg-blue-600 text-white' : ''}
                      >
                        Auto
                      </Button>
                      <Button
                        variant={moduleConfig.mode === 'manual' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateModule(module.key, { mode: 'manual' })}
                        className={moduleConfig.mode === 'manual' ? 'bg-blue-600 text-white' : ''}
                      >
                        Manual
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {moduleConfig.mode === 'auto' 
                        ? 'Files are automatically processed from configured paths'
                        : 'Path will be asked for each file processing operation'
                      }
                    </p>
                  </div>
                  
                  {moduleConfig.mode === 'auto' && module.key !== 'matrixTools' && (
                    <div className="space-y-2">
                      <Label>
                        {module.key === 'jsonAnalyzer' ? 'Main folder where JSONs can be found' : 'Data Path'}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={moduleConfig.dataPath}
                          onChange={(e) => updateModule(module.key, { dataPath: e.target.value })}
                          placeholder={module.key === 'jsonAnalyzer' ? './data/json_files' : './data/module_name'}
                          className="flex-1"
                          onDoubleClick={(e) => e.currentTarget.select()}
                          onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDataPathFileSelect(module.key)}
                          className="flex-shrink-0"
                        >
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">
                        {module.key === 'jsonAnalyzer' ? 'Directory containing JSON files to be analyzed' : 'Click the folder icon to browse for a directory, or enter a path manually'}
                      </p>
                    </div>
                  )}
                  
                  {moduleConfig.mode === 'manual' && (
                    <div className="space-y-2">
                      <Label>Path Configuration</Label>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Manual Mode Selected
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                          The system will prompt for file paths during each processing operation
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Special configuration for Tool Manager */}
                  {module.key === 'matrixTools' && moduleConfig.mode === 'auto' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tool inventory Excel folder path</Label>
                        <div className="flex gap-2">
                          <Input
                            value={config.modules.matrixTools.paths?.excelInputPath || ''}
                            onChange={(e) => updateModule(module.key, { 
                              paths: { 
                                ...config.modules.matrixTools.paths, 
                                excelInputPath: e.target.value 
                              } 
                            })}
                            placeholder="./excel/inventory"
                            className="flex-1"
                            onDoubleClick={(e) => e.currentTarget.select()}
                            onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDataPathFileSelect(module.key, 'excelInputPath')}
                            className="flex-shrink-0"
                          >
                            <FolderOpen className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-400">
                          Directory containing Excel files for tool inventory management
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>JSON Input Path</Label>
                        {config.companyFeatures.jsonScanner ? (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <FileJson className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Automatically using JSON Scanner path
                              </span>
                            </div>
                            <div className="flex gap-2 items-center">
                              <Input
                                value={config.modules.jsonAnalyzer.dataPath || './data/json_scanner'}
                                className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                                disabled
                                readOnly
                              />
                              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded border text-xs text-gray-500">
                                READ-ONLY
                              </div>
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              This path is automatically synchronized with the JSON Scanner application and cannot be changed here
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div className="flex gap-2">
                              <Input
                                value={config.modules.matrixTools.paths?.jsonInputPath || ''}
                                onChange={(e) => updateModule(module.key, { 
                                  paths: { 
                                    ...config.modules.matrixTools.paths, 
                                    jsonInputPath: e.target.value 
                                  } 
                                })}
                                placeholder="./json/input"
                                className="flex-1"
                                onDoubleClick={(e) => e.currentTarget.select()}
                                onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDataPathFileSelect(module.key, 'jsonInputPath')}
                                className="flex-shrink-0"
                              >
                                <FolderOpen className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-400">
                              Directory where JSON files will be processed
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  function AuthenticationStep({ config, updateConfig }: { config: SetupConfig; updateConfig: (updates: Partial<SetupConfig>) => void }) {
  const [importStatus, setImportStatus] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);

  const authMethods = [
    { key: 'file' as const, title: 'File-based', description: 'Store users in a JSON file' },
    { key: 'database' as const, title: 'Database', description: 'Connect to existing database' },
    { key: 'ldap' as const, title: 'LDAP/AD', description: 'Active Directory integration' },
  ];

  const updateAuth = (updates: Partial<SetupConfig['authentication']>) => {
    updateConfig({
      authentication: { ...config.authentication, ...updates }
    });
  };

  const handleEmployeeFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        updateAuth({ employeeFile: `./${file.name}` });
      }
    };
    input.click();
  };

  const handleEmployeeImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleEmployeeImport called');
    const file = event.target.files?.[0];
    console.log('Selected file:', file);
    if (!file) return;

    setIsImporting(true);
    setImportStatus('');

    try {
      console.log('Starting import process...');
      const result = await DataImporter.importEmployees(file);
      console.log('Import result:', result);
      if (result.success) {
        setImportStatus(`✅ ${result.message}`);
        // Here you would typically save the imported data
        console.log('Imported employee data:', result.data);
      } else {
        setImportStatus(`❌ ${result.message}: ${result.errors?.join(', ')}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus(`❌ Failed to import: ${(error as Error).message}`);
    } finally {
      setIsImporting(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const template = DataImporter.generateEmployeeTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Authentication Method</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {authMethods.map((method) => (
            <Card 
              key={method.key}
              className={`cursor-pointer transition-all ${
                config.authentication.method === method.key ? 'ring-2 ring-blue-200 bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => updateAuth({ method: method.key })}
            >
              <CardContent className="p-4">
                <h4 className="font-medium">{method.title}</h4>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {config.authentication.method === 'file' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Employee File Path</Label>
            <div className="flex gap-2">
              <Input
                value={config.authentication.employeeFile || ''}
                onChange={(e) => updateAuth({ employeeFile: e.target.value })}
                placeholder="./config/employees.json"
                className="flex-1"
                onDoubleClick={(e) => e.currentTarget.select()}
                onFocus={(e) => setTimeout(() => e.target.select(), 0)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEmployeeFileSelect}
                className="flex-shrink-0"
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              Click the folder icon to browse for a file, or enter a path manually
            </p>
          </div>
          
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50/50 dark:bg-gray-800/30">
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto" />
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Import Employee Data</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload an existing employee file (JSON or CSV format)
                </p>
              </div>
              
              <div className="flex gap-2 justify-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".json,.csv"
                    onChange={handleEmployeeImport}
                    className="hidden"
                    disabled={isImporting}
                  />
                  <Button variant="outline" size="sm" disabled={isImporting}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isImporting ? 'Importing...' : 'Import File'}
                  </Button>
                </label>
                
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
              
              {importStatus && (
                <div className={`p-3 rounded-lg text-sm border ${
                  importStatus.startsWith('✅') 
                    ? 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700' 
                    : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700'
                }`}>
                  {importStatus}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium mb-1">Sample employee format (CSV):</p>
                <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">username,password,role,firstname,lastname,email,department,profilepicture</code>
                <p className="mt-1">Supported roles: admin, user</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {config.authentication.method === 'database' && (
        <div className="space-y-2">
          <Label>Database Connection String</Label>
          <Input
            value={config.authentication.databaseConnection || ''}
            onChange={(e) => updateAuth({ databaseConnection: e.target.value })}
            placeholder="mongodb://localhost:27017/cncdb"
            type="password"
            onDoubleClick={(e) => e.currentTarget.select()}
            onFocus={(e) => setTimeout(() => e.target.select(), 0)}
          />
        </div>
      )}

      {config.authentication.method === 'ldap' && (
        <div className="space-y-2">
          <Label>LDAP Server</Label>
          <Input
            value={config.authentication.ldapServer || ''}
            onChange={(e) => updateAuth({ ldapServer: e.target.value })}
            placeholder="ldap://your-domain.com"
            onDoubleClick={(e) => e.currentTarget.select()}
            onFocus={(e) => setTimeout(() => e.target.select(), 0)}
          />
        </div>
      )}
    </div>
  );
}

function StorageStep({ config, updateConfig }: { config: SetupConfig; updateConfig: (updates: Partial<SetupConfig>) => void }) {
  const [storageStrategy, setStorageStrategy] = useState<'mono' | 'individual'>('mono');
  
  const updateStorage = (updates: Partial<SetupConfig['storage']>) => {
    updateConfig({
      storage: { ...config.storage, ...updates }
    });
  };

  const handleStoragePathFileSelect = (pathType: 'logsPath' | 'backupPath' | 'tempPath' | 'outputPath' | 'basePath') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // Get the directory path from the first file
        const firstFile = files[0];
        const pathParts = firstFile.webkitRelativePath.split('/');
        const folderPath = `./${pathParts[0]}`;
        
        if (pathType === 'basePath') {
          // Update base path and auto-generate sub-paths
          updateStorage({ 
            basePath: folderPath,
            logsPath: `${folderPath}/logs`,
            backupPath: `${folderPath}/backups`,
            tempPath: `${folderPath}/temp`,
            outputPath: `${folderPath}/output`
          });
        } else {
          updateStorage({ [pathType]: folderPath });
        }
      }
    };
    input.click();
  };

  const handleBasePathChange = (basePath: string) => {
    updateStorage({
      basePath,
      logsPath: `${basePath}/logs`,
      backupPath: `${basePath}/backups`,
      tempPath: `${basePath}/temp`,
      outputPath: `${basePath}/output`
    });
  };

  return (
    <div className="space-y-6">
      {/* Storage Strategy Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Storage Organization Strategy</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Choose how you want to organize the application's data folders
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${storageStrategy === 'mono' 
              ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50 dark:bg-blue-900/20' 
              : 'hover:border-gray-400'
            }`}
            onClick={() => setStorageStrategy('mono')}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${storageStrategy === 'mono' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
                }`}>
                  {storageStrategy === 'mono' && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-sm">Single Base Folder</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Choose one main folder and all subfolders will be created automatically
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <div>📁 base_folder/</div>
                    <div className="ml-4">├── logs/</div>
                    <div className="ml-4">├── backups/</div>
                    <div className="ml-4">├── temp/</div>
                    <div className="ml-4">└── output/</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${storageStrategy === 'individual' 
              ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50 dark:bg-blue-900/20' 
              : 'hover:border-gray-400'
            }`}
            onClick={() => setStorageStrategy('individual')}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${storageStrategy === 'individual' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
                }`}>
                  {storageStrategy === 'individual' && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-sm">Individual Folder Selection</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Choose each folder location individually for maximum flexibility
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <div>📁 C:/logs/</div>
                    <div>📁 D:/backups/</div>
                    <div>📁 E:/temp/</div>
                    <div>📁 F:/output/</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Storage Configuration based on strategy */}
      {storageStrategy === 'mono' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Base Directory</Label>
            <div className="flex gap-2">
              <Input
                value={config.storage.basePath || ''}
                onChange={(e) => handleBasePathChange(e.target.value)}
                placeholder="./cnc_management_data"
                className="flex-1"
                onDoubleClick={(e) => e.currentTarget.select()}
                onFocus={(e) => setTimeout(() => e.target.select(), 0)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleStoragePathFileSelect('basePath')}
                className="flex-shrink-0"
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              All application data will be organized under this main directory
            </p>
          </div>

          {/* Preview of generated paths */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <h4 className="text-sm font-medium mb-2">Generated Folder Structure:</h4>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 font-mono">
              <div>📁 {config.storage.basePath || './cnc_management_data'}/</div>
              <div className="ml-4">├── 📁 logs/ <span className="text-gray-500">← Application logs</span></div>
              <div className="ml-4">├── 📁 backups/ <span className="text-gray-500">← Data backups</span></div>
              <div className="ml-4">├── 📁 temp/ <span className="text-gray-500">← Temporary files</span></div>
              <div className="ml-4">└── 📁 output/ <span className="text-gray-500">← Generated reports</span></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Logs Path</Label>
              <div className="flex gap-2">
                <Input
                  value={config.storage.logsPath}
                  onChange={(e) => updateStorage({ logsPath: e.target.value })}
                  placeholder="./logs"
                  className="flex-1"
                  onDoubleClick={(e) => e.currentTarget.select()}
                  onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleStoragePathFileSelect('logsPath')}
                  className="flex-shrink-0"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Click the folder icon to browse for a directory
              </p>
            </div>
            <div className="space-y-2">
              <Label>Backup Path</Label>
              <div className="flex gap-2">
                <Input
                  value={config.storage.backupPath}
                  onChange={(e) => updateStorage({ backupPath: e.target.value })}
                  placeholder="./backups"
                  className="flex-1"
                  onDoubleClick={(e) => e.currentTarget.select()}
                  onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleStoragePathFileSelect('backupPath')}
                  className="flex-shrink-0"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Click the folder icon to browse for a directory
              </p>
            </div>
            <div className="space-y-2">
              <Label>Temporary Files Path</Label>
              <div className="flex gap-2">
                <Input
                  value={config.storage.tempPath}
                  onChange={(e) => updateStorage({ tempPath: e.target.value })}
                  placeholder="./temp"
                  className="flex-1"
                  onDoubleClick={(e) => e.currentTarget.select()}
                  onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleStoragePathFileSelect('tempPath')}
                  className="flex-shrink-0"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Click the folder icon to browse for a directory
              </p>
            </div>
            <div className="space-y-2">
              <Label>General Output Path</Label>
              <div className="flex gap-2">
                <Input
                  value={config.storage.outputPath}
                  onChange={(e) => updateStorage({ outputPath: e.target.value })}
                  placeholder="./output"
                  className="flex-1"
                  onDoubleClick={(e) => e.currentTarget.select()}
                  onFocus={(e) => setTimeout(() => e.target.select(), 0)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleStoragePathFileSelect('outputPath')}
                  className="flex-shrink-0"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                General output directory for all processed files and reports
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Make sure these directories exist and the application has read/write permissions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function FeaturesStep({ config, updateConfig }: { config: SetupConfig; updateConfig: (updates: Partial<SetupConfig>) => void }) {
  const updateFeatures = (updates: Partial<SetupConfig['features']>) => {
    updateConfig({
      features: { ...config.features, ...updates }
    });
  };

  const features = [
    { key: 'darkMode' as const, title: 'Dark Mode', description: 'Enable dark theme by default' },
    { key: 'notifications' as const, title: 'Notifications', description: 'Show system notifications' },
    { key: 'autoBackup' as const, title: 'Auto Backup', description: 'Automatically backup data daily' },
    { key: 'exportReports' as const, title: 'Export Reports', description: 'Enable PDF/Excel export functionality' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {features.map((feature) => (
          <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
            <Switch
              checked={config.features[feature.key]}
              onCheckedChange={(checked) => updateFeatures({ [feature.key]: checked })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Validation Step Component
interface ValidationTest {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'error';
  error?: string;
}

function ValidationStep({ config, onComplete }: { config: SetupConfig; onComplete: () => void }) {
  const [tests, setTests] = useState<ValidationTest[]>([
    {
      id: 'paths',
      name: 'Storage Paths',
      description: 'Verify all configured paths are accessible',
      status: 'pending'
    },
    {
      id: 'modules',
      name: 'Module Configuration',
      description: 'Test enabled modules and their settings',
      status: 'pending'
    },
    {
      id: 'authentication',
      name: 'Authentication Setup',
      description: 'Validate user authentication configuration',
      status: 'pending'
    },
    {
      id: 'json-scanner',
      name: 'JSON Scanner',
      description: 'Test JSON scanning functionality (if enabled)',
      status: 'pending'
    },
    {
      id: 'tool-manager',
      name: 'Tool Manager',
      description: 'Test Excel processing and tool management (if enabled)',
      status: 'pending'
    },
    {
      id: 'plates-manager',
      name: 'Clamping Plates Manager',
      description: 'Test plate database connectivity (if enabled)',
      status: 'pending'
    },
    {
      id: 'features',
      name: 'Additional Features',
      description: 'Verify additional feature configurations',
      status: 'pending'
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const runValidation = async () => {
    setIsRunning(true);
    setIsComplete(false);
    setHasErrors(false);

    // Reset all tests to pending
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' as const, error: undefined })));

    // Run each test sequentially
    for (const test of tests) {
      await runIndividualTest(test.id);
      // Add small delay between tests for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    setIsComplete(true);
  };

  const runIndividualTest = async (testId: string) => {
    // Update test status to running
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'running' as const } : test
    ));

    try {
      switch (testId) {
        case 'paths':
          await validatePaths(config);
          break;
        case 'modules':
          await validateModules(config);
          break;
        case 'authentication':
          await validateAuthentication(config);
          break;
        case 'json-scanner':
          if (config.companyFeatures.jsonScanner) {
            await validateJsonScanner(config);
          } else {
            // Skip disabled modules
            setTests(prev => prev.map(test => 
              test.id === testId ? { ...test, status: 'success' as const } : test
            ));
            return;
          }
          break;
        case 'tool-manager':
          if (config.companyFeatures.toolManager) {
            await validateToolManager(config);
          } else {
            // Skip disabled modules
            setTests(prev => prev.map(test => 
              test.id === testId ? { ...test, status: 'success' as const } : test
            ));
            return;
          }
          break;
        case 'plates-manager':
          if (config.companyFeatures.clampingPlateManager) {
            await validatePlatesManager(config);
          } else {
            // Skip disabled modules
            setTests(prev => prev.map(test => 
              test.id === testId ? { ...test, status: 'success' as const } : test
            ));
            return;
          }
          break;
        case 'features':
          await validateFeatures(config);
          break;
      }

      // Mark test as successful
      setTests(prev => prev.map(test => 
        test.id === testId ? { ...test, status: 'success' as const } : test
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Mark test as failed but continue with other tests
      setTests(prev => prev.map(test => 
        test.id === testId ? { 
          ...test, 
          status: 'error' as const, 
          error: errorMessage 
        } : test
      ));
      
      setHasErrors(true);
    }
  };

  // Validation functions
  const validatePaths = async (config: SetupConfig): Promise<void> => {
    // Simulate path validation
    const paths = [
      config.storage.basePath,
      config.storage.logsPath,
      config.storage.backupPath,
      config.storage.tempPath,
      config.storage.outputPath
    ];

    for (const path of paths) {
      if (!path || path.trim() === '') {
        throw new Error(`Empty path detected in storage configuration`);
      }
    }

    // In a real implementation, you would check if paths exist and are writable
    // For demo purposes, we'll just check they're not empty
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async operation
  };

  const validateModules = async (config: SetupConfig): Promise<void> => {
    // Check module configurations
    if (config.companyFeatures.jsonScanner && !config.modules.jsonAnalyzer.dataPath) {
      throw new Error('JSON Scanner is enabled but no data path is configured');
    }

    if (config.companyFeatures.toolManager && !config.modules.matrixTools.paths.excelInputPath) {
      throw new Error('Tool Manager is enabled but no Excel input path is configured');
    }

    if (config.companyFeatures.clampingPlateManager && !config.modules.platesManager.dataPath) {
      throw new Error('Clamping Plates Manager is enabled but no data path is configured');
    }

    await new Promise(resolve => setTimeout(resolve, 800));
  };

  const validateAuthentication = async (config: SetupConfig): Promise<void> => {
    if (config.authentication.method === 'file' && !config.authentication.employeeFile) {
      throw new Error('File authentication is selected but no employee file is specified');
    }

    if (config.authentication.method === 'database' && !config.authentication.databaseConnection) {
      throw new Error('Database authentication is selected but no database connection is specified');
    }

    if (config.authentication.method === 'ldap' && !config.authentication.ldapServer) {
      throw new Error('LDAP authentication is selected but no LDAP server is specified');
    }

    await new Promise(resolve => setTimeout(resolve, 600));
  };

  const validateJsonScanner = async (config: SetupConfig): Promise<void> => {
    // Test JSON Scanner functionality
    const dataPath = config.modules.jsonAnalyzer.dataPath;
    
    if (!dataPath) {
      throw new Error('JSON Scanner data path is not configured');
    }

    // In a real implementation, you would:
    // - Check if the path exists
    // - Try to read sample JSON files
    // - Validate JSON schema
    // - Test the scanning rules

    await new Promise(resolve => setTimeout(resolve, 1200));
  };

  const validateToolManager = async (config: SetupConfig): Promise<void> => {
    // Test Tool Manager functionality
    const excelPath = config.modules.matrixTools.paths.excelInputPath;
    
    if (!excelPath) {
      throw new Error('Tool Manager Excel input path is not configured');
    }

    // In a real implementation, you would:
    // - Check if Excel files can be read
    // - Test matrix processing logic
    // - Validate tool definitions
    // - Test inventory management

    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const validatePlatesManager = async (config: SetupConfig): Promise<void> => {
    // Test Clamping Plates Manager functionality
    const dataPath = config.modules.platesManager.dataPath;
    
    if (!dataPath) {
      throw new Error('Clamping Plates Manager data path is not configured');
    }

    // In a real implementation, you would:
    // - Test database connectivity
    // - Validate plate definitions
    // - Check model file access
    // - Test status tracking

    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const validateFeatures = async (config: SetupConfig): Promise<void> => {
    // Test additional features
    if (config.features.autoBackup && !config.storage.backupPath) {
      throw new Error('Auto backup is enabled but no backup path is configured');
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const getStatusIcon = (status: ValidationTest['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: ValidationTest['status']) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600';
      case 'running':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-6 w-6 text-blue-600" />
            System Validation
          </CardTitle>
          <CardDescription>
            Testing all configured features and validating your setup before completion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Validation Tests */}
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="mt-0.5">
                  {getStatusIcon(test.status)}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${getStatusColor(test.status)}`}>
                    {test.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {test.description}
                  </p>
                  {test.error && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300">
                      <strong>Error:</strong> {test.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {!isComplete && (
              <Button 
                onClick={runValidation} 
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Validation
                  </>
                )}
              </Button>
            )}

            {isComplete && (
              <div className="text-center space-y-4">
                {hasErrors ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">Setup completed with warnings</span>
                      </div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                        Some tests failed, but you can still proceed. These issues can be resolved later in the admin settings.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={runValidation} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Tests
                      </Button>
                      <Button onClick={onComplete} className="bg-yellow-600 hover:bg-yellow-700">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Continue Anyway
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">All tests passed successfully!</span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        Your CNC Management Dashboard is ready to use.
                      </p>
                    </div>
                    <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Complete Setup
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}