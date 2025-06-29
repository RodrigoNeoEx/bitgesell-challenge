const request = require('supertest');
const fs = require('fs/promises');
const app = require('../app');

jest.mock('fs/promises');

describe('Items API', () => {
  const mockData = [
    { id: 1, name: 'Monitor', price: 100 },
    { id: 2, name: 'Desk', price: 200 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/items return list', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      items: mockData,
      page: 1,
      pageSize: 10,
      total: mockData.length,
    });
  });

  it('GET /api/items?q=desk filter by name', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    const res = await request(app).get('/api/items').query({ q: 'desk' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      items: [mockData[1]],
      page: 1,
      pageSize: 10,
      total: 1,
    });
  });

  it('GET /api/items/:id return if item exist', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    const res = await request(app).get('/api/items/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData[0]);
  });

  it('GET /api/items/:id return 404 if dont exist', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    const res = await request(app).get('/api/items/999');
    expect(res.status).toBe(404);
  });

  it('POST /api/items create items', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    fs.writeFile.mockResolvedValue();
    const newItem = { name: 'Chair', price: 50 };
    const res = await request(app).post('/api/items').send(newItem);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Chair');
    expect(fs.writeFile).toHaveBeenCalled();
  });

  it('GET /api/items return 500 for read error', async () => {
    fs.readFile.mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(500);
  });

  it('POST /api/items return 400 for invalid payload (empty name)', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify([]));
    const res = await request(app).post('/api/items').send({ name: '', price: 10 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid payload/i);
  });

  it('POST /api/items return 400 for invalid payload (price is not a number)', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify([]));
    const res = await request(app).post('/api/items').send({ name: 'Monitor', price: 'dez' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid payload/i);
  });

  it('POST /api/items return 400 for invalid payload (price is under 0)', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify([]));
    const res = await request(app).post('/api/items').send({ name: 'Monitor', price: -5 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid payload/i);
  });
});
