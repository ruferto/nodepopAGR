'use strict';

class PrivadoController {

  /**
   * GET /privado
   */
   index(req, res, next) {

    if (!req.session.usuarioLogado) {
      res.redirect('/login');
      return;
    }

    res.render('privado');
  }

}

module.exports = new PrivadoController();
