//guardar listar actualizar eliminar clientes

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

const helpers = require('../lib/handlebars')

//routes

//lista de clientes
router.get('/', isLoggedIn, async (req, res) => {
  const user = req.user

  // Consulta Regional
  // if (user.puesto === 'Regional') {

  //   const sqlSelect = 'SELECT * FROM tramites WHERE region = ?'

  //   customer = await pool.query(sqlSelect, user.region);
  // }

  // //Consulta Administrador
  // else if (user.puesto === "Administrador") {

  //   const sqlSelect = 'SELECT * FROM tramites'

  //   customer = await pool.query(sqlSelect);
  // }

  // //Consulta encargado
  // else {

  //   const sqlSelect = 'SELECT * FROM tramites WHERE zona= ?'

  //   customer = await pool.query(sqlSelect, user.consulta)
  // }

  // //helper que cambia el formato de fecha y moneda
  // customer = helpers.formatterCustomers(customer)

  res.render('customer/list-customer.hbs', { customer }) //muestra el objeto en la vista
})

//busqueda de cliente
router.post('/query', isLoggedIn, async (req, res) => {
  const user = req.user
  const { busqueda } = req.body

  // condición para elegir el método de busqueda
  if (user.puesto === "Regional") {

    const sqlBuscar = "SELECT * FROM tramites WHERE region = ?" + " AND  cliente like '%" + [busqueda] + "%'"

    customer = await pool.query(sqlBuscar, user.region)

  }

  else if (user.puesto === 'Administrador') {

    const sqlBuscar = "SELECT * FROM tramites WHERE zona like '%" + [user.consulta] + "%' AND  cliente like '%" + [busqueda] + "%'"; // la consulta está en blanco por lo que muestra todas las zonas.

    customer = await pool.query(sqlBuscar);
  }

  else {

    customer = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  cliente like '%" + [busqueda] + "%'", [user.consulta]) // la consulta req usa propiedad de express para traer la consulta del ususario y ligarla a la consultas que estamos realizando, el usuario solo ve los de su zona
  }

  //helper que cambia el formato de fecha y moneda
  customers = helpers.formatterCustomers(customer)

  res.render('customer/list-customer.hbs', { customer })
})

//============= agregar observaciones clientes (ENCARGADO)

//envia formulario para editar
router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const customer = await pool.query('SELECT * FROM tramites WHERE id =?', [id])

  //helper que cambia el formato de fecha y moneda
  helpers.formatterCustomers(customer)

  res.render('customer/edit', { customer: customer[0] }) //cero indica que solo tome un objeto del arreglo
})

//recibe el formulario para actualizar observaciones
router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { observaciones } = req.body; //objeto del formulario
  const user = req.user
  const fechaActual = new Date() //new Date() Objeto de Js para manejo de fechas

  //objeto con las observaciones y usuario fecha
  const updateCliente = {
    observaciones: observaciones + ' (' + user.fullname + ' ' + helpers.fecha(fechaActual) + ').'
  };

  //actualizo observaciones
  await pool.query('UPDATE tramites set ? WHERE id = ?', [updateCliente, id])
  const customer = await pool.query('SELECT * FROM tramites WHERE id =?', [id])

  //helper que cambia el formato de fecha y moneda
  helpers.formatterCustomers(customer)

  res.render('customer/m-pendientes', { customer: customer[0] });
})

//recibe el formulario para actualizar motivo de pendiente
router.post('/m-pendientes/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { motivo } = req.body; //objeto del formulario
  const user = req.user

  const customer = await pool.query('SELECT * FROM tramites WHERE id =?', [id])

  //objeto con la actualización del motivo
  updateCliente = {
    pendiente: motivo
  };

  //actualizo motivo pendiente
  await pool.query('UPDATE tramites set ? WHERE id = ?', [updateCliente, id])

  //helper que cambia el formato de fecha y moneda
  helpers.formatterCustomers(customer)

  res.render('customer/edit', { customer: customer[0], user: user });
})

//================= Movimiento de status clientes (REGIONAL)

// envía el formulario status
router.get('/status/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { permiso } = req.user;

  const customer = await pool.query('SELECT * FROM tramites WHERE id =?', [id])

  //obtener la propiedad status de la consulta
  const { status } = customer[0];

  //* Condición para proteger cambio de status
  if (status === 'Finalizado') {
    res.redirect('/resume')
  }
  else if (permiso === 'Administrador') {
    res.render('customer/status.hbs', { customer: customer[0] })
  }
  else {
    res.redirect('/resume')
  }
})

//recibe el formulario status
router.post('/status/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { status, observaciones } = req.body; //objeto del formulario
  const user = req.user
  const fechaActual = new Date()

  //objeto con el status y observaciones con fecha y usuario
  const updateCliente = {
    status,
    pendiente: '',
    observaciones: observaciones + " (" + user.fullname + ' ' + helpers.fecha(fechaActual) + ")."
  };

  //actualizo el status de customer
  await pool.query('UPDATE tramites set ? WHERE id = ?', [updateCliente, id])

  // consulto el status que se acaba de actualizar
  const customer = await pool.query('SELECT * FROM tramites WHERE id =?', [id])

  //valida status que se acaba de actualizar
  if (customer[0].status === 'Pendiente') {

    //para colocar el motivo
    res.render('customer/m-pendientes', { customer: customer[0] });
  }
  else {
    req.flash('success', 'Cliente editado correctamente')
    res.redirect('/resume')
  }
})

module.exports = router;