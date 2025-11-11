// src/services/types/platesManager.ts
/**
 * TypeScript interfaces for ClampingPlateManager API
 */

export interface Plate {
  id: string;
  shelf: string;
  health: "new" | "used" | "locked";
  occupancy: "free" | "in-use";
  lastWorkName?: string;
  lastModifiedBy?: string;
  lastModifiedDate: string;
  modelPath?: string;
  historyCount: number;
  history?: PlateHistoryEntry[];
}

export interface PlateHistoryEntry {
  timestamp: string;
  action: string;
  user: string;
  workOrder?: string;
  notes?: string;
}

export interface PlateListResponse {
  plates: Plate[];
  total: number;
  summary: {
    new: number;
    inUse: number;
    locked: number;
  };
}

export interface WorkOrder {
  id: string;
  plateId: string;
  workName: string;
  operator: string;
  startTime: string;
  endTime?: string;
  status: "active" | "completed" | "paused";
}

export interface WorkOrderListResponse {
  workOrders: WorkOrder[];
  total: number;
}

export interface StatusResponse {
  status: "running";
  platesTotal: number;
  platesInUse: number;
  activeWorkOrders: number;
  lastUpdate: string;
}
