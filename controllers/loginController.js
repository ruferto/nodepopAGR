'use strict';

const { Usuario } = require('../models');

class LoginController {
  
  /**
   * GET /login
   */
  // eslint-disable-next-line no-unused-vars
  index(req, res, next) {
    res.locals.email = '';
    res.locals.error = '';
    res.render('login');
  }

  /**
   * POST /login
   */
  async post(req, res, next) {
    try {
      const { email, password } = req.body;
  
      // buscar el usuario en la BD
      const usuario = await Usuario.findOne({ email });
      
      // si no lo encontramos --> error
      // si no coincide la clave --> error
      if (!usuario || !(await usuario.comparePassword(password)) ) {

        res.locals.email = email;
        res.locals.error = 'Invalid credentials';
        res.render('login');
        return;
      }
  
      // si el usuario existe y la clave coincide

      // apuntar en la sesion del usuario su _id
      req.session.usuarioLogado = {
        _id: usuario._id
      };

      // redirigir a zona privada
      res.redirect('/privado');
  
    } catch(err) {
      next(err);
    }
  }
}

module.exports = new LoginController();


// Lo de arriba es lo mismo que esto de abajo:
// module.exports = {
//   index: (req, res, next) => {
//     res.render('login');
//   },
//   post: (req, res, next) => {

//   }
// };
