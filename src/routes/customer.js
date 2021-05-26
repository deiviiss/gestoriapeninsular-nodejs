//Buscar, listar, cambiar status 

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.
const db = require('../database'); //conexión a la base de datos
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/handlebars')

//routes

//lista de clientes
router.get('/', isLoggedIn, async (req, res) => {

  res.render('customer/list-customer.hbs')
});

//busqueda de cliente
router.post('/query', isLoggedIn, async (req, res) => {
  const user = req.user
  const { busqueda } = req.body

  // condición para elegir el método de busqueda
  if (user.permiso === "Regional") {
    const sqlBuscar = "SELECT * FROM tramites WHERE region = ? AND  cliente like '%" + [busqueda] + "%'"

    customer = await db.query(sqlBuscar, user.region)
  }

  else if (user.permiso === 'Administrador') {
    const sqlBuscar = "SELECT * FROM tramites WHERE cliente like '%" + [busqueda] + "%'";

    customer = await db.query(sqlBuscar);
  }

  else {
    const sqlBuscar = "SELECT * FROM tramites WHERE zona = ?  AND  cliente like '%" + [busqueda] + "%'"

    customer = await db.query(sqlBuscar, [user.zona])
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

  customer = await db.query(sqlSelect, [id])

  const sqlMotivos = 'SELECT motivo FROM motivos GROUP BY motivo ORDER BY motivo;'

  const motivos = await db.query(sqlMotivos)

  //helper que cambia el formato de fecha y moneda
  helpers.formatterCustomers(customer)

  res.render('customer/edit', { customer: customer[0], motivos }) //cero indica que solo tome un objeto del arreglo
})

//recibe el formulario para actualizar observaciones
router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { observaciones, fecha_solucion, motivo } = req.body; //objeto del formulario
  const user = req.user
  const fechaActual = new Date() //new Date() Objeto de Js para manejo de fechas

  //objeto con las observaciones y usuario fecha
  const updateCliente = {
    motivo: motivo,
    observaciones: observaciones + '(' + user.fullname + ')',
    fecha_status: fechaActual,
    fecha_solucion: fecha_solucion
  };

  //actualizo observaciones
  const sqlUpdate = 'UPDATE tramites set ? WHERE id = ?';
  await db.query(sqlUpdate, [updateCliente, id])

  //consulto cliente
  const sqlSelect = 'SELECT * FROM tramites WHERE id =?'
  customer = await db.query(sqlSelect, [id])

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
  customer = await db.query(sqlSelect, [id])

  //obtener la propiedad status y fecha de tramite de la consulta
  const { status } = customer[0];

  //* Condición para proteger cambio de status
  if (status !== 'Pendiente') {
    req.flash('fail', 'Cliente ya con status')
    res.redirect('/resume')
  }
  else if (permiso === 'Administrador' || permiso === 'Regional' || permiso === 'Temporal') {
    const sqlStatus = 'SELECT status FROM status;'
    const status = await db.query(sqlStatus)

    res.render('customer/status.hbs', { customer: customer[0], status })
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
  //! se crea el folio, pensando en como mostrarlo en las liquidaciones.
  const folio = 'F-' + (fechaActual.getMonth() + 1) + helpers.numAleatorio(id, 1)

  if (status === 'Pendiente') {
    //coloca el motivo
    motivo = "Trámite"
  }
  else {
    motivo = null
  }

  //objeto con el status y observaciones con fecha y usuario
  const updateCliente = {
    status,
    motivo,
    observaciones: observaciones + " (" + user.fullname + ").",
    fecha_status: fechaActual
  };

  //actualizo el status de customer
  const sqlUpdate = 'UPDATE tramites set ? WHERE id = ?'
  await db.query(sqlUpdate, [updateCliente, id])

  // consulto el status que se acaba de actualizar
  const sqlSelect = 'SELECT * FROM tramites WHERE id =?'
  customer = await db.query(sqlSelect, [id])

  req.flash('success', 'Cliente editado correctamente')
  res.redirect('/resume')
})

module.exports = router;