/* eslint-disable no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const { User } = require('../models/user.model');
const { ErrorTypes } = require('../lib');
const { DB_CONNECTION_STRING } = require('../config');

const { VALIDATION_ERROR } = ErrorTypes;

const server = app.listen(3001, () => {
  console.log('listening on port 3001');
});

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

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  server.close();
  await mongoose.connection.db.dropCollection('users');
});

describe('testing POST /users endpoint', () => {
  test('should register new user to database', async () => {
    const email = 'shraddha1998@gmail.com';
    const password = 'shraddha1998';
    const firstName = 'shraddha98';
    const DOB = '1998-09-21';

    const {
      body: {
        success,
        data: { user },
      },
      statusCode,
    } = await request(app).post('/users').send({
      user: { email, password, firstName, DOB },
    });
    const savedUser = await User.findOne({ email });

    expect(success).toBe(true);
    expect(statusCode).toBe(201);
    expect(savedUser.email).toBe(user.email);
    expect(savedUser.username).toBe(user.username);
    expect(savedUser._id.toString()).toBe(user._id);
    expect(savedUser.password).toBeTruthy();
  });

  test('should not register user if required fields are absent', async () => {
    const expectedValidError = {
      email: {
        type: 'required',
        message: expect.any(String),
      },
      firstName: {
        type: 'required',
        message: expect.any(String),
      },
      password: {
        type: 'required',
        message: expect.any(String),
      },
      DOB: {
        type: 'required',
        message: expect.any(String),
      },
    };

    const {
      body: { error, success },
      statusCode,
    } = await request(app).post('/users').send({ user: {} });
    const user = await User.find({});

    expect(success).toBe(false);
    expect(error.name).toBe('ApplicationError');
    expect(statusCode).toBe(VALIDATION_ERROR.statusCode);
    expect(error.code).toBe(VALIDATION_ERROR.code);
    expect(error.validationErrors).toEqual(expectedValidError);
    expect(user.length).toBe(0);
  });

  test('should not register user if email is not unique', async () => {
    const email = 'shraddha1998@gmail.com';
    const password = 'shraddha1998';
    const firstName = 'shraddha98';
    const DOB = '1998-09-21';
    const expectedValidError = {
      email: { type: 'unique', message: expect.any(String) },
    };

    const { status } = await request(app)
      .post('/users')
      .send({ user: { email, password, firstName, DOB } });
    expect(status).toBe(201);

    const {
      body: { error, success },
      statusCode,
    } = await request(app)
      .post('/users')
      .send({ user: { email, password, firstName, DOB } });
    const user = await User.find({});

    expect(success).toBe(false);
    expect(error.name).toBe('ApplicationError');
    expect(error.code).toBe(VALIDATION_ERROR.code);
    expect(statusCode).toBe(VALIDATION_ERROR.statusCode);
    expect(error.validationErrors).toEqual(expectedValidError);
    expect(user.length).toBe(1);
  });

  test('should not register user if not older than 13 years', async () => {
    const email = 'shraddha1998@gmail.com';
    const password = 'shraddha1998';
    const firstName = 'shraddha98';
    const DOB = '2011-09-21'; // 10 years old
    const expectedValidError = {
      DOB: { type: 'user defined', message: expect.any(String) },
    };

    const {
      body: { error, success },
      statusCode,
    } = await request(app)
      .post('/users')
      .send({ user: { email, password, firstName, DOB } });

    expect(success).toBe(false);
    expect(error.name).toBe('ApplicationError');
    expect(error.code).toBe(VALIDATION_ERROR.code);
    expect(statusCode).toBe(VALIDATION_ERROR.statusCode);
    expect(error.validationErrors).toEqual(expectedValidError);

    const user = await User.find({});
    expect(user.length).toBe(0);
  });

  test("should not register user if password doesn't meet criteria", async () => {
    const email = 'shraddha1998@gmail.com';
    const password = '1998';
    const firstName = 'shraddha98';
    const DOB = '1997-09-21';
    const expectedValidError = {
      password: { type: 'minlength', message: expect.any(String) },
    };

    const {
      body: { error, success },
      statusCode,
    } = await request(app)
      .post('/users')
      .send({ user: { email, password, firstName, DOB } });

    expect(success).toBe(false);
    expect(error.name).toBe('ApplicationError');
    expect(error.code).toBe(VALIDATION_ERROR.code);
    expect(statusCode).toBe(VALIDATION_ERROR.statusCode);
    expect(error.validationErrors).toEqual(expectedValidError);

    const user = await User.find({});
    expect(user.length).toBe(0);
  });
});
