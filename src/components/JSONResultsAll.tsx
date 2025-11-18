import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  FileJson,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  RefreshCw,
  Eye,
  Calendar,
} from "lucide-react";

interface JSONScanResult {
  id: string;
  filename: string;
  processedAt: string;
  results: {
    rulesApplied: string[];
    violations: Array<{
      rule: string;
      message: string;
      location: string;
    }>;
  };
  status: "passed" | "failed" | "warning";
}

export default function JSONResultsAll() {
  const [results, setResults] = useState<JSONScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] = useState<JSONScanResult | null>(
    null
  );

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      // Fetch from JSONScanner backend
      const response = await fetch("http://localhost:3001/api/projects");
      if (response.ok) {
        const data = await response.json();
        // Transform backend format to UI format
        const transformedResults = data.projects.map((project: any) => ({
          id: project.id,
          filename: project.name,
          processedAt: project.timestamp,
          results: {
            rulesApplied: project.rulesApplied || [],
            violations: project.violations || [],
          },
          status: project.status || "unknown",
        }));
        setResults(transformedResults);
        console.log(
          `✅ Loaded ${transformedResults.length} JSON analysis results from JSONScanner backend`
        );
      } else {
        console.error("Failed to fetch from backend:", response.statusText);
        setResults([]);
      }
    } catch (error) {
      console.error("Failed to load JSON results from backend:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadResults();
  };

  const filteredResults = results.filter(
    (result) =>
      result.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <Badge className="bg-green-100 text-green-800 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Passed
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Warning
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All JSON Analysis Results</h1>
          <p className="text-gray-600 mt-1">
            View all processed CNC program files and their analysis results
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Passed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {results.filter((r) => r.status === "passed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {results.filter((r) => r.status === "warning").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {results.filter((r) => r.status === "failed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by filename or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            {filteredResults.length} result
            {filteredResults.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <FileJson className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {results.length === 0
                  ? "No JSON analysis results found. Run the JSONScanner backend to generate results."
                  : "No results match your search."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rules Applied</TableHead>
                  <TableHead>Violations</TableHead>
                  <TableHead>Processed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileJson className="h-4 w-4 text-blue-600" />
                        {result.filename}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(result.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {result.results.rulesApplied.length} rules
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {result.results.violations.length > 0 ? (
                        <Badge variant="destructive">
                          {result.results.violations.length} violation
                          {result.results.violations.length !== 1 ? "s" : ""}
                        </Badge>
                      ) : (
                        <span className="text-gray-500 text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {formatDate(result.processedAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedResult(result)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[85vh] flex flex-col bg-white shadow-xl">
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl">{selectedResult.filename}</CardTitle>
                    {getStatusBadge(selectedResult.status)}
                  </div>
                  <CardDescription className="mt-2 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(selectedResult.processedAt)}
                    </span>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedResult(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-auto flex-1 p-6 space-y-6">
              {/* Rules Applied */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Quality Rules Applied ({selectedResult.results.rulesApplied.length})
                </h3>
                {selectedResult.results.rulesApplied.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedResult.results.rulesApplied.map((rule, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        ✓ {rule}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No rules applied</p>
                )}
              </div>

              {/* Violations */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Violations ({selectedResult.results.violations.length})
                </h3>
                {selectedResult.results.violations.length > 0 ? (
                  <div className="space-y-3">
                    {selectedResult.results.violations.map((violation, idx) => (
                      <div
                        key={idx}
                        className="border border-red-200 bg-red-50 rounded-md p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-red-900 text-sm">
                            {violation.rule}
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            {violation.severity || "error"}
                          </Badge>
                        </div>
                        <div className="text-sm text-red-700 mb-2">
                          {violation.message}
                        </div>
                        {violation.location && (
                          <div className="text-xs text-red-600 font-mono">
                            📍 {violation.location}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-md">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">No violations found - all checks passed</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
