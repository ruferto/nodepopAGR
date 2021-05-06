'use strict';
require('dotenv').config();

let anunciosJSON;

const fs = require('fs');

fs.readFile('./data/anuncios.json', 'utf8', (err, data) => {
  if (err) {
    console.log(`Error al leer el archivo: ${err}`);
  } else {
    anunciosJSON = JSON.parse(data);
  }
});

// eslint-disable-next-line no-unused-vars
const { mongoose, connectMongoose, Usuario, Anuncio } = require('./models');

main().catch((err) => console.error(err));

async function main() {
  await initUsuarios();
  await initAnuncios();
  mongoose.connection.close();
}

async function initAnuncios() {
  const { deletedCount } = await Anuncio.deleteMany();
  console.log(`Eliminados ${deletedCount} anuncios.`);

  const result = await Anuncio.insertMany(anunciosJSON);
  console.log(
    `Insertados ${result.length} anuncio${result.length > 1 ? 's' : ''}.`
  );
}

async function initUsuarios() {
  const { deletedCount } = await Usuario.deleteMany();
  console.log(`Eliminados ${deletedCount} usuarios.`);

  const result = await Usuario.insertMany({
    email: process.env.USER_EMAIL,
    password: await Usuario.hashPassword(process.env.USER_PASSWORD),
  });
  console.log(
    `Insertados ${result.length} usuario${result.length > 1 ? 's' : ''}.`
  );
}
