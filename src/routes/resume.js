//muestra la relación de trámites

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

const helpers = require('../lib/handlebars')

router.get('/resume', isLoggedIn, async (req, res) => {
  const user = req.user

  console.log(user.consulta)

  // customers = await pool.query("SELECT status, COUNT(*) as total FROM tramites WHERE zona like '%" + [req.user.consulta] + "%'GROUP BY status")

  customers = await pool.query("SELECT status, COUNT(*) as total FROM tramites WHERE zona like '%" + [req.user.consulta] + "%'GROUP BY status")

  rows = customers

  console.log(rows)

  console.log(customers[0].status);
  console.log(customers[1].status);
  console.log(customers[2].status);
  console.log(customers[3].status);
  console.log(customers[4].status);
  console.log(customers[5].status);
  console.log(customers[6].status);

  // status = {
  //   aclaraciones: aclaraciones.length,
  //   bajas: bajas.length,
  //   espera: espera.length,
  //   fallidos: fallidos.length,
  //   finalizados: finalizados.length,
  //   pendientes: pendientes.length
  // }

  res.send('Pendientes ' + customers.status)

  // res.render('customer/list.hbs', { customer })
})

module.exports = router;