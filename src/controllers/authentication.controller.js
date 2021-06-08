//singin, login, logout  users

//dependens
const passport = require('passport');//trae la biblioteca passport
const db = require('../database');
const cifrator = require('../lib/cifrator');

const controller = {};

//*============== restore password
//envía formulario
controller.getRestorePass = async (req, res) => {
  const { id } = req.params
  const user = await db.query('SELECT * FROM users WHERE id =?', [id])

  res.render('authentic/restore-pass', { user: user[0] })
};

//recibe formulario
controller.postRestorePass = async (req, res) => {
  const { id } = req.params
  const { password } = req.body //objeto del formulario

  const updatePassword = {
    password
  };

  updatePassword.password = await cifrator.encryptaPassword(password)

  await db.query('UPDATE users SET ? WHERE id = ?', [updatePassword, id])

  req.flash('success', 'Contraseña actualizada correctamente')
  res.redirect('/profile');
};

//*============== login usuario
//envía formulario
controller.getLogin = (req, res) => {
  res.render('authentic/login.hbs')
};

//recibe formulario
controller.postLogin = (req, res, next) => {
  passport.authenticate('local.login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
};

//*============== registro de usuario
//envía formulario
controller.getRegisterUser = (req, res) => {
  const user = req.user

  //?condición para ocultar la ruta register
  if (user.permiso === "Administrador") {
    res.render('authentic/register.hbs')
  }

  else {
    res.send('404 not found')
  }
};

//recibe formulario
controller.postRegisterUser = passport.authenticate('local.register', { //metodo que toma el nombre de la autenticación creada en passport.js
  successRedirect: '/profile',//donde lo envia cuando esta ok
  failureRedirect: '/register',//donde lo envia cuando falla
  failureFlash: true
});

//*============== perfil
controller.getProfile = (req, res) => {
  res.render('profile')
};

//*============== logout
controller.getLogout = (req, res) => {
  req.logOut();
  res.redirect('/login')
};

module.exports = controller;