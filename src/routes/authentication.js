//singin, login, logout  usuarios

const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const passport = require('passport');//trae la biblioteca passport
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const cifrator = require('../lib/cifrator');

//restore password

router.get('/restore-pass/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const user = await pool.query('SELECT * FROM users WHERE id =?', [id])

  // console.log(user[0])

  res.render('authentic/restore-pass', { user: user[0] })
})

router.post('/restore-pass/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { password } = req.body //objeto del formulario

  // console.log(password)

  const updatePassword = {
    password
  };

  updatePassword.password = await cifrator.encryptaPassword(password)

  await pool.query('UPDATE users SET ? WHERE id = ?', [updatePassword, id])

  req.flash('success', 'Contraseña actualizada correctamente')
  res.redirect('/profile');
})

//login de usuario

// envía formulario
router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('authentic/login.hbs')
});

//recibe el formulario
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local.login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

//registro de usuario

//  envía formulario 
router.get('/register', isLoggedIn, (req, res) => {
  const user = req.user

  //?condición para ocultar la ruta register
  if (user.permiso === "Administrador") {
    res.render('authentic/register.hbs')
  }

  else {
    res.send('404 not found')
  }

});

// recibe el formulario
router.post('/register', isLoggedIn, passport.authenticate('local.register', { //metodo que toma el nombre de la autenticación creada en passport.js
  successRedirect: '/profile',//donde lo envia cuando esta ok
  failureRedirect: '/register',//donde lo envia cuando falla
  failureFlash: true
}));

//perfil
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile')
});

//logout
router.get('/logout', isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect('/login')
});

module.exports = router;