// src/services/types/toolManager.ts
/**
 * TypeScript interfaces for ToolManager API
 */

export interface Tool {
  id: string;
  category: "ECUT" | "MFC" | "XF" | "XFEED";
  name: string;
  description: string;
  quantity: number;
  available: number;
  inUse: number;
  location: string;
  history?: ToolHistory[];
}

export interface ToolHistory {
  timestamp: string;
  action: string;
  project?: string;
  operator?: string;
}

export interface ToolListResponse {
  tools: Tool[];
  total: number;
  categories: string[];
}

export interface Project {
  id: string;
  name: string;
  toolsRequired: string[];
  timestamp: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
}

export interface UpcomingRequirement {
  toolId: string;
  toolName: string;
  quantityNeeded: number;
  projectName: string;
  estimatedDate: string;
}

export interface StatusResponse {
  status: "running" | "idle" | "error";
  mode: "auto" | "manual";
  testMode: boolean;
  version: string;
  timestamp: string;
  dataManager: string;
}
