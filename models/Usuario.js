'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});

usuarioSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hash(plainPassword, 7);
};

usuarioSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
