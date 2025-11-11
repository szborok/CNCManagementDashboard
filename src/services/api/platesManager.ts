// src/services/api/platesManager.ts
/**
 * ClampingPlateManager API Service
 */

import APIClient from "./client";
import type {
  Plate,
  PlateListResponse,
  WorkOrder,
  WorkOrderListResponse,
  StatusResponse,
} from "../types/platesManager";

const API_BASE = "http://localhost:3003/api";

class PlatesManagerAPI {
  private client: APIClient;

  constructor() {
    this.client = new APIClient(API_BASE);
  }

  /**
   * Get all plates
   */
  async getPlates(): Promise<PlateListResponse> {
    return this.client.get<PlateListResponse>("/plates");
  }

  /**
   * Get specific plate details
   */
  async getPlateDetails(id: string): Promise<Plate> {
    return this.client.get<Plate>(`/plates/${id}`);
  }

  /**
   * Update plate status
   */
  async updatePlate(id: string, data: Partial<Plate>): Promise<Plate> {
    return this.client.put<Plate>(`/plates/${id}`, data);
  }

  /**
   * Start work order on a plate
   */
  async startWork(
    plateId: string,
    workData: { workName: string; operator: string }
  ): Promise<WorkOrder> {
    return this.client.post<WorkOrder>(
      `/plates/${plateId}/work/start`,
      workData
    );
  }

  /**
   * Finish work order
   */
  async finishWork(plateId: string): Promise<WorkOrder> {
    return this.client.post<WorkOrder>(`/plates/${plateId}/work/finish`);
  }

  /**
   * Stop/pause work order
   */
  async stopWork(plateId: string, reason: string): Promise<WorkOrder> {
    return this.client.post<WorkOrder>(`/plates/${plateId}/work/stop`, {
      reason,
    });
  }

  /**
   * Get all work orders
   */
  async getWorkOrders(): Promise<WorkOrderListResponse> {
    return this.client.get<WorkOrderListResponse>("/work-orders");
  }

  /**
   * Get user's active work
   */
  async getUserWork(userId: string): Promise<WorkOrderListResponse> {
    return this.client.get<WorkOrderListResponse>(
      `/work-orders/user/${userId}`
    );
  }

  /**
   * Get service status
   */
  async getStatus(): Promise<StatusResponse> {
    return this.client.get<StatusResponse>("/status");
  }
}

export default new PlatesManagerAPI();
