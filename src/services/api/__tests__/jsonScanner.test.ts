import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('JSONScannerAPI', () => {
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

  describe('getProjects', () => {
    it('should fetch projects with default pagination', async () => {
      const mockResponse = {
        data: {
          projects: [],
          total: 0,
          page: 1,
          pageSize: 20,
        },
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      // Re-import to get fresh instance with our mock
      const { default: jsonScannerAPI } = await import('../jsonScanner');
      const result = await jsonScannerAPI.getProjects();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects', {
        params: { page: 1, pageSize: 20 },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch projects with custom pagination and status', async () => {
      const mockResponse = {
        data: {
          projects: [],
          total: 0,
          page: 2,
          pageSize: 50,
        },
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const { default: jsonScannerAPI } = await import('../jsonScanner');
      await jsonScannerAPI.getProjects(2, 50, 'failed');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects', {
        params: {
          page: 2,
          pageSize: 50,
          status: 'failed',
        },
      });
    });
  });

  describe('getProjectDetails', () => {
    it('should fetch specific project details', async () => {
      const mockProject = {
        id: 'proj-123',
        name: 'Test Project',
        status: 'passed',
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockProject });

      const { default: jsonScannerAPI } = await import('../jsonScanner');
      const result = await jsonScannerAPI.getProjectDetails('proj-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects/proj-123', {
        params: undefined,
      });
      expect(result).toEqual(mockProject);
    });
  });

  describe('getAnalysis', () => {
    it('should fetch project analysis', async () => {
      const mockAnalysis = {
        projectId: 'proj-123',
        violations: [],
        summary: { total: 0 },
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockAnalysis });

      const { default: jsonScannerAPI } = await import('../jsonScanner');
      const result = await jsonScannerAPI.getAnalysis('proj-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analysis/proj-123', {
        params: undefined,
      });
      expect(result).toEqual(mockAnalysis);
    });
  });

  describe('triggerScan', () => {
    it('should trigger manual scan', async () => {
      const mockResponse = {
        success: true,
        message: 'Scan started',
      };
      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const { default: jsonScannerAPI } = await import('../jsonScanner');
      const result = await jsonScannerAPI.triggerScan('/path/to/project');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/projects/scan', {
        projectPath: '/path/to/project',
      });
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

      const { default: jsonScannerAPI } = await import('../jsonScanner');
      const result = await jsonScannerAPI.getStatus();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/status', {
        params: undefined,
      });
      expect(result).toEqual(mockStatus);
    });
  });
});
