//muestra la relación de trámites

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

const helpers = require('../lib/handlebars')

//=============== desgloce resume

router.get('/resume', isLoggedIn, async (req, res) => {
  const user = req.user
  const { zona } = req.body

  //todo mejorar está consulta customers = await pool.query("SELECT status, COUNT(*) as total FROM tramites WHERE zona like '%" + [req.user.consulta] + "%'GROUP BY status")

  //consulta que recupera cantidades totales
  //consulta por region
  if (user.region === 1 || user.region === 2 || user.region === 3 || user.region === 4) {

    aclaraciones = await pool.query("SELECT * FROM tramites WHERE status= 'aclaración'" + "AND zona= ?", [zona])
    //todo => Agregar a la consulta la zona que se obtiene

    asegurados = await pool.query("SELECT * FROM tramites WHERE status= 'asegurado'" + "AND region= ?", [zona])

    bajas = await pool.query("SELECT * FROM tramites WHERE status= 'baja'" + "AND region= ?", [zona])

    espera = await pool.query("SELECT * FROM tramites WHERE status= 'en espera'" + "AND region= ?", [zona])

    fallidos = await pool.query("SELECT * FROM tramites WHERE status= 'fallido'" + "AND region= ?", [zona])

    finalizados = await pool.query("SELECT * FROM tramites WHERE status= 'finalizado'" + "AND region= ?", [zona])

    juridico = await pool.query("SELECT * FROM tramites WHERE status= 'jurídico'" + "AND region= ?", [zona])

    pendientes = await pool.query("SELECT * FROM tramites WHERE status= 'pendiente'" + "AND region= ?", [zona])

    liquidar = await pool.query("SELECT * FROM tramites WHERE status= 'liquidar'" + "AND region= ?", [zona])
  }

  //condición para consulta general
  else if (user.consulta === "") {

    aclaraciones = await pool.query("SELECT * FROM tramites WHERE status= 'aclaración'")
    //todo Agregar a la consulta la zona que se obtiene

    asegurados = await pool.query("SELECT * FROM tramites WHERE status= 'asegurado'")

    bajas = await pool.query("SELECT * FROM tramites WHERE status= 'baja'")

    espera = await pool.query("SELECT * FROM tramites WHERE status= 'en espera'")

    fallidos = await pool.query("SELECT * FROM tramites WHERE status= 'fallido'")

    finalizados = await pool.query("SELECT * FROM tramites WHERE status= 'finalizado'")

    juridico = await pool.query("SELECT * FROM tramites WHERE status= 'jurídico'")

    pendientes = await pool.query("SELECT * FROM tramites WHERE status= 'pendiente'")

    liquidar = await pool.query("SELECT * FROM tramites WHERE status= 'liquidar'")
  }

  //condición para consulta zona
  else {

    aclaraciones = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'aclaración'", [req.user.consulta])

    asegurados = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'asegurado'", [req.user.consulta])

    bajas = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'baja'", [req.user.consulta])

    espera = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'en espera'", [req.user.consulta])

    fallidos = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'fallido'", [req.user.consulta])

    finalizados = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'finalizado'", [req.user.consulta])

    juridico = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'jurídico'", [req.user.consulta])

    pendientes = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'pendiente'", [req.user.consulta])

    liquidar = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'liquidar'", [req.user.consulta])
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
    pendientes: pendientes.length,
    liquidar: liquidar.length
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
    pendiente: 'pendiente',
    liquidar: 'liquidar'
  }

  // console.log(region);

  res.render('customer/resume.hbs', { status, user, titulos })
})

router.get('/resume/:status', isLoggedIn, async (req, res) => {
  const { status } = req.params
  const user = req.user

  // console.log(status);

  //consulta que muestra los clientes descendetes

  //todo como traigo la zona elegida por el cliente en la vista zonas
  if (user.region === 1 || user.region === 2 || user.region === 3 || user.region === 4) {
    customer = await pool.query("SELECT * FROM tramites WHERE status = ? AND region = ? order by fecha_tramite DESC", [status, user.region])
  }

  //consulta por administrador descendente
  else if (user.consulta === "") {
    customer = await pool.query("SELECT * FROM tramites WHERE status = ? order by fecha_tramite DESC", [status])
  }

  // consulta por zona descendente
  else {
    customer = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status = ? order by fecha_tramite DESC", [user.consulta, status])
  }

  //helper que cambia el formato de fecha y moneda
  customer = helpers.formatterCustomers(customer)

  //objeto que condiciona los botones de orden == Depurar
  orden = {
    // ascendente: 'descendente',
    // descendente: 'ascendente'
  }

  //valida el status pendiente
  if (status === 'pendiente') {
    //envía el desgloce de pendientes
    res.redirect('/desgloce-pendientes/')
  }

  else {
    //se envia el status para obtenerlo en post y ordenarlo
    res.render('customer/list-customer.hbs', { customer, orden, status })
  }
})


