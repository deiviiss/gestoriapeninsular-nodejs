//Buscar, listar, cambiar status 

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

const helpers = require('../lib/handlebars')

//routes

//lista de clientes
router.get('/', isLoggedIn, async (req, res) => {

  res.render('customer/list-customer.hbs') //muestra el objeto en la vista
})

//busqueda de cliente
router.post('/query', isLoggedIn, async (req, res) => {
  const user = req.user
  const { busqueda } = req.body

  // condición para elegir el método de busqueda
  if (user.permiso === "Regional") {
    const sqlBuscar = "SELECT * FROM tramites WHERE region = ? AND  cliente like '%" + [busqueda] + "%'"

    customer = await pool.query(sqlBuscar, user.region)
  }

  else if (user.permiso === 'Administrador') {
    const sqlBuscar = "SELECT * FROM tramites WHERE cliente like '%" + [busqueda] + "%'";

    customer = await pool.query(sqlBuscar);
  }

  else {
    const sqlSelect = "SELECT * FROM tramites WHERE zona = ?  AND  cliente like '%" + [busqueda] + "%'"

    customer = await pool.query(sqlSelect, [user.zona])
  }

  //helper que cambia el formato de fecha y moneda
  customers = helpers.formatterCustomers(customer)

  res.render('customer/list-customer.hbs', { customer })
})

//============= agregar observaciones clientes (ENCARGADO)

//envia formulario para editar
router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const sqlSelect = 'SELECT * FROM tramites WHERE id =?';

  customer = await pool.query(sqlSelect, [id])

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
    observaciones: observaciones + ' (' + user.fullname + ' ' + helpers.fecha(fechaActual) + ').',
    fecha_status: fechaActual
  };

  //actualizo observaciones
  const sqlUpdate = 'UPDATE tramites set ? WHERE id = ?';
  await pool.query(sqlUpdate, [updateCliente, id])

  //consulto cliente
  const sqlSelect = 'SELECT * FROM tramites WHERE id =?'
  customer = await pool.query(sqlSelect, [id])

  //helper que cambia el formato de fecha y moneda
  helpers.formatterCustomers(customer)

  res.render('customer/m-pendientes', { customer: customer[0] });
})

//recibe el formulario para actualizar motivo de pendiente
router.post('/m-pendientes/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { motivo } = req.body; //objeto del formulario
  const user = req.user

  //objeto con la actualización del motivo
  updateCliente = {
    pendiente: motivo
  };

  //actualizo motivo pendiente
  const sqlUpdate = 'UPDATE tramites set ? WHERE id = ?'
  await pool.query(sqlUpdate, [updateCliente, id])

  //consulto el cliente
  const sqlSelect = 'SELECT * FROM tramites WHERE id =?';
  customer = await pool.query(sqlSelect, [id])

  //helper que cambia el formato de fecha y moneda
  helpers.formatterCustomers(customer)

  res.render('customer/edit', { customer: customer[0], user: user });
})

//================= movimiento de status clientes (REGIONAL)

//envía el formulario status
router.get('/status/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { permiso } = req.user;

  //consulto al cliente
  const sqlSelect = 'SELECT * FROM tramites WHERE id =?'
  customer = await pool.query(sqlSelect, [id])

  //obtener la propiedad status de la consulta
  const { status } = customer[0];

  //* Condición para proteger cambio de status
  if (status === 'Finalizado') {
    req.flash('fail', 'Cliente ya finalizado')
    res.redirect('/resume')
  }
  else if (permiso === 'Administrador' || permiso === 'Regional' || permiso === 'Temporal') {
    res.render('customer/status.hbs', { customer: customer[0] })
  }
  else {
    req.flash('fail', 'Permiso insuficiente')
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
    observaciones: observaciones + " (" + user.fullname + ' ' + helpers.fecha(fechaActual) + ").",
    fecha_status: fechaActual
  };

  //actualizo el status de customer
  const sqlUpdate = 'UPDATE tramites set ? WHERE id = ?'
  await pool.query(sqlUpdate, [updateCliente, id])

  // consulto el status que se acaba de actualizar
  const sqlSelect = 'SELECT * FROM tramites WHERE id =?'
  customer = await pool.query(sqlSelect, [id])

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