'use strict'
const mongoose = require('mongoose');
//const Anuncio = require('./models/Anuncio');

const anunciosJSON = [{
  "nombre": "Bicicleta",
  "venta": true,
  "precio": 230.15,
  "foto": "bici.jpg",
  "tags": [
    "lifestyle",
    "motor"
  ]
},{
  "nombre": "iPhone 3GS",
  "venta": false,
  "precio": 50,
  "foto": "iphone.png",
  "tags": [
    "lifestyle",
    "movil"
  ]
},{
  "nombre": "iMac",
  "venta": true,
  "precio": 1000,
  "foto": "imac.png",
  "tags": [
    "lifestyle",
    "trabajo"
  ]
},{
  "nombre": "Boxee",
  "venta": false,
  "precio": 50,
  "foto": "boxee.png",
  "tags": [
    "lifestyle",
    "tv"
  ]
},{
  "nombre": "Groo Adventurer",
  "venta": true,
  "precio": 14.5,
  "foto": "groo.jpg",
  "tags": [
    "comic",
    "coleccionismo"
  ]
},{
  "nombre": "Megadrive",
  "venta": false,
  "precio": 80,
  "foto": "megadrive.jpg",
  "tags": [
    "lifestyle",
    "gaming",
    "coleccionismo"
  ]
},{
  "nombre": "Tesla",
  "venta": true,
  "precio": 900000,
  "foto": "tesla.png",
  "tags": [
    "lifestyle",
    "motor"
  ]
},{
  "nombre": "Roomba",
  "venta": false,
  "precio": 200,
  "foto": "roomba.png",
  "tags": [
    "lifestyle",
    "trabajo"
  ]
},{
  "tags": [
    "lifestyle",
    "motor"
  ],
  "nombre": "Moto",
  "precio": 1600,
  "venta": false,
  "foto": "moto.jpg"
},{
  "tags": [
    "lifestyle",
    "motor"
  ],
  "nombre": "Opel Corsa",
  "precio": 2001.8,
  "venta": true,
  "foto": "opelcorsa.jpg"
},{
  "tags": [
    "trabajo",
    "motor"
  ],
  "nombre": "Tractor",
  "precio": 19000,
  "venta": true,
  "foto": "tractor.jpg"
},{
  "tags": [
    "lifestyle",
    "decoracion"
  ],
  "nombre": "Lámpara",
  "precio": 14.2,
  "venta": true,
  "foto": "lampara.jpg"
}];


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