//=============== resume zonas
router.get('/resume-zona', isLoggedIn, async (req, res) => {
  const user = req.user

  console.log(user);

  //? condición para ocultar la ruta
  if (user.permiso === "Administrador") {
    //helper que trae las zonas
    region = helpers.region(user.region)

    // console.log(region);

    // res.render('customer/zonas.hbs', { region })
    res.send({ region })
  }
  else {
    res.send('404 not found')
  }

})

//=============== desgloce pendientes

router.get('/desgloce-pendientes/', isLoggedIn, async (req, res) => {
  const user = req.user

  //consulta que recupera cantidades totales

  //consulta por region
  if (user.region === 1 || user.region === 2 || user.region === 3 || user.region === 4) {

    afore = await pool.query("SELECT * FROM tramites WHERE pendiente = 'afore' AND region= ?", [user.region])

    antigüedad = await pool.query("SELECT * FROM tramites WHERE pendiente= 'antigüedad' AND region= ?", [user.region])

    cobro = await pool.query("SELECT * FROM tramites WHERE pendiente= 'cobro' AND region= ?", [user.region])

    cita = await pool.query("SELECT * FROM tramites WHERE pendiente = 'cita' AND region= ?", [user.region])

    demanda = await pool.query("SELECT * FROM tramites WHERE pendiente = 'demanda' AND region= ?", [user.region])

    documentos = await pool.query("SELECT * FROM tramites WHERE pendiente= 'documentos' AND region= ?", [user.region])

    orden = await pool.query("SELECT * FROM tramites WHERE pendiente= 'orden' AND region= ?", [user.region])

    saldos = await pool.query("SELECT * FROM tramites WHERE pendiente= 'saldos' AND region= ?", [user.region])

    tramite = await pool.query("SELECT * FROM tramites WHERE pendiente= 'trámite' AND region= ?", [user.region])

    unificacion = await pool.query("SELECT * FROM tramites WHERE pendiente= 'unificación' AND region= ?", [user.region])
  }

  //condición para consulta general
  else if (user.consulta === "") {

    afore = await pool.query("SELECT * FROM tramites WHERE pendiente = 'afore'")

    antigüedad = await pool.query("SELECT * FROM tramites WHERE pendiente= 'antigüedad'")

    cobro = await pool.query("SELECT * FROM tramites WHERE pendiente = 'cobro'")

    cita = await pool.query("SELECT * FROM tramites WHERE pendiente = 'cita'")

    demanda = await pool.query("SELECT * FROM tramites WHERE pendiente = 'demanda'")

    documentos = await pool.query("SELECT * FROM tramites WHERE pendiente= 'documentos'")

    orden = await pool.query("SELECT * FROM tramites WHERE pendiente= 'orden'")

    saldos = await pool.query("SELECT * FROM tramites WHERE pendiente= 'saldos'")

    tramite = await pool.query("SELECT * FROM tramites WHERE pendiente= 'trámite'")

    unificacion = await pool.query("SELECT * FROM tramites WHERE pendiente= 'unificación'")
  }

  //condición para consulta zona
  else {

    afore = await pool.query("SELECT * FROM tramites WHERE pendiente = 'afore'" + "AND zona = ?", [req.user.consulta])

    antigüedad = await pool.query("SELECT * FROM tramites WHERE pendiente= 'antigüedad'" + "AND zona = ?", [req.user.consulta])

    cobro = await pool.query("SELECT * FROM tramites WHERE pendiente = 'cobro'" + "AND zona = ?", [req.user.consulta])

    cita = await pool.query("SELECT * FROM tramites WHERE pendiente = 'cita'" + "AND zona = ?", [req.user.consulta])

    demanda = await pool.query("SELECT * FROM tramites WHERE pendiente = 'demanda'" + "AND zona = ?", [req.user.consulta])

    documentos = await pool.query("SELECT * FROM tramites WHERE pendiente= 'documentos'" + "AND zona = ?", [req.user.consulta])

    orden = await pool.query("SELECT * FROM tramites WHERE pendiente= 'orden'" + "AND zona = ?", [req.user.consulta])

    saldos = await pool.query("SELECT * FROM tramites WHERE pendiente= 'saldos'" + "AND zona = ?", [req.user.consulta])

    tramite = await pool.query("SELECT * FROM tramites WHERE pendiente= 'trámite'" + "AND zona = ?", [user.consulta])

    unificacion = await pool.query("SELECT * FROM tramites WHERE pendiente= 'unificación'" + "AND zona = ?", [req.user.consulta])
  }

  //objeto con status que se mandara a la vista
  motivos = {
    afore: afore.length,
    antigüedad: antigüedad.length,
    cobro: cobro.length,
    cita: cita.length,
    demanda: demanda.length,
    documentos: documentos.length,
    orden: orden.length,
    tramite: tramite.length,
    saldos: saldos.length,
    unificacion: unificacion.length
  }

  // console.log(user);
  // console.log(motivos);

  //objeto con titulos de status
  titulos = {
    afore: 'afore',
    antigüedad: 'antigüedad',
    cobro: 'cobro',
    cita: 'cita',
    demanda: 'demanda',
    documentos: 'documentos',
    orden: 'orden',
    saldos: 'saldos',
    tramite: 'tramite',
    unificacion: 'unificacion'
  }

  res.render('customer/desgloce-pendientes.hbs', { motivos, user, titulos })
})

