//Server Routes

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.
const helpers = require('../lib/handlebars')

//routes

//envía el formulario de cantidad
router.get('/calcular', (req, res) => {
  const user = req.user

  region = helpers.region(user.region)

  res.render('calculate/calcular.hbs', { user, region })
})

//recibe la cantidad a calcular
router.post('/calcular', async (req, res) => {
  const user = req.user
  const body = req.body

  helpers.calculaCosto(body, user)

  res.render('calculate/result.hbs', { retiro, user })
})

module.exports = router;