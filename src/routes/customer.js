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
  // const customer = await pool.query('SELECT * FROM tramites');
  // console.log(customer)
  res.render('customer/list.hbs') //muestra el objeto en la vista
})

//consulta
router.post('/query', isLoggedIn, async (req, res) => {
  const user = req.user
  const { busqueda } = req.body

  // condición para elegir el método de busqueda
  if (user.consulta === "") {

    customer = await pool.query("SELECT * FROM tramites WHERE zona like '%" + [user.consulta] + "%' AND  cliente like '%" + [busqueda] + "%'") // la consulta está en blanco por lo que muestra todas las zonas.

  } else {

    customer = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  cliente like '%" + [busqueda] + "%'", [req.user.consulta]) // la consulta req usa propiedad de express para traer la consulta del ususario y ligarla a la consultas que estamos realizando, el usuario solo ve los de su zona
  }

  //helper que cambia el formato de fecha y moneda
  customers = helpers.formatterCustomers(customer)

  res.render('customer/list.hbs', { customer })
})

//============= agregar observaciones clientes (ENCARGADO)

//envia formulario para editar
router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const customer = await pool.query('SELECT * FROM tramites WHERE id =?', [id])

  // console.log(user.id)
  // console.log(customer[0])

  //helper que cambia el formato de fecha y moneda
  helpers.formatterCustomers(customer)

  res.render('customer/edit', { customer: customer[0] }) //cero indica que solo tome un objeto del arreglo
})

//recibe el formulario para editar observaciones
router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { observaciones } = req.body; //objeto del formulario
  const user = req.user
  const fechaActual = new Date() //new Date() Objeto de Js para manejo de fechas

  // console.log(id, observaciones)

  const updateCliente = {
    observaciones: observaciones + ' (' + user.fullname + ' ' + helpers.fecha(fechaActual) + ').'
  };

  await pool.query('UPDATE tramites set ? WHERE id = ?', [updateCliente, id])
  const customer = await pool.query('SELECT * FROM tramites WHERE id =?', [id])

  helpers.formatterCustomers(customer)

  // req.flash('success', 'Cliente editado correctamente')
  res.render('customer/m-pendientes', { customer: customer[0] });
  // res.redirect('/customer/edit')
})

//recibe el formulario para motivo de pendiente
router.post('/m-pendientes/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { motivo } = req.body; //objeto del formulario
  const user = req.user

  // console.log(motivo);

  const customer = await pool.query('SELECT * FROM tramites WHERE id =?', [id])

  updateCliente = {
    pendiente: motivo
  };

  await pool.query('UPDATE tramites set ? WHERE id = ?', [updateCliente, id])

  helpers.formatterCustomers(customer)

  // req.flash('success', 'Cliente finalizado correctamente')
  // res.redirect('/customer')
  res.render('customer/edit', { customer: customer[0], user: user });
})

//================= Movimiento de status clientes (REGIONAL)

// envía el formulario status
router.get('/status/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params

  const customer = await pool.query('SELECT * FROM tramites WHERE id =?', [id])

  res.render('customer/status.hbs', { customer: customer[0] })
})

//recibe el formulario status
router.post('/status/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { status, observaciones } = req.body; //objeto del formulario
  const user = req.user
  const fechaActual = new Date()

  // console.log(req.body);

  const updateCliente = {
    status,
    pendiente: '',
    observaciones: observaciones + " (" + user.fullname + ' ' + helpers.fecha(fechaActual) + ")."
  };

  //actualizo el status de customer
  await pool.query('UPDATE tramites set ? WHERE id = ?', [updateCliente, id])

  // consulto el status que se acaba de actualizar
  const customer = await pool.query('SELECT * FROM tramites WHERE id =?', [id])

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

//recibe el formulario para modificar la fecha de liquidación
// router.post('/finalize/:id', isLoggedIn, async (req, res) => {
//   const { id } = req.params
//   const { observaciones } = req.body; //objeto del formulario
//   const user = req.user

//   updateCliente = {
//     observaciones: 'Liquidado ' + observaciones + " (" + user.fullname + ")."
//   };

//   await pool.query('UPDATE tramites set ? WHERE id = ?', [updateCliente, id])

//   req.flash('success', 'Cliente editado correctamente')

//   res.redirect('/customer')
// })

// Add customer
// Envía el formulario captura cliente
// router.get('/add', isLoggedIn, (req, res) => {
//   res.render('customer/add.hbs')
// })

// Recibe el formulario captura cliente
// router.post('/add', isLoggedIn, async (req, res) => { //función asincrona
//   const { asesor, cliente, curp, afore, nss, monto, sueldo_base, fecha_baja, fecha_tramite, direccion, telefono, observaciones, status, outsourcing, zona, pendiente, scotizadas, sdescontadas, fecha_ultimo_retiro, honorarios, seguro } = req.body; //objeto del formulario
//   const newCliente = {
//     asesor,
//     cliente,
//     curp,
//     afore,
//     nss,
//     monto,
//     sueldo_base,
//     fecha_baja,
//     fecha_tramite,
//     direccion,
//     telefono,
//     observaciones,
//     status,
//     outsourcing,
//     zona,
//     pendiente,
//     scotizadas,
//     sdescontadas,
//     fecha_ultimo_retiro,
//     honorarios,
//     seguro
//   };
//   await pool.query('INSERT INTO tramites set ?', [newCliente]) //insertamos los datos en la base, la petición es asincrona
//   req.flash('success', 'Cliente guardado correctamente')//parámetros: el nombre de como se guarda el mensaje y el valor del mensaje
//   res.redirect('/customer'); //direciona a los links
// })


//borrar clientes
// router.get('/delete/:idtramites', isLoggedIn, async (req, res) => {
//   const { idtramites } = req.params
//   console.log(idtramites)
//   await pool.query('DELETE FROM tramites WHERE idtramites= ?', [idtramites])
//   req.flash('fail', 'Cliente borrado correctamente')
//   res.redirect('/customer')
// })