router.get('/desgloce-pendientes/:motivo', isLoggedIn, async (req, res) => {
  const { motivo } = req.params
  const user = req.user

  //consulta por region descendente
  if (user.region === 1 || user.region === 2 || user.region === 3 || user.region === 4) {
    customer = await pool.query("SELECT * FROM tramites WHERE pendiente = ?" + " AND region = ? order by fecha_tramite DESC", [motivo, user.region])
  }

  //consulta por administrador descendente
  else if (user.consulta === "") {
    customer = await pool.query("SELECT * FROM tramites WHERE pendiente = ? order by fecha_tramite DESC", [motivo])
  }

  // consulta por zona descendente
  else {
    customer = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  pendiente = ? order by fecha_tramite DESC", [user.consulta, motivo])
  }

  //helper que cambia el formato de fecha y moneda
  customer = helpers.formatterCustomers(customer)

  ordenMotivo = {
    // ascendente: 'descendente',
    // descendente: 'ascendente'
  }

  //se envia el status para obtenerlo en post y ordenarlo
  res.render('customer/list-customer.hbs', { customer, ordenMotivo, motivo })
})

module.exports = router;


// ordenaba los clientes ascendente mediante una nueva consulta post
// router.post('/resume/:status', isLoggedIn, async (req, res) => {
//   const { status } = req.params
//   const user = req.user

//   //consulta que muestra los clientes ascendente

//   //consulta por regional ascendente
//   if (user.region === 1 || user.region === 2 || user.region === 3 || user.region === 4) {
//     customer = await pool.query("SELECT * FROM tramites WHERE status = ? AND region = ? order by fecha_tramite ASC", [status, user.region])
//   }

//   //consulta por administrador ascendente
//   else if (user.consulta === "") {
//     customer = await pool.query("SELECT * FROM tramites WHERE status = ? order by fecha_tramite ASC", [status])
//   }

//   //consulta por zona ascendente
//   else {
//     customer = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status = ? order by fecha_tramite ASC", [user.consulta, status])
//   }

//   //helper que cambia el formato de fecha y moneda
//   customer = helpers.formatterCustomers(customer)

//   //objeto que permite mostrar botones en la vista list
//   orden = {
//   }

//   res.render('customer/list.hbs', { customer, orden, status })
// })


// ordenaba lo motivos de forma ascendente
// router.post('/desgloce-pendientes/:motivo', isLoggedIn, async (req, res) => {
//   const { motivo } = req.params
//   const user = req.user

//   //consulta que muestra los clientes ascendente

//   //consulta por regional ascendente
//   if (user.region === 1 || user.region === 2 || user.region === 3 || user.region === 4) {
//     customer = await pool.query("SELECT * FROM tramites WHERE pendiente = ?" + " AND region = ? order by fecha_tramite ASC", [motivo, user.region])
//   }

//   //consulta por administrador ascendente
//   else if (user.consulta === "") {
//     customer = await pool.query("SELECT * FROM tramites WHERE pendiente = ? order by fecha_tramite ASC", [motivo])
//   }

//   //consulta por zona ascendente
//   else {
//     customer = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  pendiente = ? order by fecha_tramite ASC", [user.consulta, motivo])
//   }

//   //helper que cambia el formato de fecha y moneda
//   customer = helpers.formatterCustomers(customer)

//   //objeto que permite mostrar botones en la vista list
//   ordenMotivo = {
//   }

//   res.render('customer/list.hbs', { customer, ordenMotivo, motivo })
// })