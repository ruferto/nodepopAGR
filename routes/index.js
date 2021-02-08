var express = require('express');
var router = express.Router();

const Anuncio = require('../models/Anuncio');


/* GET home page. */
router.get('/', async function(req, res, next) {

  try {

    res.locals.precio=req.query.precio;
    if(!Array.isArray(req.query.tag))
    {
      res.locals.tag = req.query.tag;
    }else{
      let tags = '';
      req.query.tag.forEach( tag => {
        tags+=tag+', ';
      })
      tags=tags.substring(0, tags.length-2);
      res.locals.tag = tags;
    }
    const filtering = require('./functions');
    const {filtro, limit, skip, fields, sort} = filtering(req);
    const resultado = await Anuncio.lista(filtro, limit, skip, fields, sort);
    res.render('index', {title: 'Nodepop', anuncios: resultado, filtro, limit, skip, sort});
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
