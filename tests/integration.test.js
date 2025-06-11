const request = require('supertest');
const app = require('../app');

describe('GET /api/products', () => {
  it('should respond with status 200 and return an array', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
