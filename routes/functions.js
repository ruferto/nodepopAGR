const filtering = function(req, res, next, isJsonRequest){
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
        if( parseInt(rango[0]) > parseInt(rango[1]) ){
          if(isJsonRequest){
            res.status(400).json( { error: 'El mínimo debe ser mayor que el máximo' });
          }else{
            next(Error('El mínimo debe ser mayor que el máximo'));
          }
        }
        filtro.precio = { $gte: rango[0], $lte: rango[1]};
      }else{
        if(isJsonRequest){
          res.status(400).json( { error: 'Formato de rango de precio no reconocido' });
        }else{
          next(Error('Formato de rango de precio no reconocido'));
        }
      }
    }

    return { filtro, limit, skip, fields, sort };
}

module.exports = filtering;