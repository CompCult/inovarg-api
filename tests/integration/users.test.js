const request = require('supertest');
const User = require('../../server/models/user');

let server;

describe('/users', () => {
  beforeEach(() => {
    server = require('../../server/server');
  });
  afterEach(async () => { 
    server.close();
    await User.remove({});
  });


  describe('GET /', () => {
    it('should return all users', async () => {
      await User.insertMany([
        { name: 'user1', email: 'email1', type: 'type1', password: 'pass1' },
        { name: 'user2', email: 'email2', type: 'type2', password: 'pass2' }
      ]);

      const res = await request(server).get('/users')

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(user => user.email === 'email1')).toBeTruthy();
      expect(res.body.some(user => user.email === 'email2')).toBeTruthy();
    });
  });


  describe('GET /users/:id', () => {
    it('should return a user if valid id is passed', async () => {
      const user = new User({
        name: 'user',
        email: 'email',
        type: 'type',
        password: 'pass'
      });
      await user.save();

      const res = await request(server).get(`/users/${user._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', user.email);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });
  });


  describe('GET /query/fields', () => {
    beforeEach(async () => {
      await User.insertMany([
        { name: 'user1', email: 'email1', type: 'type', password: 'pass1' },
        { name: 'user2', email: 'email2', type: 'type', password: 'pass2' },
        { name: 'other3', email: 'email3', type: 'type3', password: 'pass3' }
      ]);
    });
    afterEach(async () => {
      await User.remove({});
    });

    it('should return users who match the incomplete "name" parameter', async () => {
      const res = await request(server)
        .get(`/users/query/fields`)
        .query({ name: 'user' });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('should return the users according to the amount specified by the "limit"', async () => {
      const res = await request(server)
        .get(`/users/query/fields`)
        .query({ type: 'type', limit: 1 });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body.some(user => user.email === 'email1')).toBeTruthy();
    });

    it(`should return users according to the quantity and 
        page specified by the parameters "limit" and "page"`, async () => {
      const res = await request(server)
        .get(`/users/query/fields`)
        .query({ type: 'type', limit: 1, page: 2 });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body.some(user => user.email === 'email2')).toBeTruthy();
    });
  });
})
