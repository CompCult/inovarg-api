const request = require('supertest');
const User = require('../../server/models/user');

describe('/users', () => {
  let server;
  
  beforeEach(() => {
    server = require('../../server/server');
  });
  afterEach(async () => { 
    await server.close();
    await User.remove({});
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await User.insertMany([
        { name: 'user1', email: 'email1', type: 'type', password: 'pass1' },
        { name: 'user2', email: 'email2', type: 'type', password: 'pass2' },
        { name: 'other3', email: 'email3', type: 'type3', password: 'pass3' }
      ]);
    });

    it('it should return all users if page and limit are not specified', async () => {
      const res = await request(server).get('/users')

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some(user => user.email === 'email1')).toBeTruthy();
      expect(res.body.some(user => user.email === 'email2')).toBeTruthy();
    });

    it('should return users who match the incomplete name parameter', async () => {
      const res = await request(server)
        .get(`/users`)
        .query({ name: 'user' });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.every(user => user.name.match('user'))).toBeTruthy();
    });

    it(`should return users according to the quantity and 
        page specified by the parameters limit and page`, async () => {
      const res = await request(server)
        .get(`/users`)
        .query({ limit: 1, page: 1 });

      expect(res.status).toBe(200);
      expect(res.body.docs.length).toBe(1);
      expect(res.body.docs.some(user => user.email === 'email1')).toBeTruthy();
    });

    it('should return a 400 error if page is specified but limit is not', async () => {
      const res = await request(server)
        .get('/users')
        .query({ page: 1 })

      expect(res.status).toBe(400);
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
})
