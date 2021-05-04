/* eslint-disable no-undef */
'use strict';
require('dotenv').config();

// eslint-disable-next-line no-unused-vars
const { response } = require('express');
//var assert = require('assert');
let request = require('supertest');
//var app = require('../app.js');

request = request('http://localhost:3000/api/v1');
const email = 'admin@example.com';
const password = '1234';
const jwtoken = process.env.VALID_JWT_FOR_TEST;
//'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDkwZjc1YTM3M2FjOTA3NGZmYWQ0MDIiLCJpYXQiOjE2MjAxNDMwOTUsImV4cCI6MTYyMDE1MDI5NX0.66K-HEdh2loe4PEXAddAZNF42VdG56Wj9UTkfiDzis4';

let product = {
  name: 'coche',
  price: 1000,
  tags: ['motor'],
  sale: 'true',
};

describe('anuncios', function () {
  describe('POST', function () {
    describe('login', function () {
      it('Should return a jwt', function (done) {
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
    });

    describe('create an advert with wrong value in "sale" field', function () {
      it('Should return json with error and 400 status code when sale is not "true" or "false"', function (done) {
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
    });

    describe('create an advert with missing required field', function () {
      it('Should return json with error and 400 status code when a required field is missing', function (done) {
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
    });

    describe('create an advert without token', function () {
      it('Should return json with error and 401 status code when token is missing', function (done) {
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
    });

    describe('get ads with wrong price range format', function () {
      it('Should return an json with error and status 500', function (done) {
        request
          .get('/anuncios/?price=50-10')
          .set('Authorization', jwtoken)
          .expect('Content-Type', /json/)
          .expect(/{"error":"/)
          .expect(500, done);
      });
    });

    describe('get ads with an invalid token', function () {
      it('Should return an json with error and status 401', function (done) {
        request
          .get('/anuncios/')
          .set('Authorization', jwtoken + 'a')
          .expect('Content-Type', /json/)
          .expect(/{"error":"invalid/)
          .expect(401, done);
      });
    });

    describe('get tags list', function () {
      it('Should return json with tags', function (done) {
        request
          .get('/anuncios/tags')
          .set('Authorization', jwtoken)
          .expect(/{"tags":\[/, done);
      });
    });
  });
});
