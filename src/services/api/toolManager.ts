// src/services/api/toolManager.ts
/**
 * ToolManager API Service
 */

import APIClient from "./client";
import type {
  Tool,
  ToolListResponse,
  ProjectListResponse,
  StatusResponse,
} from "../types/toolManager";

const API_BASE = "http://localhost:3002/api";

class ToolManagerAPI {
  private client: APIClient;

  constructor() {
    this.client = new APIClient(API_BASE);
  }

  /**
   * Get all tools
   */
  async getTools(
    category?: string,
    availableOnly?: boolean
  ): Promise<ToolListResponse> {
    const params: any = {};
    if (category) params.category = category;
    if (availableOnly) params.available = "true";
    return this.client.get<ToolListResponse>("/tools", params);
  }

  /**
   * Get specific tool details
   */
  async getToolDetails(id: string): Promise<Tool> {
    return this.client.get<Tool>(`/tools/${id}`);
  }

  /**
   * Get all projects
   */
  async getProjects(): Promise<ProjectListResponse> {
    return this.client.get<ProjectListResponse>("/projects");
  }

  /**
   * Get upcoming tool requirements
   */
  async getUpcomingRequirements(): Promise<any> {
    return this.client.get("/analysis/upcoming");
  }

  /**
   * Get service status
   */
  async getStatus(): Promise<StatusResponse> {
    return this.client.get<StatusResponse>("/status");
  }
}

export default new ToolManagerAPI();
