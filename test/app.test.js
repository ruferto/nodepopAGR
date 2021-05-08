/* eslint-disable no-undef */
'use strict';
require('dotenv').config();

// eslint-disable-next-line no-unused-vars
const { response } = require('express');
// eslint-disable-next-line no-unused-vars
var assert = require('assert');
let request = require('supertest');
//var app = require('../app.js');

request = request('http://localhost:3000/api/v1');
const email = process.env.USER_EMAIL;
const password = process.env.USER_PASSWORD;
const jwtoken = process.env.VALID_JWT_FOR_TEST;

let product = {
  name: 'coche',
  price: 1000,
  tags: ['motor'],
  sale: 'true',
};

describe('anuncios', function (done) {
  describe('POST', function () {
    describe('login', function () {
      it('Should return a jwt', function () {
        request
          .post('/loginJWT')
          .send({
            email,
            password,
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(
            /^{"token":"[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*"}$/,
            done
          );
      });
      it('Should return a json with error when credentials are wrong', function (done) {
        request
          .post('/loginJWT')
          .send({
            email: 'quack',
            password: '1111',
          })
          .expect('Content-Type', /json/)
          .expect(401)
          .expect('{"error":"invalid credentials"}', done);
      });
    });
    describe('create an advert', function () {
      it('Should return a json and 201 status code', function (done) {
        request
          .post('/anuncios')
          .set('Authorization', jwtoken)
          .send(product)
          .expect('Content-Type', /json/)
          .expect(201, done);
      });
      it('Should return json with error and 400 status code with wrong value in "sale" field', function (done) {
        product = {
          name: 'coche',
          price: 1000,
          tags: ['motor'],
          sale: 'verdad',
        };
        request
          .post('/anuncios')
          .set('Authorization', jwtoken)
          .send(product)
          .expect('Content-Type', /json/)
          .expect('{"error":"sale must be \\"true\\" or \\"false\\""}')
          .expect(400, done);
      });

      it('Should return json with error and 400 status code when missing required field', function (done) {
        product = {
          name: 'coche',
          tags: ['motor'],
          sale: 'true',
        };
        request
          .post('/anuncios')
          .set('Authorization', jwtoken)
          .send(product)
          .expect('Content-Type', /json/)
          .expect(/{"error":"required field.*/)
          .expect(400, done);
      });

      it('Should return json with error and 401 status code when no token provided', function (done) {
        request
          .post('/anuncios')
          .send(product)
          .expect('Content-Type', /json/)
          .expect(/{"error":"no token.*/)
          .expect(401, done);
      });
    });
  });

  describe('GET', function () {
    describe('get ads list', function () {
      it('Should return array json with ads', function (done) {
        request
          .get('/anuncios')
          .set('Authorization', jwtoken)
          .end((err, response) => {
            if (response.body.length) done();
            else done(new Error('It is not an array'));
          });
      });

      it('Should return an json with error and status 500 when wrong price range format provided', function (done) {
        request
          .get('/anuncios/?price=50-10')
          .set('Authorization', jwtoken)
          .expect('Content-Type', /json/)
          .expect(
            '{"error":"Price field: Maximum must be larger than minimum"}'
          )
          .expect(500, done);
      });

      it('Should return an json with error and status 401 when an invalid token is provided', function (done) {
        request
          .get('/anuncios/')
          .set('Authorization', jwtoken + 'a')
          .expect('Content-Type', /json/)
          .expect(/{"error":"invalid/)
          .expect(401, done);
      });
    });

    describe('get tags list', function () {
      it('Should return json with array of tags', function (done) {
        request
          .get('/anuncios/tags')
          .set('Authorization', jwtoken)
          .expect(/{"tags":\[/, done);
      });
    });
  });
});
