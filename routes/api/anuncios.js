var express = require('express');
var router = express.Router();

const Anuncio = require('../../models/Anuncio');

/* GET /api/Anuncios */
// Lista de Anuncios
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
      filtro.venta = venta==='true';
    }

    if (tag) {
      filtro.tags = { $all: tag.split(',') } ;
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
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});


// GET /api/tags
// Obtener lista de tags
router.get('/tags', async function(req, res, next) {

  try {
    const resultado = await Anuncio.tags();
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

// GET /api/anuncios:id
// Obtener un Anuncio
router.get('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    const anuncio = await Anuncio.findOne({ _id: _id });

    if (!anuncio) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json({ result: anuncio });

  } catch (err) {
    next(err);
  }
});

// POST /api/Anuncios (body)
// Crear un Anuncio
router.post('/', async (req, res, next) => {
  try {
    const anuncioData = req.body;
    if(anuncioData.venta!="true" && anuncioData.venta!="false"){
      return res.status(400).json({ error: 'venta debe ser "true" o "false"' });
    }
    anuncioData.venta =  (anuncioData.venta==="true")  ? true : false;
    anuncioData.tags = anuncioData.tags.split(',');

    console.log(anuncioData)

    const anuncio = new Anuncio(anuncioData);

    const anuncioCreado = await anuncio.save();

    res.status(201).json({ result: anuncioCreado });

  } catch (error) {
    next(error);
  }
});


module.exports = router;
