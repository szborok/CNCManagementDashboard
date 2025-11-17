import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('ToolManagerAPI', () => {
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

  describe('getTools', () => {
    it('should fetch all tools without filters', async () => {
      const mockResponse = {
        tools: [],
        total: 0,
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const { default: toolManagerAPI } = await import('../toolManager');
      const result = await toolManagerAPI.getTools();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tools', { params: {} });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch tools with category filter', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: { tools: [], total: 0 } });

      const { default: toolManagerAPI } = await import('../toolManager');
      await toolManagerAPI.getTools('DRILL');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tools', { params: { category: 'DRILL' } });
    });

    it('should fetch only available tools', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: { tools: [], total: 0 } });

      const { default: toolManagerAPI } = await import('../toolManager');
      await toolManagerAPI.getTools(undefined, true);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tools', { params: { available: 'true' } });
    });
  });

  describe('getToolDetails', () => {
    it('should fetch specific tool details', async () => {
      const mockTool = {
        id: 'tool-123',
        code: 'D10',
        category: 'DRILL',
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockTool });

      const { default: toolManagerAPI } = await import('../toolManager');
      const result = await toolManagerAPI.getToolDetails('tool-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tools/tool-123', { params: undefined });
      expect(result).toEqual(mockTool);
    });
  });

  describe('getProjects', () => {
    it('should fetch all projects', async () => {
      const mockResponse = {
        projects: [],
        total: 0,
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const { default: toolManagerAPI } = await import('../toolManager');
      const result = await toolManagerAPI.getProjects();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects', { params: undefined });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUpcomingRequirements', () => {
    it('should fetch upcoming tool requirements', async () => {
      const mockRequirements = {
        upcoming: [],
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockRequirements });

      const { default: toolManagerAPI } = await import('../toolManager');
      const result = await toolManagerAPI.getUpcomingRequirements();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/analysis/upcoming', { params: undefined });
      expect(result).toEqual(mockRequirements);
    });
  });

  describe('getStatus', () => {
    it('should fetch service status', async () => {
      const mockStatus = {
        status: 'healthy',
        version: '1.0.0',
      };
      mockAxiosInstance.get.mockResolvedValue({ data: mockStatus });

      const { default: toolManagerAPI } = await import('../toolManager');
      const result = await toolManagerAPI.getStatus();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/status', { params: undefined });
      expect(result).toEqual(mockStatus);
    });
  });
});
