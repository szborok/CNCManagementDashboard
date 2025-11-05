import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, FileJson } from "lucide-react";

interface ScanResult {
  id: string;
  filename: string;
  processedAt: string;
  results: {
    rulesApplied: string[];
    violations: Array<{
      rule: string;
      severity: string;
      message: string;
      location: string;
      suggestion: string;
    }>;
    optimizations: Array<{
      type: string;
      originalValue: number;
      suggestedValue: number;
      improvement: string;
    }>;
    machiningTime: string;
    estimatedCost: number;
  };
  status: string;
}

interface ScannerResultsProps {
  currentUser: any;
}

const ScannerResults: React.FC<ScannerResultsProps> = ({ currentUser: _currentUser }) => {
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = () => {
    try {
      const resultsData = localStorage.getItem('demoProcessingResults');
      if (resultsData) {
        const parsed = JSON.parse(resultsData);
        setScanResults(parsed.jsonAnalysis || []);
      }
    } catch (error) {
      console.error('Failed to load demo data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (violations: any[]) => {
    if (violations.length === 0) return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
    const hasErrors = violations.some(v => v.severity === 'ERROR');
    if (hasErrors) return <Badge variant="destructive">Failed</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">JSON Scanner Results</h1>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">JSON Scanner Results</h1>
          <p className="text-muted-foreground">Analysis results from CNC program scanning</p>
        </div>
        <Button onClick={loadDemoData} variant="outline">
          <FileJson className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scanResults.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scanResults.length > 0 
                ? Math.round((scanResults.filter(r => r.results.violations.length === 0).length / scanResults.length) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Rules Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scanResults.reduce((total, result) => total + result.results.rulesApplied.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Analysis Results</h2>
        {scanResults.length > 0 ? (
          scanResults.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileJson className="h-5 w-5" />
                    <CardTitle>{result.filename}</CardTitle>
                    {getStatusBadge(result.results.violations)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatTimestamp(result.processedAt)}
                  </div>
                </div>
                <CardDescription>
                  Time: {result.results.machiningTime} | Cost: \
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Rules Applied ({result.results.rulesApplied.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.results.rulesApplied.map((rule, index) => (
                      <Badge key={index} variant="outline">{rule}</Badge>
                    ))}
                  </div>
                </div>

                {result.results.violations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Violations</h4>
                    {result.results.violations.map((violation, index) => (
                      <div key={index} className="p-3 bg-red-50 rounded border-red-200 border">
                        <div className="flex items-center gap-2 mb-1">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="font-medium">{violation.rule}</span>
                          <Badge variant="destructive">{violation.severity}</Badge>
                        </div>
                        <p className="text-sm mb-1">{violation.message}</p>
                        <p className="text-xs text-red-600">Location: {violation.location}</p>
                        <p className="text-xs text-red-600 mt-1">💡 {violation.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {result.results.optimizations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-blue-600">Optimizations</h4>
                    {result.results.optimizations.map((opt, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded border-blue-200 border">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{opt.type}</span>
                        </div>
                        <p className="text-sm">{opt.originalValue} → {opt.suggestedValue} ({opt.improvement})</p>
                      </div>
                    ))}
                  </div>
                )}

                {result.results.violations.length === 0 && (
                  <div className="p-3 bg-green-50 rounded border-green-200 border">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">All checks passed!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileJson className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Analysis Results</h3>
              <p className="text-muted-foreground mb-4">
                Complete setup wizard to generate demo data.
              </p>
              <Button onClick={loadDemoData}>Load Demo Data</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScannerResults;
