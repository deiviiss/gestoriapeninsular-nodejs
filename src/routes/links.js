//guardar listar actualizar eliminar clientes

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

const helpers = require('../lib/handlebars')

//routes

// Envía el formulario captura cliente
router.get('/add', isLoggedIn, (req, res) => {
  res.render('links/add.hbs')
})

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
//   res.redirect('/links'); //direciona a los links
// })

//lista de clientes
router.get('/', isLoggedIn, async (req, res) => {
  // const links = await pool.query('SELECT * FROM tramites');
  // console.log(links)
  res.render('links/list.hbs') //muestra el objeto en la vista
})

//consulta
router.post('/query', isLoggedIn, async (req, res) => {

  const { busqueda } = req.body

  links = await pool.query("SELECT * FROM tramites WHERE cliente like '%" + [busqueda] + "%'")

  console.log("Consulta " + [busqueda])

  if (links.length > 0) {

    for (var i = 0; i < links.length; i++) {

      let montoPeso = (links[i].monto)
      let fechaFormat = (links[i].fecha_tramite)
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
      month[11] = "Deciembre";

      date = new Date(fechaFormat) //new Date() Objeto de Js para manejo de fechas

      links[i].monto = helpers.formatterPeso.format(montoPeso)
      links[i].fecha_tramite = date.getDate() + '/' + month[date.getMonth()] + '/' + date.getFullYear()

      // console.log(links[i].fecha_tramite)
    }


  }

  res.render('links/list.hbs', { links })
})

//borrar clientes
router.get('/delete/:idtramites', isLoggedIn, async (req, res) => {
  const { idtramites } = req.params
  console.log(idtramites)
  await pool.query('DELETE FROM tramites WHERE idtramites= ?', [idtramites])
  req.flash('fail', 'Cliente borrado correctamente')
  res.redirect('/links')
})

//editar clientes
router.get('/edit/:idtramites', isLoggedIn, async (req, res) => {
  const { idtramites } = req.params
  const links = await pool.query('SELECT * FROM tramites WHERE idtramites = ?', [idtramites])
  res.render('links/edit', { link: links[0] }) //cero indica que solo tome un objeto del arreglo
})

// router.post('/edit/:idtramites', isLoggedIn, async (req, res) => {
//   const { idtramites } = req.params
//   const { cliente, curp, nss, sdescontadas, scotizadas, direccion, telefono } = req.body; //objeto del formulario
//   const updateCliente = {
//     cliente,
//     curp,
//     nss,
//     sdescontadas,
//     scotizadas,
//     direccion,
//     telefono
//   };
//   await pool.query('UPDATE tramites set ? WHERE idtramites = ?', [updateCliente, idtramites])
//   req.flash('message', 'Cliente editado correctamente')
//   res.redirect('/links');
// })

module.exports = router;