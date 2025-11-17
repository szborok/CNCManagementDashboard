import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('PlatesManagerAPI', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    };
    
    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance);
  });

  describe('getPlates', () => {
    it('should fetch all plates', async () => {
      const mockResponse = {
        plates: [],
        total: 0,
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const { default: platesManagerAPI } = await import('../platesManager');
      const result = await platesManagerAPI.getPlates();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/plates', { params: undefined });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPlateDetails', () => {
    it('should fetch specific plate details', async () => {
      const mockPlate = {
        id: 'plate-123',
        plateNumber: 'P001',
        status: 'available',
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockPlate });

      const { default: platesManagerAPI } = await import('../platesManager');
      const result = await platesManagerAPI.getPlateDetails('plate-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/plates/plate-123', { params: undefined });
      expect(result).toEqual(mockPlate);
    });
  });

  describe('updatePlate', () => {
    it('should update plate data', async () => {
      const updateData = { occupancy: 'in-use' as const };
      const mockUpdated = {
        id: 'plate-123',
        shelf: 'A1',
        health: 'used' as const,
        occupancy: 'in-use' as const,
        lastModifiedDate: '2025-11-17',
        historyCount: 5,
      };
      mockAxiosInstance.put.mockResolvedValue({ data: mockUpdated });

      const { default: platesManagerAPI } = await import('../platesManager');
      const result = await platesManagerAPI.updatePlate('plate-123', updateData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/plates/plate-123', updateData);
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('Work Order Operations', () => {
    it('should start work order', async () => {
      const workData = {
        workName: 'Job 123',
        operator: 'John Doe',
      };
      const mockWorkOrder = {
        id: 'wo-123',
        plateId: 'plate-123',
        status: 'in-progress',
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockWorkOrder });

      const { default: platesManagerAPI } = await import('../platesManager');
      const result = await platesManagerAPI.startWork('plate-123', workData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/plates/plate-123/work/start', workData);
      expect(result).toEqual(mockWorkOrder);
    });

    it('should finish work order', async () => {
      const mockWorkOrder = {
        id: 'wo-123',
        status: 'completed',
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockWorkOrder });

      const { default: platesManagerAPI } = await import('../platesManager');
      const result = await platesManagerAPI.finishWork('plate-123');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/plates/plate-123/work/finish', undefined);
      expect(result).toEqual(mockWorkOrder);
    });

    it('should stop work order', async () => {
      const mockWorkOrder = {
        id: 'wo-123',
        status: 'stopped',
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockWorkOrder });

      const { default: platesManagerAPI } = await import('../platesManager');
      const result = await platesManagerAPI.stopWork('plate-123', 'Break time');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/plates/plate-123/work/stop', {
        reason: 'Break time',
      });
      expect(result).toEqual(mockWorkOrder);
    });
  });

  describe('getWorkOrders', () => {
    it('should fetch all work orders', async () => {
      const mockResponse = {
        workOrders: [],
        total: 0,
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const { default: platesManagerAPI } = await import('../platesManager');
      const result = await platesManagerAPI.getWorkOrders();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/work-orders', { params: undefined });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUserWork', () => {
    it('should fetch user active work', async () => {
      const mockResponse = {
        workOrders: [],
        total: 0,
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const { default: platesManagerAPI } = await import('../platesManager');
      const result = await platesManagerAPI.getUserWork('user-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/work-orders/user/user-123', { params: undefined });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getStatus', () => {
    it('should fetch service status', async () => {
      const mockStatus = {
        status: 'healthy',
        version: '1.0.0',
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockStatus });

      const { default: platesManagerAPI } = await import('../platesManager');
      const result = await platesManagerAPI.getStatus();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/status', { params: undefined });
      expect(result).toEqual(mockStatus);
    });
  });
});
