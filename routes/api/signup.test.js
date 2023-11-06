/* global expect */
/* global describe */
/* global it */
/* global beforeAll */
/* global afterAll */
/* global afterEach */
const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = require('../../app');
const { User } = require('../../models/User');

require('dotenv').config();

const { PORT, DB_HOST_TEST } = process.env;

describe('signup controller', () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should return status code 200 and token', async () => {
    const newUser = {
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
    };

    const secretKey = 'rtKasWhyPtTERoP9LYG5';
    const options = {
      expiresIn: '1h',
    };
    const token = jwt.sign(newUser, secretKey, options);

    await User.create({
      ...newUser,
      password: await bcrypt.hash(newUser.password, 10),
      token,
    });

    const { statusCode, body } = await request(app)
      .post('/api/users/login')
      .send({ email: newUser.email, password: newUser.password });

    expect(statusCode).toBe(200);
    expect(body.token).toBeTruthy();

    // проверка наличичия пользователя с токеном в базе данных
    const user = await User.findOne({ email: newUser.email });
    expect(user.token).toBeTruthy();

    // // Проверка для создания нового пользователя в базе данных
    // // создание запроса на сервер
    // const { statusCode, body } = await request(app)
    //   .post('/api/users/register')
    //   .send(newUser);
    // console.log(body.message);

    // // toBe - это функция, используемая для сравнения значения body.username с ожидаемым значением newUser.username. Если значения не равны, тест не пройдет
    // expect(statusCode).toBe(201);
    // expect(body.username).toBe(newUser.username);
    // expect(body.email).toBe(newUser.email);

    // // проверка на сохрение пользователя в базе даных
    // const user = await User.findOne({ email: newUser.email });
    // expect(user.email).toBe(newUser.email);
  });
});
