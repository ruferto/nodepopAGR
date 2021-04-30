'use strict';
const resize = require('../lib/resize');

// Thumbnails generator service

const cote = require('cote');

// declarar el microservicio
const responder = new cote.Responder({ name: 'thumbnail service' });

// tabla de conversión de moneda - almacen de datos del microservicio
// const rates = {
//   usd_eur: 0.86,
//   eur_usd: 1.14,
// };

// lógica del microservicio
responder.on('create thumbnail', async (req, done) => {
  const { path, filename, image } = req;
  console.log('service:', path, filename, image, Date.now());

  // calcular el resultado
  //const result = rates[`${desde}_${hacia}`] * cantidad;
  await resize(path, filename);
  done();
});
