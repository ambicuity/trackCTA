const axios = require('axios');

// Mock dependencies first
jest.mock('axios');
jest.mock('../src/utils/cache', () => ({
  cache: {
    get: jest.fn(),
    set: jest.fn(),
    log_hit: jest.fn(),
    log_miss: jest.fn()
  },
  cacheKeys: {
    routes: 'routes-cache',
    pattern: (route) => `pattern-${route}-cache`,
    direction: (route) => `dir-${route}-cache`,
    stops: (route, direction) => `stops-${route}-${direction}-cache`
  }
}));

jest.mock('../src/utils/http', () => ({
  BusHttp: {
    get: jest.fn()
  }
}));

// Set environment variables before requiring the module
process.env.GITHUB_TOKEN = 'test-token';
process.env.GITHUB_WORKFLOW_WEB_URL = 'https://api.github.com/web';
process.env.GITHUB_WORKFLOW_SERVER_URL = 'https://api.github.com/server';
process.env.GITHUB_VERSION_URL = 'https://api.github.com/version';

const busService = require('../src/tc-app/bus/bus-service');
const { cache } = require('../src/utils/cache');
const { BusHttp } = require('../src/utils/http');

describe('Bus Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRoutes', () => {
    test('should return cached routes when available', async () => {
      const mockRoutes = [{ rt: '1', rtnm: 'Route 1' }];
      cache.get.mockReturnValue(mockRoutes);

      const result = await busService.getRoutes();

      expect(cache.get).toHaveBeenCalledWith('routes-cache');
      expect(cache.log_hit).toHaveBeenCalledWith('routes-cache');
      expect(result).toEqual(mockRoutes);
    });

    test('should fetch routes from API when not cached', async () => {
      const mockRoutes = [{ rt: '1', rtnm: 'Route 1' }];
      cache.get.mockReturnValue(null);
      BusHttp.get.mockResolvedValue({
        data: { routes: mockRoutes },
        error: null
      });

      const result = await busService.getRoutes();

      expect(BusHttp.get).toHaveBeenCalledWith('/getroutes');
      expect(cache.log_miss).toHaveBeenCalledWith('routes-cache');
      expect(cache.set).toHaveBeenCalledWith('routes-cache', mockRoutes);
      expect(result).toEqual(mockRoutes);
    });

    test('should throw error when API call fails', async () => {
      cache.get.mockReturnValue(null);
      const error = new Error('API Error');
      BusHttp.get.mockResolvedValue({
        data: null,
        error: error
      });

      await expect(busService.getRoutes()).rejects.toThrow('API Error');
    });
  });

  describe('getVehicles', () => {
    test('should fetch vehicles for given routes', async () => {
      const mockVehicles = [{ vid: '123', rt: '1' }];
      BusHttp.get.mockResolvedValue({
        data: { vehicle: mockVehicles },
        error: null
      });

      const result = await busService.getVehicles('1,2');

      expect(BusHttp.get).toHaveBeenCalledWith('/getvehicles', {
        params: { rt: '1,2' }
      });
      expect(result).toEqual(mockVehicles);
    });

    test('should throw error when vehicles API fails', async () => {
      const error = new Error('Vehicles API Error');
      BusHttp.get.mockResolvedValue({
        data: null,
        error: error
      });

      await expect(busService.getVehicles('1')).rejects.toThrow('Vehicles API Error');
    });
  });

  describe('getPatterns', () => {
    test('should return cached patterns when available', async () => {
      const mockPatterns = [{ pid: '123', dir: 'North' }];
      cache.get.mockReturnValue(mockPatterns);

      const result = await busService.getPatterns('1');

      expect(cache.get).toHaveBeenCalledWith('pattern-1-cache');
      expect(cache.log_hit).toHaveBeenCalledWith('pattern-1-cache');
      expect(result).toEqual(mockPatterns);
    });

    test('should fetch patterns from API when not cached', async () => {
      const mockPatterns = [{ pid: '123', dir: 'North' }];
      cache.get.mockReturnValue(null);
      BusHttp.get.mockResolvedValue({
        data: { ptr: mockPatterns },
        error: null
      });

      const result = await busService.getPatterns('1');

      expect(BusHttp.get).toHaveBeenCalledWith('/getpatterns', {
        params: { rt: '1' }
      });
      expect(cache.log_miss).toHaveBeenCalledWith('pattern-1-cache');
      expect(cache.set).toHaveBeenCalledWith('pattern-1-cache', mockPatterns);
      expect(result).toEqual(mockPatterns);
    });
  });

  describe('getPredictions', () => {
    test('should fetch predictions for given stop', async () => {
      const mockPredictions = [{ prdtm: '20231225 14:30', vid: '123' }];
      BusHttp.get.mockResolvedValue({
        data: { prd: mockPredictions },
        error: null
      });

      const result = await busService.getPredictions('456');

      expect(BusHttp.get).toHaveBeenCalledWith('/getpredictions', {
        params: { stpid: '456' }
      });
      expect(result).toEqual(mockPredictions);
    });
  });

  describe('getRouteDirections', () => {
    test('should return cached directions when available', async () => {
      const mockDirections = ['North', 'South'];
      cache.get.mockReturnValue(mockDirections);

      const result = await busService.getRouteDirections('1');

      expect(cache.get).toHaveBeenCalledWith('dir-1-cache');
      expect(cache.log_hit).toHaveBeenCalledWith('dir-1-cache');
      expect(result).toEqual(mockDirections);
    });

    test('should fetch and process directions from API when not cached', async () => {
      const mockDirections = [{ dir: 'North' }, { dir: 'South' }];
      cache.get.mockReturnValue(null);
      BusHttp.get.mockResolvedValue({
        data: { directions: mockDirections },
        error: null
      });

      const result = await busService.getRouteDirections('1');

      expect(BusHttp.get).toHaveBeenCalledWith('/getdirections', {
        params: { rt: '1' }
      });
      expect(cache.log_miss).toHaveBeenCalledWith('dir-1-cache');
      expect(cache.set).toHaveBeenCalledWith('dir-1-cache', ['North', 'South']);
      expect(result).toEqual(['North', 'South']);
    });
  });

  describe('getStops', () => {
    test('should return cached stops when available', async () => {
      const mockStops = { direction: 'North', route: '1', stops: [] };
      cache.get.mockReturnValue(mockStops);

      const result = await busService.getStops('1', 'North');

      expect(cache.get).toHaveBeenCalledWith('stops-1-North-cache');
      expect(cache.log_hit).toHaveBeenCalledWith('stops-1-North-cache');
      expect(result).toEqual(mockStops);
    });

    test('should fetch stops from API when not cached', async () => {
      const mockStops = [{ stpid: '123', stpnm: 'Test Stop' }];
      cache.get.mockReturnValue(null);
      BusHttp.get.mockResolvedValue({
        data: { stops: mockStops },
        error: null
      });

      const result = await busService.getStops('1', 'North');

      expect(BusHttp.get).toHaveBeenCalledWith('/getstops', {
        params: { rt: '1', dir: 'North' }
      });
      expect(cache.log_miss).toHaveBeenCalledWith('stops-1-North-cache');
      expect(result).toEqual({
        direction: 'North',
        route: '1',
        stops: mockStops
      });
    });
  });

  describe('getGitHubWorkflow', () => {
    test('should fetch workflow data from GitHub API', async () => {
      const mockWebData = { workflow_runs: [] };
      const mockServerData = { workflow_runs: [] };
      
      axios.get.mockImplementation((url) => {
        if (url.includes('web')) {
          return Promise.resolve({ data: mockWebData });
        }
        return Promise.resolve({ data: mockServerData });
      });

      const result = await busService.getGitHubWorkflow();

      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        web: mockWebData,
        server: mockServerData
      });
    });

    test('should throw error when GitHub API fails', async () => {
      axios.get.mockRejectedValue(new Error('GitHub API Error'));

      await expect(busService.getGitHubWorkflow()).rejects.toThrow('GitHub API Error');
    });
  });

  describe('getLatestVersion', () => {
    test('should fetch latest version from GitHub API', async () => {
      const mockVersionData = { tag_name: 'v1.2.3' };
      axios.get.mockResolvedValue({ data: mockVersionData });

      const result = await busService.getLatestVersion();

      expect(axios.get).toHaveBeenCalledWith(
        process.env.GITHUB_VERSION_URL,
        { headers: { Authorization: 'token test-token' } }
      );
      expect(result).toBe('v1.2.3');
    });

    test('should throw error when version API fails', async () => {
      axios.get.mockRejectedValue(new Error('Version API Error'));

      await expect(busService.getLatestVersion()).rejects.toThrow('Version API Error');
    });
  });
});