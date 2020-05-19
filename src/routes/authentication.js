//sing in, sing up, log out

const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const passport = require('passport');//trae la biblioteca passport

//login de usuario

//formulario
router.get('/login', (req, res) => {
  res.render('authentic/login.hbs')
})

//recibe el formulario
router.post('/login', (req, res, next) => {
  passport.authenticate('local.login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

//registro de usuario

//formulario
router.get('/signup', (req, res) => {
  res.render('authentic/signup.hbs')
})

// recibe el formulario
router.post('/signup', passport.authenticate('local.signup', { //metodo que toma el nombre de la autenticación creada en passport.js
  successRedirect: '/profile',//donde lo envia cuando esta ok
  failureRedirect: '/signup'//donde lo envia cuando falla
}))

//perfil
router.get('/profile', (req, res) => {
  res.send('this is your profile')
})

module.exports = router;