const filtering = function(req){
    const nombre = req.query.nombre;
    let precio = req.query.precio;
    const id = req.query.id;
    const venta = req.query.venta;
    let tag = req.query.tag;
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
      if(!Array.isArray(tag) && tag.indexOf(',')!=-1){
        const aux = tag.split(',');
        tag=[];
        aux.forEach( tagAux => {
          tagAux = tagAux.trim();
          tag.push(tagAux);
        })
      }
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
        if( parseInt(rango[0]) > parseInt(rango[1]) )  next(Error('El mínimo debe ser mayor que el máximo'));
        filtro.precio = { $gte: rango[0], $lte: rango[1]};
      }
    }

    return { filtro, limit, skip, fields, sort };
}

module.exports = filtering;