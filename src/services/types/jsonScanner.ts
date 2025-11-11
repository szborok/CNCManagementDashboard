// src/services/types/jsonScanner.ts
/**
 * TypeScript interfaces for JSONScanner API
 */

export interface Project {
  id: string;
  name: string;
  status: "passed" | "failed" | "warning" | "unknown";
  operationCount: number;
  ncFileCount: number;
  timestamp: string;
  violations: Violation[];
  session?: string;
}

export interface Violation {
  type: string;
  severity: "error" | "warning" | "info";
  message: string;
  context?: any;
}

export interface ProjectDetails extends Project {
  fullAnalysis?: AnalysisResult;
}

export interface AnalysisResult {
  summary: {
    totalOperations: number;
    totalNCFiles: number;
  };
  violations: Violation[];
  timestamp: string;
  rules?: RuleResult[];
}

export interface RuleResult {
  name: string;
  passed: boolean;
  violations: Violation[];
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface StatusResponse {
  status: "running" | "idle" | "error";
  mode: "auto" | "manual";
  testMode: boolean;
  version: string;
  timestamp: string;
  dataManager: string;
}

export interface ScanTriggerResponse {
  success: boolean;
  message: string;
  projectPath: string;
  timestamp: string;
}
