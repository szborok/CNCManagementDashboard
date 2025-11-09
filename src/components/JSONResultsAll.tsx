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
      const storedData = localStorage.getItem("jsonScannerResults");
      if (storedData) {
        const data = JSON.parse(storedData);
        setResults(Array.isArray(data) ? data : []);
        console.log(
          `✅ Loaded ${data.length} JSON analysis results from localStorage`
        );
      } else {
        console.log("ℹ️ No JSON Scanner results found");
        setResults([]);
      }
    } catch (error) {
      console.error("Failed to load JSON results:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Fetch fresh data from demo-data file
      const response = await fetch("/demo-data/jsonscanner-results.json");
      if (response.ok) {
        const freshData = await response.json();
        // Update localStorage with fresh data
        localStorage.setItem("jsonScannerResults", JSON.stringify(freshData));
        setResults(Array.isArray(freshData) ? freshData : []);
        console.log(
          `✅ Refreshed ${freshData.length} JSON analysis results from demo-data`
        );
      } else {
        console.error("Failed to fetch fresh data");
        loadResults(); // Fallback to localStorage
      }
    } catch (error) {
      console.error("Failed to refresh data:", error);
      loadResults(); // Fallback to localStorage
    } finally {
      setIsLoading(false);
    }
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
          <Card className="max-w-3xl w-full max-h-[80vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedResult.filename}</CardTitle>
                  <CardDescription className="mt-2">
                    Processed: {formatDate(selectedResult.processedAt)}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedResult(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <div>
                <h3 className="font-semibold mb-2">Status</h3>
                {getStatusBadge(selectedResult.status)}
              </div>

              {/* Rules Applied */}
              <div>
                <h3 className="font-semibold mb-2">
                  Rules Applied ({selectedResult.results.rulesApplied.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedResult.results.rulesApplied.map((rule, idx) => (
                    <Badge key={idx} variant="secondary">
                      {rule}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Violations */}
              {selectedResult.results.violations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">
                    Violations ({selectedResult.results.violations.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedResult.results.violations.map((violation, idx) => (
                      <div
                        key={idx}
                        className="border border-red-200 bg-red-50 rounded-lg p-4"
                      >
                        <div className="font-medium text-red-900 mb-1">
                          {violation.rule}
                        </div>
                        <div className="text-sm text-red-700 mb-2">
                          {violation.message}
                        </div>
                        <div className="text-xs text-red-600">
                          📍 {violation.location}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Data */}
              <div>
                <h3 className="font-semibold mb-2">Raw Data</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(selectedResult, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
