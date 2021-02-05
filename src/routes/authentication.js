//singin, login, logout  usuarios

const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const passport = require('passport');//trae la biblioteca passport
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

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

//  envía formulario , isNotLoggedIn - si está logueado.
// router.get('/register', (req, res) => {
//   res.render('authentic/register.hbs')
// });

// recibe el formulario
router.post('/register', isNotLoggedIn, passport.authenticate('local.register', { //metodo que toma el nombre de la autenticación creada en passport.js
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