var express = require('express');
var router = express.Router();

const Anuncio = require('../models/Anuncio');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const filtering = require('./functions');
    const { filtro, limit, skip, fields, sort } = filtering(req);

    const resultado = await Anuncio.lista(filtro, limit, skip, fields, sort);
    res.render('index', { title: 'Nodepop', anuncios: resultado });
  } catch (err) {
    next(err);
  }
});

// POST
// Crear un Anuncio
router.post('/', async (req, res, next) => {
  try {
    let anuncioData = req.body;
    anuncioData.tags = anuncioData.tags.split(',');

    for (let i = 0; i < anuncioData.tags.length; i++) {
      anuncioData.tags[i] = anuncioData.tags[i].trim();
    }

    const anuncio = new Anuncio(anuncioData);

    await anuncio.save();

    const resultado = await Anuncio.lista();
    res.render('index', { title: 'Nodepop', anuncios: resultado });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
