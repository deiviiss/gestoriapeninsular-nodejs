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
  // const links = await pool.query('SELECT * FROM tramites');
  // console.log(links)
  res.render('customer/list.hbs') //muestra el objeto en la vista
})

//consulta
router.post('/query', isLoggedIn, async (req, res) => {

  const { busqueda } = req.body

  customers = await pool.query("SELECT * FROM tramites WHERE zona like '%" + [req.user.consulta] + "%' AND  cliente like '%" + [busqueda] + "%'") // la consulta re usa propiedad de express para traer la zona del ususario y ligarla a la consultas que estamos realizando, el usuario solo ve los de su zona

  // Condición que recibe el record
  if (customers.length > 0) {

    // ciclo for para iterar records recibidos.
    for (var i = 0; i < customers.length; i++) {

      let montoPeso = (customers[i].monto)
      let fechaFormat = (customers[i].fecha_tramite)
      let month = new Array(); //Array que contiene los meses

      month[0] = "Enero";
      month[1] = "Febrero";
      month[2] = "Marzo";
      month[3] = "Abril";
      month[4] = "Mayo";
      month[5] = "Junio";
      month[6] = "Julio";
      month[7] = "Agosto";
      month[8] = "Septiembre";
      month[9] = "Octubre";
      month[10] = "Noviembre";
      month[11] = "Diciembre";

      date = new Date(fechaFormat) //new Date() Objeto de Js para manejo de fechas

      customers[i].monto = helpers.formatterPeso.format(montoPeso)
      customers[i].fecha_tramite = date.getDate() + '/' + month[date.getMonth()] + '/' + date.getFullYear()

      // console.log(customers[i].fecha_tramite)
    }
  }

  res.render('customer/list.hbs', { customers })
})

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

//editar clientes
//envia formulario
router.get('/edit/:id', isLoggedIn, async (req, res) => {
  // console.log(req.params)

  const { id } = req.params
  const customer = await pool.query('SELECT * FROM tramites WHERE id =?', [id])
  const user = await req.user

  // console.log(user.id)
  // console.log(customer[0])

  // Condición que recibe el record
  if (customer.length > 0) {

    // ciclo for para iterar records recibidos.
    for (var i = 0; i < customer.length; i++) {

      let montoPeso = (customer[i].monto)
      let fechaFormat = (customer[i].fecha_tramite)

      let month = new Array(); //Array que contiene los meses

      month[0] = "Enero";
      month[1] = "Febrero";
      month[2] = "Marzo";
      month[3] = "Abril";
      month[4] = "Mayo";
      month[5] = "Junio";
      month[6] = "Julio";
      month[7] = "Agosto";
      month[8] = "Septiembre";
      month[9] = "Octubre";
      month[10] = "Noviembre";
      month[11] = "Diciembre";

      date = new Date(fechaFormat) //new Date() Objeto de Js para manejo de fechas

      customer[i].monto = helpers.formatterPeso.format(montoPeso)
      customer[i].fecha_tramite = date.getDate() + '/' + month[date.getMonth()] + '/' + date.getFullYear()

      // console.log(customers[i].fecha_tramite)
    }
  }

  res.render('customer/edit', { customer: customer[0], user: user }) //cero indica que solo tome un objeto del arreglo
})

//recibe el formulario
router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { observaciones } = req.body; //objeto del formulario

  // console.log(id, observaciones)

  const updateCliente = {
    observaciones
  };

  await pool.query('UPDATE tramites set ? WHERE id = ?', [updateCliente, id])

  req.flash('success', 'Cliente editado correctamente')
  res.redirect('/customer');
})

// recibe el formulario finalizar
router.get('/finalize/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const customer = await pool.query('SELECT * FROM tramites WHERE id =?', [id])

  res.render('customer/finalize', { customer: customer[0] })

  // const updateCliente = {
  //   observaciones,
  //   status: finalizado
  // };

  // await pool.query('UPDATE tramites set ? WHERE id = ?', [updateCliente, id])

  // req.flash('success', 'Cliente editado correctamente')
  // res.redirect('/customer');
})

router.post('/finalize/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params
  const { observaciones } = req.body; //objeto del formulario

  // console.log(id, observaciones)

  const updateCliente = {
    observaciones: 'Liquidado ' + observaciones,
    status: 'Finalizado'
  };

  await pool.query('UPDATE tramites set ? WHERE id = ?', [updateCliente, id])

  req.flash('success', 'Cliente finalizado correctamente')
  res.redirect('/customer');
})

module.exports = router;