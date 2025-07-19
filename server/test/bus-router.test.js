const request = require('supertest');
const express = require('express');

jest.mock('../src/tc-app/bus/bus-service', () => ({
  getRoutes: jest.fn(() => Promise.reject(new Error('fail')))
}));

const router = require('../src/tc-app/bus/bus-router');

const app = express();
app.use('/', router);

test('GET /routes failure returns 400', async () => {
  const res = await request(app).get('/routes');
  expect(res.status).toBe(400);
});

