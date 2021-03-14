//muestra la relación de trámites

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

const helpers = require('../lib/handlebars')

//?=============== renderizar resumen (status encargado)
router.get('/resume', isLoggedIn, async (req, res) => {
  const user = req.user

  //todo mejorar está consulta customers = await pool.query("SELECT status, COUNT(*) as total FROM tramites WHERE zona like '%" + [req.user.consulta] + "%'GROUP BY status")

  // Consulta Regional
  if (user.puesto === 'Regional') {

    aclaraciones = await pool.query("SELECT * FROM tramites WHERE status= 'aclaración'" + "AND region= ?", [user.region])

    asegurados = await pool.query("SELECT * FROM tramites WHERE status= 'asegurado'" + "AND region= ?", [user.region])

    bajas = await pool.query("SELECT * FROM tramites WHERE status= 'baja'" + "AND region= ?", [user.region])

    espera = await pool.query("SELECT * FROM tramites WHERE status= 'en espera'" + "AND region= ?", [user.region])

    fallidos = await pool.query("SELECT * FROM tramites WHERE status= 'fallido'" + "AND region= ?", [user.region])

    finalizados = await pool.query("SELECT * FROM tramites WHERE status= 'finalizado'" + "AND region= ?", [user.region])

    juridico = await pool.query("SELECT * FROM tramites WHERE status= 'jurídico'" + "AND region= ?", [user.region])

    pendientes = await pool.query("SELECT * FROM tramites WHERE status= 'pendiente'" + "AND region= ?", [user.region])

    liquidar = await pool.query("SELECT * FROM tramites WHERE status= 'liquidar'" + "AND region= ?", [user.region])
  }

  //Consulta Administrador
  else if (user.puesto === 'Administrador') {

    aclaraciones = await pool.query("SELECT * FROM tramites WHERE status= 'aclaración'")

    asegurados = await pool.query("SELECT * FROM tramites WHERE status= 'asegurado'")

    bajas = await pool.query("SELECT * FROM tramites WHERE status= 'baja'")

    espera = await pool.query("SELECT * FROM tramites WHERE status= 'en espera'")

    fallidos = await pool.query("SELECT * FROM tramites WHERE status= 'fallido'")

    finalizados = await pool.query("SELECT * FROM tramites WHERE status= 'finalizado'")

    juridico = await pool.query("SELECT * FROM tramites WHERE status= 'jurídico'")

    pendientes = await pool.query("SELECT * FROM tramites WHERE status= 'pendiente'")

    liquidar = await pool.query("SELECT * FROM tramites WHERE status= 'liquidar'")
  }

  //Consulta encargado
  else {

    aclaraciones = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'aclaración'", [user.consulta])

    asegurados = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'asegurado'", [user.consulta])

    bajas = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'baja'", [user.consulta])

    espera = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'en espera'", [user.consulta])

    fallidos = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'fallido'", [user.consulta])

    finalizados = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'finalizado'", [user.consulta])

    juridico = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'jurídico'", [user.consulta])

    pendientes = await pool.query("SELECT * FROM tramites WHERE zona = ?" + "AND  status= 'pendiente'", [user.consulta])
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
    pendientes: pendientes.length
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
    pendiente: 'pendiente'
  }

  //get zonas
  region = helpers.region(user.region)

  res.render('resume/resume.hbs', { status, user, titulos, region })

})

//?=============== renderiza resume (status administrador)
router.post('/resume-zona/', isLoggedIn, async (req, res) => {
  const user = req.user
  const { zona } = req.body

  //* consulta de status (administrador)
  aclaraciones = await pool.query("SELECT * FROM tramites WHERE status= 'aclaración'" + "AND zona= ?", [zona])

  asegurados = await pool.query("SELECT * FROM tramites WHERE status= 'asegurado'" + "AND zona= ?", [zona])

  bajas = await pool.query("SELECT * FROM tramites WHERE status= 'baja'" + "AND zona= ?", [zona])

  espera = await pool.query("SELECT * FROM tramites WHERE status= 'en espera'" + "AND zona= ?", [zona])

  fallidos = await pool.query("SELECT * FROM tramites WHERE status= 'fallido'" + "AND zona= ?", [zona])

  finalizados = await pool.query("SELECT * FROM tramites WHERE status= 'finalizado'" + "AND zona= ?", [zona])

  juridico = await pool.query("SELECT * FROM tramites WHERE status= 'jurídico'" + "AND zona= ?", [zona])

  pendientes = await pool.query("SELECT * FROM tramites WHERE status= 'pendiente'" + "AND zona= ?", [zona])

  liquidar = await pool.query("SELECT * FROM tramites WHERE status= 'liquidar'" + "AND zona= ?", [zona])

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

  region = helpers.region(user.region)

  res.render('resume/resume.hbs', { status, user, titulos, zona, region })
})

//?=============== renderiza list-customer (status encargado)
router.get('/resume/:status', isLoggedIn, async (req, res) => {
  const user = req.user
  const { status } = req.params

  //* Valida user redireciona render pendientes-zona.
  if (user.region === 1 || user.region === 2 || user.region === 3 || user.region === 4 || user.consulta === "") {

    //obtine las zonas
    region = helpers.region(user.region)

    res.render('resume/select-pendientes-zona.hbs', { status, region })
  }

  //* Consulta por zona descendente
  else {
    customer = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status = ? order by fecha_tramite DESC", [user.consulta, status])

    //helper que cambia el formato de fecha y moneda
    customer = helpers.formatterCustomers(customer)

    //valida el status pendiente
    if (status === 'pendiente') {
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

      res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos })
    }

    else {
      res.render('customer/list-customer.hbs', { customer })
    }
  }
})

