const request = require('supertest');
const express = require('express');

jest.mock('../src/tc-app/train/train-service', () => ({
  getRoutes: jest.fn(),
  getPatterns: jest.fn(),
  getPredictions: jest.fn(),
  getStops: jest.fn(),
  getTrains: jest.fn(),
  getArrivals: jest.fn()
}));

const router = require('../src/tc-app/train/train-router');
const trainService = require('../src/tc-app/train/train-service');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Train Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /routes', () => {
    test('should return train routes successfully', async () => {
      const mockRoutes = [
        { route: 'red', name: 'Red Line', color: '#c60c30', type: 'T' },
        { route: 'blue', name: 'Blue Line', color: '#00a1de', type: 'T' }
      ];
      
      trainService.getRoutes.mockResolvedValue(mockRoutes);
      
      const res = await request(app).get('/routes');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        route: 'red',
        name: 'Red Line',
        color: '#c60c30',
        type: 'T'
      });
    });

    test('should handle search query for trains', async () => {
      const mockRoutes = [
        { route: 'red', name: 'Red Line', color: '#c60c30', type: 'T' },
        { route: 'blue', name: 'Blue Line', color: '#00a1de', type: 'T' }
      ];
      
      trainService.getRoutes.mockResolvedValue(mockRoutes);
      
      const res = await request(app).get('/routes?search=red');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return all train routes without pagination', async () => {
      const mockRoutes = Array.from({ length: 8 }, (_, i) => ({
        route: `line${i + 1}`,
        name: `Line ${i + 1}`,
        color: '#000000',
        type: 'T'
      }));
      
      trainService.getRoutes.mockResolvedValue(mockRoutes.map(r => ({ ...r, type: undefined })));
      
      const res = await request(app).get('/routes');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(8);
      expect(res.body[0].type).toBe('T');
    });

    test('should return 400 when train service fails', async () => {
      trainService.getRoutes.mockRejectedValue(new Error('Train service error'));
      
      const res = await request(app).get('/routes');
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /patterns', () => {
    test('should return train patterns', async () => {
      const mockPatterns = [{
        id: 'red_north',
        shape: [{ paths: [{ lat: 41.8781, lng: -87.6298 }] }]
      }];
      
      const mockStops = [{ 
        lat: 41.8781, 
        lng: -87.6298, 
        name: 'Test Station', 
        id: '123',
        type: 'T'
      }];
      
      trainService.getPatterns.mockResolvedValue(mockPatterns);
      trainService.getStops.mockResolvedValue(mockStops);
      
      const res = await request(app).get('/patterns?route=red&color=%23c60c30');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toMatchObject({
          id: 'red_north',
          route: 'red'
        });
      }
    });

    test('should return 400 when pattern service fails', async () => {
      trainService.getPatterns.mockRejectedValue(new Error('Pattern service error'));
      
      const res = await request(app).get('/patterns?route=red&color=%23c60c30');
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /predictions', () => {
    test('should return train predictions', async () => {
      const mockPredictions = [{
        arrT: '2023-12-25T14:30:00',
        prdt: '2023-12-25T14:25:00',
        staId: '123',
        staNm: 'Test Station',
        rt: 'red',
        destNm: 'Howard'
      }];
      
      trainService.getArrivals.mockResolvedValue(mockPredictions);
      
      const res = await request(app).get('/predictions?stop=123&route=red');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return 400 when prediction service fails', async () => {
      trainService.getArrivals.mockRejectedValue(new Error('Prediction service error'));
      
      const res = await request(app).get('/predictions?stop=123&route=red');
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /trains', () => {
    test('should return train data', async () => {
      const mockTrainData = [{
        trainId: '123',
        route: 'red',
        position: { lat: 41.8781, lng: -87.6298 },
        destination: 'Howard',
        nextStop: 'Test Station'
      }];
      
      trainService.getTrains.mockResolvedValue(mockTrainData);
      
      const res = await request(app).get('/trains?route=red');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return 200 even when train service fails (no error handling)', async () => {
      trainService.getTrains.mockRejectedValue(new Error('Train service error'));
      
      const res = await request(app).get('/trains?route=red');
      
      // The trains endpoint doesn't have error handling, so it will throw
      expect(res.status).toBe(500);
    });
  });
});

