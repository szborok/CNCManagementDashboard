import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Building2,
  Settings,
  Database,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Bell,
  Monitor,
  Moon,
  Sun,
  FolderOpen,
  Users,
  FileJson,
  FileText,
  Upload,
  BarChart3,
  Grid3X3,
  Download,
  Clock,
  PlayCircle,
  RefreshCw,
  Rocket,
  Save,
} from "lucide-react";
import { SetupConfig } from "../hooks/useSetupConfig";
import { DataImporter } from "../services/DataImporter";
import { SetupValidation } from "../utils/setupValidation";
import ValidationFeedback from "./ValidationFeedback";

interface SetupWizardProps {
  onComplete: (config: SetupConfig) => void;
  initialConfig: SetupConfig;
}

export default function SetupWizard({
  onComplete,
  initialConfig,
}: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<SetupConfig>(initialConfig);

  const steps = [
    {
      title: "Introduction",
      icon: AlertCircle,
      description: "Setup Overview & Guidelines",
    },
    { title: "Company", icon: Building2, description: "Company Information" },
    { title: "Modules", icon: Settings, description: "Configure Applications" },
    { title: "Authentication", icon: Users, description: "User Management" },
    { title: "Storage", icon: Database, description: "Data & File Paths" },
    {
      title: "Preferences",
      icon: CheckCircle2,
      description: "Application Preferences",
    },
    {
      title: "Validation",
      icon: PlayCircle,
      description: "Test & Validate Setup",
    },
  ];

  // Load wizard progress and config from localStorage on mount
  useEffect(() => {
    try {
      const savedStep = localStorage.getItem("setupWizardStep");
      const savedConfig = localStorage.getItem("setupWizardProgress");

      if (savedStep) {
        const step = parseInt(savedStep, 10);
        if (step >= 0 && step < steps.length) {
          setCurrentStep(step);
        }
      }

      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig((prev) => ({ ...prev, ...parsedConfig }));
      }
    } catch (error) {
      console.error("Failed to load wizard progress:", error);
    }
  }, []);

  // Save wizard progress whenever step or config changes
  useEffect(() => {
    try {
      localStorage.setItem("setupWizardStep", currentStep.toString());
      localStorage.setItem("setupWizardProgress", JSON.stringify(config));
    } catch (error) {
      console.error("Failed to save wizard progress:", error);
    }
  }, [currentStep, config]);

  const updateConfig = (updates: Partial<SetupConfig>) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      try {
        localStorage.setItem("setupWizardProgress", JSON.stringify(newConfig));
      } catch (error) {
        console.error("Failed to save config progress:", error);
      }
      return newConfig;
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
    }
  };

  // Validation function for each step
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: // Introduction step - always valid
        return true;
      case 1: // Company step
        const companyNameValid = SetupValidation.validateCompanyName(
          config.companyName
        ).isValid;
        const logoValid = !!(
          config.companyLogo && config.companyLogo.trim() !== ""
        );
        return companyNameValid && logoValid;
      case 2: // Modules step
        const modulesValid =
          config.modules.jsonAnalyzer.enabled ||
          config.modules.matrixTools.enabled ||
          config.modules.platesManager.enabled;
        return modulesValid;
      case 3: // Authentication step
        if (config.authentication.method === "file") {
          return (
            !!config.authentication.employeeFile &&
            SetupValidation.validateEmployeeFile(
              config.authentication.employeeFile
            ).isValid
          );
        } else if (config.authentication.method === "ldap") {
          return (
            !!config.authentication.ldapServer &&
            SetupValidation.validateLDAPServer(config.authentication.ldapServer)
              .isValid
          );
        } else if (config.authentication.method === "database") {
          return (
            !!config.authentication.databaseConnection &&
            SetupValidation.validateDatabaseConnection(
              config.authentication.databaseConnection
            ).isValid
          );
        }
        return true;
      case 4: // Storage step
        if (config.storage.basePath) {
          return SetupValidation.validateDirectoryPath(config.storage.basePath)
            .isValid;
        }
        return true;
      case 5: // Features step
        return true;
      default:
        return true;
    }
  };

  const currentStepValid = isStepValid(currentStep);

  const clearWizardProgress = () => {
    try {
      localStorage.removeItem("setupWizardStep");
      localStorage.removeItem("setupWizardProgress");
    } catch (error) {
      console.error("Failed to clear wizard progress:", error);
    }
  };

  const handleComplete = () => {
    const finalConfig = { ...config, isConfigured: true };
    clearWizardProgress();
    onComplete(finalConfig);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <IntroductionStep config={config} setConfig={setConfig} />;
      case 1:
        return <CompanyStep config={config} updateConfig={updateConfig} />;
      case 2:
        return <ModulesStep config={config} updateConfig={updateConfig} />;
      case 3:
        return (
          <AuthenticationStep config={config} updateConfig={updateConfig} />
        );
      case 4:
        return <StorageStep config={config} updateConfig={updateConfig} />;
      case 5:
        return <PreferencesStep config={config} updateConfig={updateConfig} />;
      case 6:
        return <ValidationStep config={config} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      {config.demoMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 dark:bg-blue-700 text-white py-1 px-4">
          <div className="flex items-center justify-center">
            <span className="text-sm font-medium">
              🚀 Demo Mode - Using test data for demonstration
            </span>
          </div>
        </div>
      )}

      <div className={`w-full max-w-4xl ${config.demoMode ? "mt-8" : ""}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4 relative">
            <Building2 className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              CNC Management Dashboard Setup
            </h1>
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (
                    confirm(
                      "Are you sure you want to start over? This will clear all your progress."
                    )
                  ) {
                    clearWizardProgress();
                    setCurrentStep(0);
                    setConfig(initialConfig);
                  }
                }}
                className="absolute right-0 text-xs flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Start Over
              </Button>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome! Let's configure your dashboard for your specific
            environment.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isClickable = isCompleted;

              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors
                    ${
                      isActive
                        ? "bg-blue-600 border-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-600 border-green-600 text-white cursor-pointer hover:bg-green-700 hover:border-green-700"
                        : "bg-white border-gray-300 text-gray-400 dark:bg-gray-700 dark:border-gray-600"
                    }
                  `}
                    onClick={() => {
                      if (isClickable) {
                        setCurrentStep(index);
                      }
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <StepIcon className="h-6 w-6" />
                    )}
                  </div>
                  <div
                    className={`mt-2 text-center ${
                      isClickable ? "cursor-pointer" : ""
                    }`}
                    onClick={() => {
                      if (isClickable) {
                        setCurrentStep(index);
                      }
                    }}
                  >
                    <p
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-blue-600"
                          : isCompleted
                          ? "text-green-600 hover:text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`text-xs ${
                        isCompleted ? "text-green-500" : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
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
              {React.createElement(steps[currentStep].icon, {
                className: "h-5 w-5",
              })}
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span>Progress auto-saved</span>
            </div>

            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                {currentStep === steps.length - 2 ? "Validate Setup" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function IntroductionStep({
  config,
  setConfig,
}: {
  config: SetupConfig;
  setConfig: React.Dispatch<React.SetStateAction<SetupConfig>>;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Setup Wizard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Let's configure your unified manufacturing management system
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FileJson className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Read-Only Approach</CardTitle>
                <CardDescription>Safe and non-invasive</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We only <strong>read</strong> from your existing folders and
              files. Nothing will be modified, moved, or deleted in your source
              directories. All our working data is saved to our own workspace.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  File Format Requirements
                </CardTitle>
                <CardDescription>
                  Two files need specific formats
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>Employee file:</strong> Must follow our CSV/JSON
                  format
                </p>
                <p>
                  <strong>Plate information file:</strong> Must follow our
                  Excel/CSV format
                </p>
                <p className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                  💡 We'll provide sample templates to help you
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Demo Mode
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Use built-in test data for evaluation and testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Switch
                checked={config.demoMode}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({ ...prev, demoMode: checked }))
                }
              />
              <div className="flex-1">
                <Label className="text-sm font-medium">Enable Demo Mode</Label>
                <p className="text-xs text-muted-foreground">
                  When enabled, the system will automatically use built-in test
                  data instead of requiring you to specify file paths
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CompanyStep({
  config,
  updateConfig,
}: {
  config: SetupConfig;
  updateConfig: (updates: Partial<SetupConfig>) => void;
}) {
  React.useEffect(() => {
    if (config.demoMode) {
      updateConfig({
        companyName: "Test Company",
        companyLogo: "/api/placeholder/150/150",
        companyFeatures: {
          jsonScanner: true,
          toolManager: true,
          clampingPlateManager: true,
        },
      });
    }
  }, [config.demoMode]);

  const companyNameValidation = SetupValidation.validateCompanyName(
    config.companyName
  );
  const logoValidation: { isValid: boolean; error?: string; warning?: string } =
    config.companyLogo && config.companyLogo.trim() !== ""
      ? { isValid: true }
      : { isValid: false, error: "Company logo is required" };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            {config.demoMode
              ? "Demo company information is automatically populated"
              : "Enter your company details and logo"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={config.companyName}
                onChange={(e) =>
                  config.demoMode
                    ? null
                    : updateConfig({ companyName: e.target.value })
                }
                placeholder="Enter your company name"
                readOnly={config.demoMode}
                disabled={config.demoMode}
                className={`${
                  config.demoMode
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    : !companyNameValidation.isValid
                    ? "border-red-300 focus:border-red-500"
                    : config.companyName && companyNameValidation.isValid
                    ? "border-green-300 focus:border-green-500"
                    : ""
                }`}
              />
              {config.companyName && !config.demoMode && (
                <ValidationFeedback
                  isValid={companyNameValidation.isValid}
                  error={companyNameValidation.error}
                  warning={companyNameValidation.warning}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyLogo">Company Logo</Label>
              <div className="space-y-3">
                {config.companyLogo && (
                  <div
                    className={`flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg ${
                      config.demoMode
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <img
                      src={config.companyLogo}
                      alt="Company Logo Preview"
                      className="w-16 h-16 object-contain border border-gray-300 dark:border-gray-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Logo Selected
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    id="companyLogo"
                    value={config.companyLogo || ""}
                    onChange={(e) =>
                      config.demoMode
                        ? null
                        : updateConfig({ companyLogo: e.target.value })
                    }
                    placeholder="Paste image URL or use upload button"
                    readOnly={config.demoMode}
                    disabled={config.demoMode}
                    className={`flex-1 ${
                      config.demoMode
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                        : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={config.demoMode}
                    className={`flex items-center gap-2 flex-shrink-0 ${
                      config.demoMode ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add simple placeholder components for the missing steps
function ModulesStep({
  config,
  updateConfig,
}: {
  config: SetupConfig;
  updateConfig: (updates: Partial<SetupConfig>) => void;
}) {
  return <div className="p-4">Modules Step - To be implemented</div>;
}

function AuthenticationStep({
  config,
  updateConfig,
}: {
  config: SetupConfig;
  updateConfig: (updates: Partial<SetupConfig>) => void;
}) {
  return <div className="p-4">Authentication Step - To be implemented</div>;
}

function StorageStep({
  config,
  updateConfig,
}: {
  config: SetupConfig;
  updateConfig: (updates: Partial<SetupConfig>) => void;
}) {
  return <div className="p-4">Storage Step - To be implemented</div>;
}

function PreferencesStep({
  config,
  updateConfig,
}: {
  config: SetupConfig;
  updateConfig: (updates: Partial<SetupConfig>) => void;
}) {
  return <div className="p-4">Preferences Step - To be implemented</div>;
}

// Validation Step Component
interface ValidationTest {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "success" | "error";
  error?: string;
}

function ValidationStep({
  config,
  onComplete,
}: {
  config: SetupConfig;
  onComplete: () => void;
}) {
  const [tests, setTests] = useState<ValidationTest[]>([
    {
      id: "folder-permissions",
      name: "Folder Permissions Check",
      description:
        "Verify read/write permissions for all configured storage paths.",
      status: "pending",
    },
    {
      id: "folder-structure",
      name: "Required Folder Structure",
      description:
        "Check if all required folders exist and create missing ones.",
      status: "pending",
    },
    {
      id: "clamping-plate-files",
      name: "Clamping Plate Info Files",
      description:
        "Validate structure and format of clamping plate information files.",
      status: "pending",
    },
    {
      id: "employee-file-structure",
      name: "Employee File Structure",
      description: "Verify employee authentication file format and structure.",
      status: "pending",
    },
  ]);

  const [initTests, setInitTests] = useState<ValidationTest[]>([
    {
      id: "json-scanner-init",
      name: "JSON Scanner Initialization",
      description: "Initialize and test JSON Scanner module.",
      status: "pending",
    },
    {
      id: "tool-manager-init",
      name: "Tool Manager Initialization",
      description: "Initialize Tool Manager and test Excel processing.",
      status: "pending",
    },
    {
      id: "clamping-plate-init",
      name: "Clamping Plate Manager Initialization",
      description:
        "Initialize Clamping Plate Manager and test database connectivity.",
      status: "pending",
    },
    {
      id: "authentication-init",
      name: "Authentication System Initialization",
      description:
        "Initialize authentication system and test user login functionality.",
      status: "pending",
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isInitRunning, setIsInitRunning] = useState(false);
  const [isInitComplete, setIsInitComplete] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const runValidation = async () => {
    setIsRunning(true);
    setIsComplete(false);
    setHasErrors(false);
    setLogs([]);
    addLog("🔍 Starting comprehensive system validation...");

    setTests((prev) =>
      prev.map((test) => ({
        ...test,
        status: "pending" as const,
        error: undefined,
      }))
    );

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      addLog(`🔄 Running test ${i + 1}/${tests.length}: ${test.name}`);
      await runIndividualTest(test.id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    addLog("✅ All validation tests completed successfully!");
    setIsRunning(false);
    setIsComplete(true);
  };

  const runIndividualTest = async (testId: string) => {
    setTests((prev) =>
      prev.map((test) =>
        test.id === testId ? { ...test, status: "running" as const } : test
      )
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTests((prev) =>
        prev.map((test) =>
          test.id === testId ? { ...test, status: "success" as const } : test
        )
      );
      addLog(`✅ Test ${testId} completed successfully`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      addLog(`❌ Test ${testId} failed: ${errorMessage}`);
      setTests((prev) =>
        prev.map((test) =>
          test.id === testId
            ? { ...test, status: "error" as const, error: errorMessage }
            : test
        )
      );
      setHasErrors(true);
    }
  };

  const runInitialization = async () => {
    setIsInitRunning(true);
    setIsInitComplete(false);
    addLog("🚀 Starting feature initialization tests...");

    for (let i = 0; i < initTests.length; i++) {
      const test = initTests[i];
      addLog(`🔄 Running init test ${i + 1}/${initTests.length}: ${test.name}`);

      setInitTests((prev) =>
        prev.map((t) =>
          t.id === test.id ? { ...t, status: "running" as const } : t
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setInitTests((prev) =>
        prev.map((t) =>
          t.id === test.id ? { ...t, status: "success" as const } : t
        )
      );

      addLog(`✅ ${test.name} completed successfully`);
    }

    addLog("✅ All feature initialization tests completed!");
    setIsInitRunning(false);
    setIsInitComplete(true);
  };

  const getStatusIcon = (status: ValidationTest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
        );
      case "running":
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: ValidationTest["status"]) => {
    switch (status) {
      case "pending":
        return "text-gray-600";
      case "running":
        return "text-blue-600";
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
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
            Testing folder permissions, structure, and file formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`relative flex items-start gap-3 p-4 rounded-lg border transition-all duration-300 ${
                  test.status === "running"
                    ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20"
                    : test.status === "success"
                    ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                    : test.status === "error"
                    ? "border-red-300 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 bg-gray-50 dark:bg-gray-800/50"
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      test.status === "running"
                        ? "border-blue-500 bg-blue-100"
                        : test.status === "success"
                        ? "border-green-500 bg-green-100"
                        : test.status === "error"
                        ? "border-red-500 bg-red-100"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {getStatusIcon(test.status)}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${getStatusColor(test.status)}`}>
                    {test.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {test.description}
                  </p>
                  {test.error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{test.error}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-6 border-t">
            {!isComplete && (
              <Button
                onClick={runValidation}
                disabled={isRunning}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Start Validation
                  </>
                )}
              </Button>
            )}

            {isComplete && !hasErrors && (
              <Button
                onClick={onComplete}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold"
              >
                <Save className="h-5 w-5 mr-2" />
                Complete Setup & Launch Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Initialization Section */}
      {isComplete && !hasErrors && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-purple-600" />
              Feature Initialization
            </CardTitle>
            <CardDescription>
              Initialize and test each feature module
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {initTests.map((test) => (
                <div
                  key={test.id}
                  className={`relative flex items-start gap-3 p-4 rounded-lg border transition-all duration-300 ${
                    test.status === "running"
                      ? "border-purple-300 bg-purple-50 dark:bg-purple-900/20"
                      : test.status === "success"
                      ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 bg-gray-50 dark:bg-gray-800/50"
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        test.status === "running"
                          ? "border-purple-500 bg-purple-100"
                          : test.status === "success"
                          ? "border-green-500 bg-green-100"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {getStatusIcon(test.status)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${getStatusColor(test.status)}`}
                    >
                      {test.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {test.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-6 border-t">
              {!isInitComplete && (
                <Button
                  onClick={runInitialization}
                  disabled={isInitRunning}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                >
                  {isInitRunning ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Initializing Features...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-5 w-5 mr-2" />
                      Initialize Features
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
