const request = require('supertest');
const express = require('express');

jest.mock('../src/tc-app/bus/bus-service', () => ({
  getRoutes: jest.fn(),
  getPatterns: jest.fn(),
  getPredictions: jest.fn(),
  getRouteDirections: jest.fn(),
  getStops: jest.fn(),
  getGitHubWorkflow: jest.fn(),
  getLatestVersion: jest.fn()
}));

const router = require('../src/tc-app/bus/bus-router');
const busService = require('../src/tc-app/bus/bus-service');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Bus Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /routes', () => {
    test('should return routes successfully', async () => {
      const mockRoutes = [
        { rt: '1', rtnm: 'Route 1', rtclr: '#FF0000' },
        { rt: '2', rtnm: 'Route 2', rtclr: '#00FF00' }
      ];
      
      busService.getRoutes.mockResolvedValue(mockRoutes);
      
      const res = await request(app).get('/routes');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        route: '1',
        name: 'Route 1',
        color: '#FF0000',
        type: 'B'
      });
    });

    test('should handle search query', async () => {
      const mockRoutes = [
        { rt: '1', rtnm: 'Downtown Express', rtclr: '#FF0000' },
        { rt: '2', rtnm: 'Airport Shuttle', rtclr: '#00FF00' }
      ];
      
      busService.getRoutes.mockResolvedValue(mockRoutes);
      
      const res = await request(app).get('/routes?search=downtown');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should handle pagination', async () => {
      const mockRoutes = Array.from({ length: 15 }, (_, i) => ({
        rt: `${i + 1}`,
        rtnm: `Route ${i + 1}`,
        rtclr: '#FF0000'
      }));
      
      busService.getRoutes.mockResolvedValue(mockRoutes);
      
      const res = await request(app).get('/routes?limit=5&index=2');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(5);
    });

    test('should return 400 when service fails', async () => {
      busService.getRoutes.mockRejectedValue(new Error('Service error'));
      
      const res = await request(app).get('/routes');
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /route-color', () => {
    test('should return route colors', async () => {
      const mockRoutes = [
        { rt: '1', rtnm: 'Route 1', rtclr: '#FF0000' },
        { rt: '2', rtnm: 'Route 2', rtclr: '#00FF00' }
      ];
      
      busService.getRoutes.mockResolvedValue(mockRoutes);
      
      const res = await request(app).get('/route-color?ids=1,2');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        '1': '#FF0000',
        '2': '#00FF00'
      });
    });

    test('should return 400 when service fails', async () => {
      busService.getRoutes.mockRejectedValue(new Error('Service error'));
      
      const res = await request(app).get('/route-color?ids=1,2');
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /patterns', () => {
    test('should return route patterns', async () => {
      const mockPatterns = [{
        dir: 'North',
        pid: '123',
        pt: [
          { typ: 'W', lat: 41.8781, lon: -87.6298 },
          { typ: 'S', lat: 41.8781, lon: -87.6298, stpnm: 'Test Stop', stpid: '456' }
        ]
      }];
      
      busService.getPatterns.mockResolvedValue(mockPatterns);
      
      const res = await request(app).get('/patterns?route=1&color=%23FF0000');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toMatchObject({
        dir: 'North',
        id: '123',
        type: 'B',
        route: '1'
      });
    });

    test('should return 400 when service fails', async () => {
      busService.getPatterns.mockRejectedValue(new Error('Service error'));
      
      const res = await request(app).get('/patterns?route=1&color=%23FF0000');
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /predictions', () => {
    test('should return predictions', async () => {
      const mockPredictions = [{
        typ: 'A',
        stpnm: 'Test Stop',
        stpid: '123',
        vid: '456',
        rt: '1',
        rtdir: 'North',
        des: 'Downtown',
        prdtm: '20231225 14:30',
        tmstmp: '20231225 14:25',
        dly: false
      }];
      
      busService.getPredictions.mockResolvedValue(mockPredictions);
      
      const res = await request(app).get('/predictions?stop=123');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toMatchObject({
        type: 'A',
        name: 'Test Stop',
        stopId: '123',
        route: '1',
        direction: 'North'
      });
    });

    test('should return 400 when service fails', async () => {
      busService.getPredictions.mockRejectedValue(new Error('Service error'));
      
      const res = await request(app).get('/predictions?stop=123');
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /stops', () => {
    test('should return route stops', async () => {
      busService.getRouteDirections.mockResolvedValue(['North', 'South']);
      busService.getStops.mockResolvedValue({
        direction: 'North',
        route: '1',
        stops: [{ stpid: '123', stpnm: 'Test Stop' }]
      });
      
      const res = await request(app).get('/stops?route=1');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return 400 when service fails', async () => {
      busService.getRouteDirections.mockRejectedValue(new Error('Service error'));
      
      const res = await request(app).get('/stops?route=1');
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /app-status', () => {
    test('should return app status', async () => {
      const mockStatus = {
        web: { workflow_runs: [] },
        server: { workflow_runs: [] }
      };
      
      busService.getGitHubWorkflow.mockResolvedValue(mockStatus);
      
      const res = await request(app).get('/app-status');
      
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        web: [],
        server: []
      });
    });

    test('should return 400 when service fails', async () => {
      busService.getGitHubWorkflow.mockRejectedValue(new Error('Service error'));
      
      const res = await request(app).get('/app-status');
      
      expect(res.status).toBe(400);
      expect(res.text).toBe('Failed to update app status');
    });
  });

  describe('GET /version', () => {
    test('should return version', async () => {
      busService.getLatestVersion.mockResolvedValue('v1.2.3');
      
      const res = await request(app).get('/version');
      
      expect(res.status).toBe(200);
      expect(res.text).toBe('v1.2.3');
    });

    test('should return 400 when service fails', async () => {
      busService.getLatestVersion.mockRejectedValue(new Error('Service error'));
      
      const res = await request(app).get('/version');
      
      expect(res.status).toBe(400);
      expect(res.text).toBe('Failed to get version');
    });
  });
});

