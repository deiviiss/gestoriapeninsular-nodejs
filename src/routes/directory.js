//lista y consulta el directorio

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// const helpers = require('../lib/handlebars')

//routes

//lista el directorio
router.get('/directorio', isLoggedIn, async (req, res) => {
  const directorio = await pool.query('SELECT * FROM users');

  res.render('directory/list.hbs', { directorio }) //muestra el objeto en la vista
})

// consulta
router.post('/directorio', isLoggedIn, async (req, res) => {
  const { busqueda } = req.body

  // console.log({ busqueda })

  directorio = directorio = await pool.query("SELECT * FROM users WHERE fullname like '%" + [busqueda] + "%' OR zona like '%" + [busqueda] + "%'") // consulta a la base
  // console.log(directorio)

  res.render('directory/list.hbs', { directorio })
})

module.exports = router;