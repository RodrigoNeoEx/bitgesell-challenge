const request = require('supertest');
// Ajuste o path se necessário
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

  it('GET /api/items retorna lista', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('GET /api/items?q=desk filtra por nome', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    const res = await request(app).get('/api/items').query({ q: 'desk' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockData[1]]);
  });

  it('GET /api/items/:id retorna item existente', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    const res = await request(app).get('/api/items/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData[0]);
  });

  it('GET /api/items/:id retorna 404 para inexistente', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    const res = await request(app).get('/api/items/999');
    expect(res.status).toBe(404);
  });

  it('POST /api/items cria item', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockData));
    fs.writeFile.mockResolvedValue();
    const newItem = { name: 'Chair', price: 50 };
    const res = await request(app).post('/api/items').send(newItem);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Chair');
    expect(fs.writeFile).toHaveBeenCalled();
  });

  it('GET /api/items retorna 500 se erro de leitura', async () => {
    fs.readFile.mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(500);
  });
});
