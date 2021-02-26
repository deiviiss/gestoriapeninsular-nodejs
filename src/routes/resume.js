//muestra la relación de trámites

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

const helpers = require('../lib/handlebars')

router.get('/resume', isLoggedIn, async (req, res) => {
  const user = req.user

  // customers = await pool.query("SELECT status, COUNT(*) as total FROM tramites WHERE zona like '%" + [req.user.consulta] + "%'GROUP BY status")

  //condición para determinar el usuario
  if (user.consulta === "") {

    aclaraciones = await pool.query("SELECT * FROM tramites WHERE status= 'aclaración'")

    asegurados = await pool.query("SELECT * FROM tramites WHERE status= 'asegurado'")

    bajas = await pool.query("SELECT * FROM tramites WHERE status= 'baja'")

    espera = await pool.query("SELECT * FROM tramites WHERE status= 'en espera'")

    fallidos = await pool.query("SELECT * FROM tramites WHERE status= 'fallido'")

    finalizados = await pool.query("SELECT * FROM tramites WHERE status= 'finalizado'")

    juridico = await pool.query("SELECT * FROM tramites WHERE status= 'jurídico'")

    pendientes = await pool.query("SELECT * FROM tramites WHERE status= 'pendiente'")

  } else {
    aclaraciones = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status= 'aclaración'", [req.user.consulta])

    asegurados = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status= 'asegurado'", [req.user.consulta])

    bajas = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status= 'baja'", [req.user.consulta])

    espera = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status= 'en espera'", [req.user.consulta])

    fallidos = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status= 'fallido'", [req.user.consulta])

    finalizados = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status= 'finalizado'", [req.user.consulta])

    juridico = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status= 'jurídico'", [req.user.consulta])

    pendientes = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status= 'pendiente'", [req.user.consulta])
  }

  //objeto con status que se mandara a la vista
  status = {
    aclaraciones: aclaraciones.length,
    asegurados: asegurados.length,
    bajas: bajas.length,
    espera: espera.length,
    fallidos: fallidos.length,
    finalizados: finalizados.length,
    juridico: juridico.length,
    pendientes: pendientes.length
  }

  //objeto con titulos de status
  titulos = {
    aclaracion: 'aclaracion',
    asegurado: 'asegurado',
    baja: 'baja',
    espera: 'en espera',
    fallido: 'fallido',
    finalizado: 'finalizado',
    juridico: 'jurídico',
    pendiente: 'pendiente'
  }

  res.render('customer/resume.hbs', { status, user, titulos })
})

router.get('/resume/:status', isLoggedIn, async (req, res) => {
  const { status } = req.params
  const user = req.user

  console.log('Recibido el ' + status);

  if (user.consulta === "") {
    customer = await pool.query("SELECT * FROM tramites WHERE status = ?", [status])
  } else {
    customer = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status = ?", [user.consulta, status])
  }

  //helper que cambia el formato de fecha y moneda
  customers = helpers.formatterCustomers(customer)

  res.render('customer/list.hbs', { customer })

})

module.exports = router;