var express = require('express');
var router = express.Router();

const Anuncio = require('../models/Anuncio');


/* GET home page. */
router.get('/', async function(req, res, next) {

  try {

    const nombre = req.query.nombre;
    let precio = req.query.precio;
    const id = req.query.id;
    const venta = req.query.venta;
    const tag = req.query.tag;
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.start);
    const fields = null;
    const sort = req.query.sort;

    const filtro = {};

    if (nombre) {
      filtro.nombre = { $regex: `^${nombre}`, $options: 'i' };
    }

    if (id) {
      filtro._id = id;
    }

    if (venta) {
      if(venta==='true' || venta==='false'){
        filtro.venta = venta==='true';
      }
    }

    if (tag) {
      filtro.tags = { $all: tag } ;
    }

    const regexJusto = new RegExp('^[0-9]*$');
    const regexRango = new RegExp('^[0-9]*-[0-9]*$');
    const regexMin = new RegExp('^[0-9]*-$');
    const regexMax = new RegExp('^-[0-9]*$');
    if(precio){
      if (precio.match(regexJusto)) {
        filtro.precio = precio;
      }else if(precio.match(regexMin)){
        precio = precio.replace('-','');
        filtro.precio = { $gte: precio };
      }else if(precio.match(regexMax)){
        precio = precio.replace('-','');
        filtro.precio = { $lte: precio};
      }else if(precio.match(regexRango)) {
        const rango = precio.split('-');
        console.log(rango);
        if( parseInt(rango[0]) > parseInt(rango[1]) ) throw Error('El mínimo debe ser mayor que el máximo');
        filtro.precio = { $gte: rango[0], $lte: rango[1]};
      }
    }
    const resultado = await Anuncio.lista(filtro, limit, skip, fields, sort);
    res.render('index', {title: 'Nodepop', anuncios: resultado});
  } catch (err) {
    next(err);
  }
});


// POST
// Crear un Anuncio
router.post('/', async (req, res, next) => {
  try {
    
    let anuncioData = req.body;
    anuncioData.tags=anuncioData.tags.split(',');
    
    for(let i=0; i<anuncioData.tags.length; i++){
      anuncioData.tags[i]=anuncioData.tags[i].trim();
    }

    const anuncio = new Anuncio(anuncioData);

    await anuncio.save();

    const resultado = await Anuncio.lista();
    res.render('index', {title: 'Nodepop', anuncios: resultado});

  } catch (error) {
    next(error);
  }
});

module.exports = router;