//?=============== renderiza list-customer (motivos encargado)
router.get('/desgloce-pendientes/:motivo', isLoggedIn, async (req, res) => {
  const { motivo } = req.params
  const user = req.user

  //consulta por region descendente
  if (user.region === 1 || user.region === 2 || user.region === 3 || user.region === 4 || user.consulta === "") {
    //obtine las zonas
    region = helpers.region(user.region)

    res.render('resume/select-motivo-zona.hbs', { motivo, region })
  }

  // consulta por zona descendente
  else {
    customer = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  pendiente = ? order by fecha_tramite DESC", [user.consulta, motivo])

    //helper que cambia el formato de fecha y moneda
    customer = helpers.formatterCustomers(customer)

    //se envia el status para obtenerlo en post y ordenarlo
    res.render('customer/list-customer.hbs', { customer, motivo })
  }
})

//=============== resume zonas

//?=============== renderiza list-customer (status administrador)
router.post('/pendientes-zona/:status', isLoggedIn, async (req, res) => {
  //? Desestructurar para obtener valor para consulta
  const { zona } = req.body
  const { status } = req.params
  const user = req.user

  //* Consulta status
  customer = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  status = ? order by fecha_tramite DESC", [zona, status])

  //helper que cambia el formato de fecha y moneda
  customer = helpers.formatterCustomers(customer)

  //valida el status pendiente renderiza desgloce pendientes
  if (status === 'pendiente') {
    afore = await pool.query("SELECT * FROM tramites WHERE pendiente = 'afore'" + "AND zona = ?", [zona])

    antigüedad = await pool.query("SELECT * FROM tramites WHERE pendiente= 'antigüedad'" + "AND zona = ?", [zona])

    cobro = await pool.query("SELECT * FROM tramites WHERE pendiente = 'cobro'" + "AND zona = ?", [zona])

    cita = await pool.query("SELECT * FROM tramites WHERE pendiente = 'cita'" + "AND zona = ?", [zona])

    demanda = await pool.query("SELECT * FROM tramites WHERE pendiente = 'demanda'" + "AND zona = ?", [zona])

    documentos = await pool.query("SELECT * FROM tramites WHERE pendiente= 'documentos'" + "AND zona = ?", [zona])

    orden = await pool.query("SELECT * FROM tramites WHERE pendiente= 'orden'" + "AND zona = ?", [zona])

    saldos = await pool.query("SELECT * FROM tramites WHERE pendiente= 'saldos'" + "AND zona = ?", [zona])

    tramite = await pool.query("SELECT * FROM tramites WHERE pendiente= 'trámite'" + "AND zona = ?", [zona])

    unificacion = await pool.query("SELECT * FROM tramites WHERE pendiente= 'unificación'" + "AND zona = ?", [zona])

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

    res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos })
  }

  else {
    res.render('customer/list-customer.hbs', { customer, zona })
  }

})

//?=============== renderiza list-customer (motivos administrador)
router.post('/motivo-zona/:motivo', isLoggedIn, async (req, res) => {
  const { zona } = req.body
  const { motivo } = req.params
  const user = req.user

  customer = await pool.query("SELECT * FROM tramites WHERE zona = ?" + " AND  pendiente = ? order by fecha_tramite DESC", [zona, motivo])

  //helper que cambia el formato de fecha y moneda
  customer = helpers.formatterCustomers(customer)

  res.render('customer/list-customer.hbs', { customer, zona })

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
// router.post('/resume', isLoggedIn, async (req, res) => {
//   const user = req.user
//   const { zona } = req.body

//   //Consulta que recupera cantidades totales

//   //* Consulta por la zona seleccionada (regional y admin)

//   aclaraciones = await pool.query("SELECT * FROM tramites WHERE status= 'aclaración'" + "AND zona= ?", [zona])

//   asegurados = await pool.query("SELECT * FROM tramites WHERE status= 'asegurado'" + "AND region= ?", [zona])

//   bajas = await pool.query("SELECT * FROM tramites WHERE status= 'baja'" + "AND region= ?", [zona])

//   espera = await pool.query("SELECT * FROM tramites WHERE status= 'en espera'" + "AND region= ?", [zona])

//   fallidos = await pool.query("SELECT * FROM tramites WHERE status= 'fallido'" + "AND region= ?", [zona])

//   finalizados = await pool.query("SELECT * FROM tramites WHERE status= 'finalizado'" + "AND region= ?", [zona])

//   juridico = await pool.query("SELECT * FROM tramites WHERE status= 'jurídico'" + "AND region= ?", [zona])

//   pendientes = await pool.query("SELECT * FROM tramites WHERE status= 'pendiente'" + "AND region= ?", [zona])

//   liquidar = await pool.query("SELECT * FROM tramites WHERE status= 'liquidar'" + "AND region= ?", [zona])

//   //objeto con status que se mandara a la vista
//   status = {
//     aclaraciones: aclaraciones.length,
//     asegurados: asegurados.length,
//     bajas: bajas.length,
//     espera: espera.length,
//     fallidos: fallidos.length,
//     finalizados: finalizados.length,
//     juridico: juridico.length,
//     pendientes: pendientes.length,
//     liquidar: liquidar.length
//   }

//   //objeto con titulos de status
//   titulos = {
//     aclaracion: 'aclaracion',
//     asegurado: 'asegurado',
//     baja: 'baja',
//     espera: 'en espera',
//     fallido: 'fallido',
//     finalizado: 'finalizado',
//     juridico: 'jurídico',
//     pendiente: 'pendiente',
//     liquidar: 'liquidar'
//   }

//   res.render('customer/resume.hbs', { status, user, titulos })
// })