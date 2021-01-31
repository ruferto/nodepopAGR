var express = require('express');
var router = express.Router();

const Anuncio = require('../models/Anuncio');


/* GET home page. */
router.get('/', async function(req, res, next) {

  try {

    const nombre = req.query.nombre;
    const precio = req.query.precio;
    const id = req.query.id;
    const venta = req.query.venta;
    const tag = req.query.tag;
    const min = parseInt(req.query.min);
    const max = parseInt(req.query.max);
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);
    const fields = req.query.fields;
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
    if (precio) {
      filtro.precio = precio;
    }else if(min&&max) {
      if( min > max ) throw Error('El mínimo debe ser mayor que el máximo')
      filtro.precio = { $gte: min, $lte: max};
    }else if(min){
      filtro.precio = { $gte: min };
    }else if(max){
      filtro.precio = { $lte: max};
    }

    const resultado = await Anuncio.lista(filtro, limit, skip, fields, sort, min, max);
    res.render('index', {title: 'Nodepop', anuncios: resultado});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
