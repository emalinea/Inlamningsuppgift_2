const request = require('supertest');
const app = require('../app');


describe('GET /api/products', () => {
  it('should respond with status 200 and return an array', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});


describe('GET /api/product', () => {
  it('should return 200 or 404 depending on if product exists', async () => {
    const res = await request(app).get('/api/product?id=1');
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('id');
    }
  });
});


describe('POST /api/create', () => {
  it('should create a new product and redirect', async () => {
    const res = await request(app)
      .post('/api/create')
      .send({
        name: 'Testprodukt',
        description: 'En testbeskrivning',
        price: 99,
        quantity: 5,
        category: 'Testkategori'
      });

    expect([200, 302]).toContain(res.statusCode);
  });


  it('should return 400 when required field is missing', async () => {
    const res = await request(app)
      .post('/api/create')
      .send({
        name: 'Testprodukt',
        
        price: 99,
        quantity: 5,
        category: 'Testkategori'
      });

    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('Alla fält måste fyllas i');
  });
});


describe('POST /api/products/:id/delete', () => {
  it('should delete a product and redirect or return 404 if not found', async () => {
    const res = await request(app).post('/api/products/1/delete');
    expect([200, 302, 404]).toContain(res.statusCode);
  });
});
