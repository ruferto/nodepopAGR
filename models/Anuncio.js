'use strict';

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const anuncioSchema = mongoose.Schema(
  {
    name: { type: String, index: true },
    price: { type: Number, index: true },
    sale: { type: Boolean, index: true },
    photo: { type: String },
    tags: [{ type: String }],
  },
  {
    collection: 'anuncios',
  }
);

// eslint-disable-next-line no-unused-vars
anuncioSchema.statics.lista = function (
  filtro,
  limit,
  skip,
  fields,
  sort
  // min,
  // max
) {
  const query = Anuncio.find(filtro).collation({ locale: 'en', strength: 2 });
  query.limit(limit);
  query.skip(skip);
  query.select(fields);
  query.sort(sort);
  return query.exec();
};

anuncioSchema.statics.tags = function () {
  const query = Anuncio.distinct('tags');
  return query.exec();
};

anuncioSchema.statics.tagsChart = function () {
  const query = Anuncio.aggregate([
    {
      $project: {
        tags: 1,
        numOfArticles: 1,
      },
    },
    { $unwind: '$tags' },
    {
      $group: {
        _id: '$tags',
        numOfArticles: { $sum: 1 },
      },
    },
    { $sort: { numOfArticles: -1 } },
  ]);

  return query.exec();
};

// creamos el modelo con el esquema definido
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

// exportamos el modelo (opcional)
module.exports = Anuncio;
