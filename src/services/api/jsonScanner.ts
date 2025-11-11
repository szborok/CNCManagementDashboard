// src/services/api/jsonScanner.ts
/**
 * JSONScanner API Service
 * Handles all communication with the JSONScanner backend
 */

import APIClient from "./client";
import type {
  ProjectDetails,
  ProjectListResponse,
  AnalysisResult,
  StatusResponse,
  ScanTriggerResponse,
} from "../types/jsonScanner";

const API_BASE = "http://localhost:3001/api";

class JSONScannerAPI {
  private client: APIClient;

  constructor() {
    this.client = new APIClient(API_BASE);
  }

  /**
   * Get all projects with pagination
   */
  async getProjects(
    page = 1,
    pageSize = 20,
    status?: "passed" | "failed" | "warning"
  ): Promise<ProjectListResponse> {
    const params: any = { page, pageSize };
    if (status) {
      params.status = status;
    }
    return this.client.get<ProjectListResponse>("/projects", params);
  }

  /**
   * Get specific project details
   */
  async getProjectDetails(id: string): Promise<ProjectDetails> {
    return this.client.get<ProjectDetails>(`/projects/${id}`);
  }

  /**
   * Get full analysis for a project
   */
  async getAnalysis(projectId: string): Promise<AnalysisResult> {
    return this.client.get<AnalysisResult>(`/analysis/${projectId}`);
  }

  /**
   * Get only violations for a project
   */
  async getViolations(
    projectId: string
  ): Promise<{ projectId: string; violations: any[]; violationCount: number }> {
    return this.client.get(`/analysis/${projectId}/violations`);
  }

  /**
   * Trigger manual scan
   */
  async triggerScan(projectPath: string): Promise<ScanTriggerResponse> {
    return this.client.post<ScanTriggerResponse>("/projects/scan", {
      projectPath,
    });
  }

  /**
   * Get service status
   */
  async getStatus(): Promise<StatusResponse> {
    return this.client.get<StatusResponse>("/status");
  }
}

export default new JSONScannerAPI();
