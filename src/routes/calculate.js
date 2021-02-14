//Server Routes

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.
const helpers = require('../lib/handlebars')

//routes

// Envía el formulario de cantidad
router.get('/calcular', (req, res) => {
  const user = req.user

  res.render('calculate/calcular.hbs', { user: user })
})

// Recibe la cantidad a calcular
router.post('/calcular/:permiso', async (req, res) => {
  const body = req.body
  const { permiso } = req.params
  const user = req.user


  helpers.calculaCosto(permiso, body, user)

  // console.log(retiro)

  res.render('calculate/result.hbs', { retiro })
})

module.exports = router;