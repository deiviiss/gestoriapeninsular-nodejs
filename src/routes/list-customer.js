//dependends
const express = require('express');
const router = express.Router(); //objeto para listar rutas

const db = require('../database'); // base de datos
const { isLoggedIn } = require('../lib/auth'); // validad autentificación
const helpers = require('../lib/handlebars'); //funciones de apoyo

//routes
router.get('/list-customer', isLoggedIn, async (req, res) => {

  const user = req.user

  if (user.region === 1 || user.region === 2 || user.region === 3 || user.region === 4) {

    const sqlSelect = 'SELECT * FROM tramites WHERE region= ?';

    customer = await db.query(sqlSelect, [user.region])

  }

  else if (user.consulta === "") {

    const sqlSelect = 'SELECT * FROM tramites'

    customer = await db.query(sqlSelect)

  }

  else {

    const sqlSelect = 'SELECT * FROM tramites WHERE zona = ?'

    customer = await db.query(sqlSelect, [user.consulta])

  }

  customer = helpers.formatterCustomers(customer);

  res.render('customer/list-customer.hbs', { customer, user })

});

module.exports = router;