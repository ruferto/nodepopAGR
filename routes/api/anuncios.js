var express = require('express');
var router = express.Router();

const Anuncio = require('../../models/Anuncio');

/* GET /api/Anuncios */
// Lista de Anuncios
router.get('/', async function(req, res, next) {

  try {

    const nombre = req.query.nombre;
    let precio = req.query.precio;
    const id = req.query.id;
    const venta = req.query.venta;
    const tag = req.query.tag;
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.start);
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
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});


// GET /api/tags
// Obtener lista de tags
router.get('/tags', async function(req, res, next) {

  try {
    res.json( { tags: await Anuncio.tags() } );
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
    if(anuncioData.venta!='true' && anuncioData.venta!='false'){
      return res.status(400).json({ error: 'venta debe ser "true" o "false"' });
    }
    anuncioData.venta =  (anuncioData.venta==='true')  ? true : false;
    
    const anuncio = new Anuncio(anuncioData);

    const anuncioCreado = await anuncio.save();

    res.status(201).json({ result: anuncioCreado });

  } catch (error) {
    next(error);
  }
});


module.exports = router;
