'use strict';
require('dotenv').config();

let advertsJSON;

const fs = require('fs');

fs.readFile('./data/anuncios.json', 'utf8', (err, data) => {
  if (err) {
    console.log(`Error al leer el archivo: ${err}`);
  } else {
    advertsJSON = JSON.parse(data);
  }
});

// eslint-disable-next-line no-unused-vars
const { mongoose, connectMongoose, Usuario, Anuncio } = require('./models');

main().catch((err) => console.error(err));

async function main() {
  await initUsers();
  await initAdverts();
  mongoose.connection.close();
}

async function initAdverts() {
  const { deletedCount } = await Anuncio.deleteMany();
  console.log(
    `Eliminado${deletedCount !== 1 ? 's' : ''} ${deletedCount} anuncio${
      deletedCount !== 1 ? 's' : ''
    }.`
  );

  const result = await Anuncio.insertMany(advertsJSON);
  console.log(
    `Insertado${result.length !== 1 ? 's' : ''} ${result.length} anuncio${
      result.length !== 1 ? 's' : ''
    }.`
  );
}

async function initUsers() {
  const { deletedCount } = await Usuario.deleteMany();
  console.log(
    `Eliminado${deletedCount !== 1 ? 's' : ''} ${deletedCount} usuario${
      deletedCount !== 1 ? 's' : ''
    }.`
  );

  const result = await Usuario.insertMany([
    {
      email: process.env.USER_EMAIL,
      password: await Usuario.hashPassword(process.env.USER_PASSWORD),
    },
  ]);
  console.log(
    `Insertado${result.length !== 1 ? 's' : ''} ${result.length} usuario${
      result.length !== 1 ? 's' : ''
    }.`
  );
}
