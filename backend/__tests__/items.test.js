const request = require('supertest');
const app = require('../app');

describe('Item API', () => {
  beforeEach(async () => {
    await request(app).post('/api/reset'); // Clean slate
  });

  it('should create a new item', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Item 1', description: 'First item' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Item 1');
  });

  it('should get all items', async () => {
    await request(app).post('/api/items').send({ name: 'Item 1' });
    const res = await request(app).get('/api/items');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Item 1');
  });

  it('should update an item', async () => {
    const created = await request(app)
      .post('/api/items')
      .send({ name: 'Item to update' });

    const res = await request(app)
      .put(`/api/items/${created.body.id}`)
      .send({ name: 'Updated Name' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('should delete an item', async () => {
    const created = await request(app)
      .post('/api/items')
      .send({ name: 'Item to delete' });

    const res = await request(app).delete(`/api/items/${created.body.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Item deleted');
  });

  it('should return 404 if updating non-existent item', async () => {
    const res = await request(app)
      .put('/api/items/999')
      .send({ name: 'Does not exist' });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Item not found');
  });
});
