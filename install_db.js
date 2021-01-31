'use strict'
const mongoose = require('mongoose');

let anunciosJSON;

const fs = require('fs');

fs.readFile('./data/anuncios.json', 'utf8', (err, data) => {
    if (err) {
        console.log(`Error al leer el archivo: ${err}`);
    } else {
        anunciosJSON = JSON.parse(data);
    }
});


mongoose.connection.on('error', err => {
    console.log('Error de conexión', err);
    process.exit(1);
});
  
mongoose.connection.once('open', () => {
    console.log('Conectado a MongoDB en', mongoose.connection.name);
    mongoose.connection.dropCollection('anuncios', function(err, result) {
      try{
        console.log("Colección borrada");
        const collection = mongoose.connection.collection('anuncios');
        collection.insertMany(anunciosJSON, function(err, result) {
          try {
            console.log(`Se han insertado ${anunciosJSON.length} documentos en la colección`);
          } catch (error) {
            console.error(err);
          }
        });
      }catch(err){
          console.error(err);
      }
    });
});
  
mongoose.connect('mongodb://localhost/anuncios', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

setTimeout(()=>{ process.exit(0); }, 800);