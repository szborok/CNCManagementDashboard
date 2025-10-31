import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ScanResult {
  id: string;
  projectName: string;
  scanDate: Date;
  status: "passed" | "failed" | "warning";
  rulesExecuted: number;
  rulesPassed: number;
  rulesFailed: number;
  details: any;
}

interface ScannerResultsProps {
  currentUser: any;
}

const ScannerResults: React.FC<ScannerResultsProps> = ({ currentUser }) => {
  // Mock data - this will be replaced with API calls
  const mockResults: ScanResult[] = [
    {
      id: "1",
      projectName: "W5270NS01060A",
      scanDate: new Date("2024-10-29T10:30:00"),
      status: "passed",
      rulesExecuted: 7,
      rulesPassed: 7,
      rulesFailed: 0,
      details: {},
    },
    {
      id: "2",
      projectName: "BRK_Test_001",
      scanDate: new Date("2024-10-29T09:15:00"),
      status: "warning",
      rulesExecuted: 6,
      rulesPassed: 5,
      rulesFailed: 1,
      details: {},
    },
    {
      id: "3",
      projectName: "Matrix_Analysis_002",
      scanDate: new Date("2024-10-29T08:45:00"),
      status: "failed",
      rulesExecuted: 5,
      rulesPassed: 2,
      rulesFailed: 3,
      details: {},
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: "default",
      warning: "secondary",
      failed: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            JSON Scanner Results
          </h1>
          <p className="text-muted-foreground">
            Analysis results from CNC program scanning and rule validation
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockResults.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (mockResults.filter((r) => r.status === "passed").length /
                  mockResults.length) *
                  100
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Based on recent scans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Validation rules active
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scan Results</CardTitle>
          <CardDescription>
            Latest JSON file analyses and rule validations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(result.status)}
                  <div>
                    <h3 className="font-medium">{result.projectName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {result.scanDate.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm">
                    <div>
                      {result.rulesPassed}/{result.rulesExecuted} rules passed
                    </div>
                    {result.rulesFailed > 0 && (
                      <div className="text-red-500">
                        {result.rulesFailed} failed
                      </div>
                    )}
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScannerResults;
