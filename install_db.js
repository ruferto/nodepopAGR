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
    "mobile"
  ]
},{
  "nombre": "iMac",
  "venta": true,
  "precio": 1000,
  "foto": "imac.png",
  "tags": [
    "lifestyle",
    "work"
  ]
},{
  "nombre": "Boxee",
  "venta": false,
  "precio": 50,
  "foto": "boxee.png",
  "tags": [
    "lifestyle"
  ]
},{
  "nombre": "Xilófono",
  "venta": true,
  "precio": 14,
  "foto": "xilofono.jpg",
  "tags": [
    "lifestyle"
  ]
},{
  "nombre": "Megadrive",
  "venta": false,
  "precio": 80,
  "foto": "megadrive.png",
  "tags": [
    "lifestyle"
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
    "work"
  ]
},{
  "tags": [
    "lifestyle",
    "motor"
  ],
  "nombre": "Moto",
  "precio": 1600,
  "venta": false,
  "foto": "moto.jpg",
  "__v": 0
},{
  "tags": [
    "lifestyle",
    "motor"
  ],
  "nombre": "BMW",
  "precio": 16000,
  "venta": true,
  "foto": "bmw.jpg",
  "__v": 0
},{
  "tags": [
    "work",
    "motor"
  ],
  "nombre": "Tractor",
  "precio": 19000,
  "venta": true,
  "foto": "tractor.jpg",
  "__v": 0
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