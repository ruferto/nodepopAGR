'use strict';
const resize = require('./resize');
const cote = require('cote');

const responder = new cote.Responder({ name: 'thumbnail service' });

responder.on('create thumbnail', async (req, done) => {
  const { path, filename } = req;
  console.log('service:', path, filename, Date.now());

  try {
    await resize(path, filename);
  } catch (error) {
    console.error(error);
  }
  done();
});
