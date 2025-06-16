const request = require('supertest');
const app = require('../app');

describe('GET /api/products', () => {
  it('should respond with status 200 and return an array', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/products/:id', () => {
  it('should return 200 or 404 depending on if product exists', async () => {
    const res = await request(app).get('/api/products/1');
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('id');
    }
  });
});

describe('POST /api/products', () => {
  it('should create a new product and return 201', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Testprodukt',
        description: 'En testbeskrivning',
        price: 99,
        quantity: 5,
        category: 'Testkategori',
      });

    expect(res.statusCode).toBe(201); 
    expect(res.body).toHaveProperty('message', 'Produkt skapad');
  });

  it('should return 400 when required field is missing', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Testprodukt',
        
        price: 99,
        quantity: 5,
        category: 'Testkategori',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Alla fält måste fyllas i.');
  });
});

describe('DELETE /api/products/:id', () => {
  it('should delete a product and return 200 or 404', async () => {
    const res = await request(app).delete('/api/products/1');
    expect([200, 404]).toContain(res.statusCode);
  });
});
