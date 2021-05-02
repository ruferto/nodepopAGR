const filtering = function (req, next) {
  const name = req.query.name;
  let price = req.query.price;
  const id = req.query.id;
  const sale = req.query.sale;
  const tag = req.query.tag;
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.start);
  const fields = req.query.fields;
  const sort = req.query.sort;

  const filtro = {};

  if (name) {
    filtro.name = { $regex: `^${name}`, $options: 'i' };
  }

  if (id) {
    filtro._id = id;
  }

  if (sale) {
    if (sale === 'true' || sale === 'false') {
      filtro.sale = sale === 'true';
    } else {
      return next(Error('Sale field: must be "true" or "false"'));
    }
  }

  if (tag) {
    filtro.tags = { $all: tag };
  }
  const regexJusto = new RegExp('^[0-9]*$');
  const regexRango = new RegExp('^[0-9]*-[0-9]*$');
  const regexMin = new RegExp('^[0-9]*-$');
  const regexMax = new RegExp('^-[0-9]*$');

  if (price) {
    if (price.match(regexJusto)) {
      filtro.price = price;
    } else if (price.match(regexMin)) {
      price = price.replace('-', '');
      filtro.price = { $gte: price };
    } else if (price.match(regexMax)) {
      price = price.replace('-', '');
      filtro.price = { $lte: price };
    } else if (price.match(regexRango)) {
      const rango = price.split('-');
      if (parseInt(rango[0]) > parseInt(rango[1]))
        return next(Error('Price field: Maximum must be larger than minimum'));
      filtro.price = { $gte: rango[0], $lte: rango[1] };
    }
    console.log(filtro.price);
  }

  return { filtro, limit, skip, fields, sort };
};

module.exports = filtering;
