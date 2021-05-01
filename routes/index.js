var express = require('express');
var router = express.Router();
const upload = require('../lib/upload');
const cote = require('cote');

const Anuncio = require('../models/Anuncio');
const requester = new cote.Requester({ name: 'thumbnail client' });

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
router.post('/', upload.single('photo'), async (req, res, next) => {
  try {
    const anuncioData = req.body;
    if (anuncioData.sale != 'true' && anuncioData.sale != 'false') {
      console.log(req.body);
      return res.status(400).json({ error: 'sale must be "true" or "false"' });
    }
    anuncioData.sale = anuncioData.sale === 'true' ? true : false;

    anuncioData.photo = 'images/' + req.file.filename;

    //await resize('public/images/', req.file.filename);
    requester.send({
      type: 'create thumbnail',
      path: 'public/images/',
      filename: req.file.filename,
    });

    const anuncio = new Anuncio(anuncioData);

    await anuncio.save();

    const resultado = await Anuncio.lista();
    res.render('index', { title: 'Nodepop', anuncios: resultado });
  } catch (error) {
    next(error);
  }
});

// router.post('/', async (req, res, next) => {
//   try {
//     let anuncioData = req.body;
//     anuncioData.tags = anuncioData.tags.split(',');

//     for (let i = 0; i < anuncioData.tags.length; i++) {
//       anuncioData.tags[i] = anuncioData.tags[i].trim();
//     }

//     const anuncio = new Anuncio(anuncioData);

//     await anuncio.save();

//     const resultado = await Anuncio.lista();
//     res.render('index', { title: 'Nodepop', anuncios: resultado });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
