/* eslint-disable no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const { app, server } = require('../index');
const { User } = require('../models/user.model');
const { ErrorTypes } = require('../lib');
const { DB_CONNECTION_STRING } = require('../config');

const { VALIDATION_ERROR, INVALID_ID, RESOURCE_NOT_FOUND } = ErrorTypes;

// FIXME test only the status codes for all edge cases; don't test validation

beforeAll(async () => {
  try {
    await mongoose.connect(DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteMany({});
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  server.close();
  const collections = await mongoose.connection.db.collections();
  collections.forEach(async (collection) => {
    await collection.remove();
  });
});

describe('Testing user routes', () => {
  describe('Post /users; create user route', () => {
    const testUser = {
      email: 'test98@gmail.com',
      password: 'testuser',
      firstName: 'test',
    };

    beforeEach(async () => {
      await User.deleteMany({});
    });

    test('should register new user to database', async () => {
      const {
        body: {
          success,
          data: { user },
        },
        statusCode,
      } = await request(app).post('/users').send(testUser);
      const savedUser = await User.findOne({ email: testUser.email });

      expect(success).toBe(true);
      expect(statusCode).toBe(201);
      expect(savedUser.email).toBe(user.email);
      expect(savedUser.username).toBe(user.username);
      expect(savedUser._id.toString()).toBe(user._id);
      expect(savedUser.password).toBeTruthy();
    });

    test('should not register user if required fields are absent', async () => {
      const expectedValidError = [
        {
          key: 'email',
          type: 'any.required',
          message: expect.any(String),
        },
        {
          key: 'firstName',
          type: 'any.required',
          message: expect.any(String),
        },
        {
          key: 'password',
          type: 'any.required',
          message: expect.any(String),
        },
      ];

      const {
        body: { error, success },
        statusCode,
      } = await request(app).post('/users').send({});
      const user = await User.find({});

      expect(success).toBe(false);
      expect(error.name).toBe('ApplicationError');
      expect(statusCode).toBe(VALIDATION_ERROR.statusCode);
      expect(error.code).toBe(VALIDATION_ERROR.code);

      expect(error.errors.sort((a, b) => (a.key > b.key ? 1 : -1))).toEqual(
        expectedValidError.sort((a, b) => (a.key > b.key ? 1 : -1)),
      );
      expect(user.length).toBe(0);
    });

    test('should not register user if email is not unique', async () => {
      const expectedValidError = [
        { key: 'email', type: 'any.unique', message: expect.any(String) },
      ];

      const { status } = await request(app).post('/users').send(testUser);
      expect(status).toBe(201);

      const {
        body: { error, success },
        statusCode,
      } = await request(app).post('/users').send(testUser);
      const user = await User.find({});

      expect(success).toBe(false);
      expect(error.name).toBe('ApplicationError');
      expect(error.code).toBe(VALIDATION_ERROR.code);
      expect(statusCode).toBe(VALIDATION_ERROR.statusCode);
      expect(error.errors).toEqual(expectedValidError);
      expect(user.length).toBe(1);
    });

    test("should not register user if password doesn't meet criteria", async () => {
      const expectedValidError = [
        { key: 'password', type: 'string.min', message: expect.any(String) },
        {
          key: 'password',
          type: 'string.pattern.base',
          message: expect.any(String),
        },
      ];

      const {
        body: { error, success },
        statusCode,
      } = await request(app).post('/users').send({
        email: 'test98@gmail.com',
        password: '2',
        firstName: 'test',
      });

      expect(success).toBe(false);
      expect(error.name).toBe('ApplicationError');
      expect(error.code).toBe(VALIDATION_ERROR.code);
      expect(statusCode).toBe(VALIDATION_ERROR.statusCode);
      expect(error.errors.sort((a, b) => (a.key > b.key ? 1 : -1))).toEqual(
        expectedValidError.sort((a, b) => (a.key > b.key ? 1 : -1)),
      );

      const user = await User.find({});
      expect(user.length).toBe(0);
    });
  });

  describe('Get /users/:userId; get existing user route', () => {
    const testUser = {
      req: {
        email: 'test98@gmail.com',
        password: 'testuser',
        firstName: 'test',
      },
      authToken: null,
    };

    beforeAll(async () => {
      await request(app).post('/users').send(testUser.req);

      const {
        body: {
          data: { authToken, user },
        },
      } = await request(app)
        .post('/auth/login')
        .send({ email: testUser.req.email, password: testUser.req.password });

      testUser.user = user;
      testUser.authToken = authToken;
    });

    test('should return 200 status with user object on valid userId', async () => {
      const {
        body: {
          data: { user },
        },
        statusCode,
      } = await request(app)
        .get(`/users/${testUser.user._id}`)
        .set({ Authorization: testUser.authToken });

      expect(statusCode).toBe(200);
      expect(user).toEqual(testUser.user);
    });

    test('should throw 400 error on invalid ID', async () => {
      const {
        body: { error },
        statusCode,
      } = await request(app)
        .get(`/users/12345`)
        .set({ Authorization: testUser.authToken });

      expect(statusCode).toBe(INVALID_ID.statusCode);
      expect(error.code).toBe(INVALID_ID.code);
      expect(error.message).toBe(INVALID_ID.message);
    });

    test('should throw 404 not found error on non-existing , but valid user ID', async () => {
      const {
        body: { error },
        statusCode,
      } = await request(app)
        .get(`/users/${testUser.user._id.slice(1)}c`)
        .set({ Authorization: testUser.authToken });

      expect(statusCode).toBe(RESOURCE_NOT_FOUND.statusCode);
      expect(error.code).toBe(RESOURCE_NOT_FOUND.code);
    });
  });

  describe('Post /users/:userId; update existing user route', () => {
    const testUser = {
      req: {
        email: 'test98@gmail.com',
        password: 'testuser',
        firstName: 'test',
      },
      authToken: null,
    };

    beforeEach(async () => {
      await User.deleteMany({});
      await request(app).post('/users').send(testUser.req);

      const {
        body: {
          data: { authToken, user },
        },
      } = await request(app)
        .post('/auth/login')
        .send({ email: testUser.req.email, password: testUser.req.password });

      testUser.user = user;
      testUser.authToken = authToken;
    });

    test('should update email, first name, last name with status 204', async () => {
      const update = {
        email: 'testnew@gmail.com',
        firstName: 'New',
        lastName: 'Test',
      };
      const { statusCode } = await request(app)
        .post(`/users/${testUser.user._id}`)
        .send(update)
        .set({ Authorization: testUser.authToken });

      expect(statusCode).toBe(204);
      const {
        body: {
          data: { user },
        },
      } = await request(app)
        .get(`/users/${testUser.user._id}`)
        .set({ Authorization: testUser.authToken });

      expect(user).toEqual({ ...testUser.user, ...update });
    });

    test('should update password with status 204', async () => {
      const update = {
        password: 'newPassword',
      };

      // update password
      const { statusCode } = await request(app)
        .post(`/users/${testUser.user._id}`)
        .send(update)
        .set({ Authorization: testUser.authToken });

      expect(statusCode).toBe(204);

      // verify if password updated in db and on login
      const {
        body: {
          data: { user },
        },
      } = await request(app)
        .get(`/users/${testUser.user._id}`)
        .set({ Authorization: testUser.authToken });

      const {
        body: {
          data: { user: userAfterLogin },
        },
      } = await request(app)
        .post('/auth/login')
        .send({ email: testUser.req.email, password: update.password });

      expect(user).toEqual(userAfterLogin);
    });

    test('should throw validation error with status 400 if non-existing fields are provided', async () => {
      const update = {
        field: 'invalid',
      };
      const {
        statusCode,
        body: { error },
      } = await request(app)
        .post(`/users/${testUser.user._id}`)
        .send(update)
        .set({ Authorization: testUser.authToken });

      expect(statusCode).toBe(VALIDATION_ERROR.statusCode);
      expect(error.code).toBe(VALIDATION_ERROR.code);
      expect(error.errors).toEqual([
        {
          key: 'field',
          type: 'object.unknown',
          message: expect.any(String),
        },
      ]);
    });
  });

  describe('Delete /users/:userId; delete existing user route', () => {
    const testUser = {
      req: {
        email: 'test98@gmail.com',
        password: 'testuser',
        firstName: 'test',
      },
      authToken: null,
    };

    beforeEach(async () => {
      await User.deleteMany({});
      await request(app).post('/users').send(testUser.req);

      const {
        body: {
          data: { authToken, user },
        },
      } = await request(app)
        .post('/auth/login')
        .send({ email: testUser.req.email, password: testUser.req.password });

      testUser.user = user;
      testUser.authToken = authToken;
    });

    test('should return 204 status on successful deletion', async () => {
      const { statusCode } = await request(app)
        .delete(`/users/${testUser.user._id}`)
        .set({ Authorization: testUser.authToken });

      const users = await User.find();
      expect(statusCode).toBe(204);
      expect(users.length).toBe(0);
    });
  });
});
