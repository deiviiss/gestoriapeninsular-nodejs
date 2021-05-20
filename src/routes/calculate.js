//Server Routes

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.
const helpers = require('../lib/handlebars')
const db = require('../database'); //conexión a la base de datos

//routes

//envía el formulario de cantidad
router.get('/calcular', async (req, res) => {
  const user = req.user

  if (user.permiso === 'Administrador') {
    const sqlZonas = 'SELECT zona FROM zonas'
    const zonas = await db.query(sqlZonas)

    res.render('calculate/calcular.hbs', { user, zonas })
  }
  else {
    const sqlZonas = 'SELECT zona FROM zonas WHERE region = ?'
    const zonas = await db.query(sqlZonas, user.region)

    res.render('calculate/calcular.hbs', { user, zonas })
  }
})

//recibe la cantidad a calcular
router.post('/calcular', async (req, res) => {
  const user = req.user
  const body = req.body

  helpers.calculaCosto(body, user)

  res.render('calculate/result.hbs', { retiro, user })
})

module.exports = router;