//Server Routes

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.
const helpers = require('../lib/handlebars')

//routes

// Envía el formulario de cantidad
router.get('/calcular', (req, res) => {
  res.render('calculate/calcular.hbs')
})

// Recibe la cantidad a calcular
router.post('/calcular', async (req, res) => {
  const { montoRetiro } = req.body

  // console.log(montoRetiro)

  // operaciones para calcular cotización
  let cobro
  let aseguramiento
  let cobroCliente
  let libreCliente

  if (montoRetiro > 30801) {
    cobro = montoRetiro * .30
    aseguramiento = 'Incluido'
    cobroCliente = cobro
    libreCliente = montoRetiro - cobro
  }

  else if (montoRetiro > 24999) {
    cobro = montoRetiro * .25
    aseguramiento = 2000
    cobroCliente = cobro + aseguramiento
    libreCliente = montoRetiro - cobroCliente
  }

  else if (montoRetiro > 14999) {
    cobro = montoRetiro * .25
    aseguramiento = 1700
    cobroCliente = cobro + aseguramiento
    libreCliente = montoRetiro - cobroCliente
  }

  else if (montoRetiro > 0) {
    cobro = montoRetiro * .25
    aseguramiento = 1300
    cobroCliente = cobro + aseguramiento
    libreCliente = montoRetiro - cobroCliente
  }

  // formato moneda
  montoPesos = helpers.formatterPeso.format(montoRetiro)
  cobroPesos = helpers.formatterPeso.format(cobro)
  if (aseguramiento === 'Incluido') {
    aseguramientoPesos = 'Incluido'
  }
  else {
    aseguramientoPesos = helpers.formatterPeso.format(aseguramiento)
  }
  cobroClientePesos = helpers.formatterPeso.format(cobroCliente)
  libreClientePesos = helpers.formatterPeso.format(libreCliente)

  // objeto que recibe la vista result
  retiro = {
    montoPesos,
    cobroPesos,
    aseguramientoPesos,
    cobroClientePesos,
    libreClientePesos,
  }

  // console.log(retiro)

  res.render('calculate/result.hbs', { retiro })
})

module.exports = router;