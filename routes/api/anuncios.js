var express = require('express');
var router = express.Router();
const cote = require('cote');

const Anuncio = require('../../models/Anuncio');
const jwtAuth = require('../../lib/jwtAuth');
//const resize = require('../../lib/resize');
const upload = require('../../lib/upload');
const requester = new cote.Requester({ name: 'cliente de moneda' });

//const upload = multer({ dest: 'public/images' });

/* GET /api/Anuncios */
// Lista de Anuncios
router.get('/', jwtAuth, async function (req, res, next) {
  try {
    const filtering = require('../functions');
    const { filtro, limit, skip, fields, sort } = filtering(req, next);

    const resultado = await Anuncio.lista(filtro, limit, skip, fields, sort);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

// GET /api/tags
// Obtener lista de tags
router.get('/tags', jwtAuth, async function (req, res, next) {
  try {
    res.json({ tags: await Anuncio.tags() });
  } catch (err) {
    next(err);
  }
});

// GET /api/tags
// Obtener lista de tags
router.get('/tags-articles', jwtAuth, async function (req, res, next) {
  try {
    res.json({ tags: await Anuncio.tagsChart() });
  } catch (err) {
    next(err);
  }
});

// GET /api/anuncios:id
// Obtener un Anuncio
// eslint-disable-next-line no-unused-vars
router.get('/:id', jwtAuth, async (req, res, next) => {
  try {
    const _id = req.params.id;

    const anuncio = await Anuncio.findOne({ _id: _id });

    if (!anuncio) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json({ result: anuncio });
  } catch (err) {
    return res.json({ error: err });
    //next(err);
  }
});

// POST /api/Anuncios (body)
// Crear un Anuncio
router.post('/', jwtAuth, upload.single('photo'), async (req, res, next) => {
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

    const anuncioCreado = await anuncio.save();

    res.status(201).json({ result: anuncioCreado });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
