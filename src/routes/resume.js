//muestra la relación de trámites

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/handlebars')

//routes

//?========= renderiza resumen (status)
router.get('/resume', isLoggedIn, async (req, res) => {
  const user = req.user

  const sqlSelect = "SELECT * FROM tramites WHERE status= ?"

  //*============ Consulta Regional
  if (user.permiso === 'Regional') {

    aclaraciones = await pool.query(sqlSelect + "AND region= ?", ['aclaración', user.region])
    asegurados = await pool.query(sqlSelect + "AND region= ?", ['asegurado', user.region])
    bajas = await pool.query(sqlSelect + "AND region= ?", ['baja', user.region])
    espera = await pool.query(sqlSelect + "AND region= ?", ['en espera', user.region])
    fallidos = await pool.query(sqlSelect + "AND region= ?", ['fallido', user.region])
    finalizados = await pool.query(sqlSelect + "AND region= ?", ['finalizado', user.region])
    juridico = await pool.query(sqlSelect + "AND region= ?", ['jurídico', user.region])
    pendientes = await pool.query(sqlSelect + "AND region= ?", ['pendiente', user.region])
    liquidar = await pool.query(sqlSelect + "AND region= ?", ['liquidar', user.region])
    actualizar = await pool.query(sqlSelect + "AND region= ?", ['actualizar', user.region])
  }

  //*============ Consulta Administrador
  else if (user.permiso === 'Administrador') {

    aclaraciones = await pool.query(sqlSelect, 'aclaración')
    asegurados = await pool.query(sqlSelect, 'asegurado')
    bajas = await pool.query(sqlSelect, 'baja')
    espera = await pool.query(sqlSelect, 'en espera')
    fallidos = await pool.query(sqlSelect, 'fallido')
    finalizados = await pool.query(sqlSelect, 'finalizado')
    juridico = await pool.query(sqlSelect, 'jurídico')
    pendientes = await pool.query(sqlSelect, 'pendiente')
    liquidar = await pool.query(sqlSelect, 'liquidar')
    actualizar = await pool.query(sqlSelect, 'actualizar')
  }

  //*============ Consulta encargado
  else {

    aclaraciones = await pool.query(sqlSelect + "AND zona = ?", ['aclaración', user.zona])
    asegurados = await pool.query(sqlSelect + "AND zona = ?", ['asegurado', user.zona])
    bajas = await pool.query(sqlSelect + "AND zona = ?", ['baja', user.zona])
    espera = await pool.query(sqlSelect + "AND zona = ?", ['en espera', user.zona])
    fallidos = await pool.query(sqlSelect + "AND zona = ?", ['fallido', user.zona])
    finalizados = await pool.query(sqlSelect + "AND zona = ?", ['finalizado', user.zona])
    juridico = await pool.query(sqlSelect + "AND zona = ?", ['jurídico', user.zona])
    pendientes = await pool.query(sqlSelect + "AND zona = ?", ['pendiente', user.zona])
    liquidar = await pool.query(sqlSelect + "AND zona = ?", ['liquidar', user.zona])
    actualizar = await pool.query(sqlSelect + "AND zona = ?", ['actualizar', user.zona])
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
    liquidar: liquidar.length,
    actualizar: actualizar.length
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
    liquidar: 'liquidar',
    actualizar: 'actualizar'
  }

  region = helpers.region(user.region)

  res.render('resume/resume.hbs', { status, user, titulos, region })
});

//?========= renderiza resume (status administrador regional por zona 'busqueda zona')
router.post('/resume-zona/', isLoggedIn, async (req, res) => {
  const user = req.user
  const { zona } = req.body

  const sqlSelect = "SELECT * FROM tramites WHERE status= ? AND zona = ?"

  //*============ consulta de status (administrador regional)
  aclaraciones = await pool.query(sqlSelect, ['aclaración', zona])
  asegurados = await pool.query(sqlSelect, ['asegurado', zona])
  bajas = await pool.query(sqlSelect, ['baja', zona])
  espera = await pool.query(sqlSelect, ['en espera', zona])
  fallidos = await pool.query(sqlSelect, ['fallido', zona])
  finalizados = await pool.query(sqlSelect, ['finalizado', zona])
  juridico = await pool.query(sqlSelect, ['jurídico', zona])
  pendientes = await pool.query(sqlSelect, ['pendiente', zona])
  liquidar = await pool.query(sqlSelect, ['liquidar', zona])
  actualizar = await pool.query(sqlSelect, ['actualizar', zona])

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
    liquidar: liquidar.length,
    actualizar: actualizar.length
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
    liquidar: 'liquidar',
    actualizar: 'actualizar'
  }

  region = helpers.region(user.region)

  res.render('resume/resume.hbs', { status, user, titulos, zona, region });
})

//?========= renderiza list-customer (status except 'pendiente')
router.get('/resume/:status', isLoggedIn, async (req, res) => {
  const user = req.user
  const { status } = req.params
  const zona = req.query.zona

  //consultas a la BD
  const sqlSelect = "SELECT * FROM tramites WHERE motivo = ?"

  const sqlWeek = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 14 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND status = 'Pendiente'"
  const sql30Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 31 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND status = 'Pendiente'"
  const sql60Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 61 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) AND status = 'Pendiente'"
  const sqlMore60Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 91 DAY) AND status = 'Pendiente'"

  //si select zona
  if (zona) {

    if (user.permiso === "Regional") {
      //valida el status pendiente
      if (status === 'pendiente') {

        afore = await pool.query(sqlSelect + "AND zona = ? AND region = ?", ['afore', zona, user.region])
        antigüedad = await pool.query(sqlSelect + "AND zona = ? AND region = ?", ['antigüedad', zona, user.region])
        cobro = await pool.query(sqlSelect + "AND zona = ? AND region = ?", ['cobro', zona, user.region])
        cita = await pool.query(sqlSelect + "AND zona = ? AND region = ?", ['cita', zona, user.region])
        demanda = await pool.query(sqlSelect + "AND zona = ? AND region = ?", ['demanda', zona, user.region])
        documentos = await pool.query(sqlSelect + "AND zona = ? AND region = ?", ['documentos', zona, user.region])
        orden = await pool.query(sqlSelect + "AND zona = ? AND region = ?", ['orden', zona, user.region])
        saldos = await pool.query(sqlSelect + "AND zona = ? AND region = ?", ['saldos', zona, user.region])
        tramite = await pool.query(sqlSelect + "AND zona = ? AND region = ?", ['trámite', zona, user.region])
        unificacion = await pool.query(sqlSelect + "AND zona = ? AND region = ?", ['unificación', zona, user.region])
        vigente = await pool.query(sqlSelect + "AND zona = ? AND region = ?", ['vigente', zona, user.region])
        salud = await pool.query(sqlSelect + "AND zona = ? AND region = ?", ['salud', zona, user.region])

        pendientesWeek = await pool.query(sqlWeek + "AND zona = ? AND region= ?", [zona, user.region])
        pendientes30Days = await pool.query(sql30Days + "AND zona = ? AND region= ?", [zona, user.region])
        pendientes60Days = await pool.query(sql60Days + "AND zona = ? AND region= ?", [zona, user.region])
        pendientesMore60Days = await pool.query(sqlMore60Days + "AND zona = ? AND region= ?", [zona, user.region])

        //objeto con cantidad de pendientes que se mandara a la vista
        cantidadPendientes = {
          pendientesWeek: pendientesWeek.length,
          pendientes30Days: pendientes30Days.length,
          pendientes60Days: pendientes60Days.length,
          pendientesMore60Days: pendientesMore60Days.length
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
          unificacion: unificacion.length,
          vigente: vigente.length,
          salud: salud.length
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
          unificacion: 'unificacion',
          vigente: 'vigente',
          salud: 'salud'
        }

        //get zonas
        region = helpers.region(user.region)

        res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, zona, region, cantidadPendientes })
      }
      else {
        const sqlStatus = "SELECT * FROM tramites WHERE zona = ? AND  status = ? AND region = ? order by fecha_tramite DESC"
        customer = await pool.query(sqlStatus, [zona, status, user.region])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, zona })
      }
    }

    else if (user.permiso === "Administrador") {
      //consulta administrador
      if (status === 'pendiente') {

        afore = await pool.query(sqlSelect + "AND zona = ?", ['afore', zona])
        antigüedad = await pool.query(sqlSelect + "AND zona = ?", ['antigüedad', zona])
        cobro = await pool.query(sqlSelect + "AND zona = ?", ['cobro', zona])
        cita = await pool.query(sqlSelect + "AND zona = ?", ['cita', zona])
        demanda = await pool.query(sqlSelect + "AND zona = ?", ['demanda', zona])
        documentos = await pool.query(sqlSelect + "AND zona = ?", ['documentos', zona])
        orden = await pool.query(sqlSelect + "AND zona = ?", ['orden', zona])
        saldos = await pool.query(sqlSelect + "AND zona = ?", ['saldos', zona])
        tramite = await pool.query(sqlSelect + "AND zona = ?", ['trámite', zona])
        unificacion = await pool.query(sqlSelect + "AND zona = ?", ['unificación', zona])
        vigente = await pool.query(sqlSelect + "AND zona = ?", ['vigente', zona])
        salud = await pool.query(sqlSelect + "AND zona = ?", ['salud', zona])

        pendientesWeek = await pool.query(sqlWeek + "AND zona = ?", zona)
        pendientes30Days = await pool.query(sql30Days + "AND zona = ?", zona)
        pendientes60Days = await pool.query(sql60Days + "AND zona = ?", zona)
        pendientesMore60Days = await pool.query(sqlMore60Days + "AND zona = ?", zona)

        //objeto con cantidad de pendientes que se mandara a la vista
        cantidadPendientes = {
          pendientesWeek: pendientesWeek.length,
          pendientes30Days: pendientes30Days.length,
          pendientes60Days: pendientes60Days.length,
          pendientesMore60Days: pendientesMore60Days.length
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
          unificacion: unificacion.length,
          vigente: vigente.length,
          salud: salud.length
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
          unificacion: 'unificacion',
          vigente: 'vigente',
          salud: 'salud'
        }

        //get zonas
        region = helpers.region(user.region)

        res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, zona, region, cantidadPendientes })
      }
      else {
        const sqlStatus = "SELECT * FROM tramites WHERE zona = ? AND  status = ? order by fecha_tramite DESC"
        customer = await pool.query(sqlStatus, [zona, status])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)
        console.log(sqlStatus);
        res.render('customer/list-customer.hbs', { customer, zona })
      }
    }

    //* Encargado
    else {
      res.redirect('/profile')
    }
  }

  //si select zona NULL
  else {

    if (user.permiso === "Regional") {
      //valida el status pendiente
      if (status === 'pendiente') {

        afore = await pool.query(sqlSelect + "AND region = ?", ['afore', user.region])
        antigüedad = await pool.query(sqlSelect + "AND region = ?", ['antigüedad', user.region])
        cobro = await pool.query(sqlSelect + "AND region = ?", ['cobro', user.region])
        cita = await pool.query(sqlSelect + "AND region = ?", ['cita', user.region])
        demanda = await pool.query(sqlSelect + "AND region = ?", ['demanda', user.region])
        documentos = await pool.query(sqlSelect + "AND region = ?", ['documentos', user.region])
        orden = await pool.query(sqlSelect + "AND region = ?", ['orden', user.region])
        saldos = await pool.query(sqlSelect + "AND region = ?", ['saldos', user.region])
        tramite = await pool.query(sqlSelect + "AND region = ?", ['trámite', user.region])
        unificacion = await pool.query(sqlSelect + "AND region = ?", ['unificación', user.region])
        salud = await pool.query(sqlSelect + "AND region = ?", ['salud', user.region])
        vigente = await pool.query(sqlSelect + "AND region = ?", ['vigente', user.region])

        pendientesWeek = await pool.query(sqlWeek + "AND region= ?", user.region)
        pendientes30Days = await pool.query(sql30Days + "AND region= ?", user.region)
        pendientes60Days = await pool.query(sql60Days + "AND region= ?", user.region)
        pendientesMore60Days = await pool.query(sqlMore60Days + "AND region= ?", user.region)

        //objeto con cantidad de pendientes que se mandara a la vista
        cantidadPendientes = {
          pendientesWeek: pendientesWeek.length,
          pendientes30Days: pendientes30Days.length,
          pendientes60Days: pendientes60Days.length,
          pendientesMore60Days: pendientesMore60Days.length
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
          unificacion: unificacion.length,
          vigente: vigente.length,
          salud: salud.length
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
          unificacion: 'unificacion',
          vigente: 'vigente',
          salud: 'salud'
        }

        //get zonas
        region = helpers.region(user.region)

        res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, zona, region, cantidadPendientes })
      }

      else {
        const sqlStatus = "SELECT * FROM tramites WHERE region = ? AND  status = ? ORDER BY fecha_tramite DESC"

        customer = await pool.query(sqlStatus, [user.region, status])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, zona })
      }
    }

    else if (user.permiso === "Administrador") {
      //valida el status pendiente
      if (status === 'pendiente') {

        afore = await pool.query(sqlSelect, 'afore')
        antigüedad = await pool.query(sqlSelect, 'antigüedad')
        cobro = await pool.query(sqlSelect, 'cobro')
        cita = await pool.query(sqlSelect, 'cita')
        demanda = await pool.query(sqlSelect, 'demanda')
        documentos = await pool.query(sqlSelect, 'documentos')
        orden = await pool.query(sqlSelect, 'orden')
        saldos = await pool.query(sqlSelect, 'saldos')
        tramite = await pool.query(sqlSelect, 'trámite')
        unificacion = await pool.query(sqlSelect, 'unificación')
        vigente = await pool.query(sqlSelect, 'vigente')
        salud = await pool.query(sqlSelect, 'salud')

        pendientesWeek = await pool.query(sqlWeek)
        pendientes30Days = await pool.query(sql30Days)
        pendientes60Days = await pool.query(sql60Days)
        pendientesMore60Days = await pool.query(sqlMore60Days)

        //objeto con cantidad de pendientes que se mandara a la vista
        cantidadPendientes = {
          pendientesWeek: pendientesWeek.length,
          pendientes30Days: pendientes30Days.length,
          pendientes60Days: pendientes60Days.length,
          pendientesMore60Days: pendientesMore60Days.length
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
          unificacion: unificacion.length,
          vigente: vigente.length,
          salud: salud.length
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
          unificacion: 'unificacion',
          vigente: 'vigente',
          salud: 'salud'
        }

        //get zonas
        region = helpers.region(user.region)

        res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, zona, region, cantidadPendientes })
      }

      else {
        const sqlStatus = "SELECT * FROM tramites WHERE status = ? order by fecha_tramite DESC"
        customer = await pool.query(sqlStatus, [status])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, zona })
      }
    }

    //* Encargado
    else {
      //valida el status pendiente
      if (status === 'pendiente') {

        afore = await pool.query(sqlSelect + " AND zona = ?", ['afore', user.zona])
        antigüedad = await pool.query(sqlSelect + " AND zona = ?", ['antigüedad', user.zona])
        cobro = await pool.query(sqlSelect + " AND zona = ?", ['cobro', user.zona])
        cita = await pool.query(sqlSelect + " AND zona = ?", ['cita', user.zona])
        demanda = await pool.query(sqlSelect + " AND zona = ?", ['demanda', user.zona])
        documentos = await pool.query(sqlSelect + " AND zona = ?", ['documentos', user.zona])
        orden = await pool.query(sqlSelect + " AND zona = ?", ['orden', user.zona])
        saldos = await pool.query(sqlSelect + " AND zona = ?", ['saldos', user.zona])
        tramite = await pool.query(sqlSelect + " AND zona = ?", ['trámite', user.zona])
        unificacion = await pool.query(sqlSelect + " AND zona = ?", ['unificación', user.zona])
        vigente = await pool.query(sqlSelect + " AND zona = ?", ['vigente', user.zona])
        salud = await pool.query(sqlSelect + " AND zona = ?", ['salud', user.zona])

        pendientesWeek = await pool.query(sqlWeek + "AND zona = ?", user.zona)
        pendientes30Days = await pool.query(sql30Days + "AND zona = ?", user.zona)
        pendientes60Days = await pool.query(sql60Days + "AND zona = ?", user.zona)
        pendientesMore60Days = await pool.query(sqlMore60Days + "AND zona = ?", user.zona)

        //objeto con cantidad de pendientes que se mandara a la vista
        cantidadPendientes = {
          pendientesWeek: pendientesWeek.length,
          pendientes30Days: pendientes30Days.length,
          pendientes60Days: pendientes60Days.length,
          pendientesMore60Days: pendientesMore60Days.length
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
          unificacion: unificacion.length,
          vigente: vigente.length,
          salud: salud.length
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
          unificacion: 'unificacion',
          vigente: 'vigente',
          salud: 'salud'
        }

        //get zonas
        region = helpers.region(user.region)

        res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, zona, region, cantidadPendientes })
      }

      else {
        const sqlStatus = "SELECT * FROM tramites WHERE zona = ? AND  status = ? order by fecha_tramite DESC"
        customer = await pool.query(sqlStatus, [user.zona, status])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, zona })
      }
    }
  }
});

//?========= renderiza list-customer (pendientes por semana, 30 & 60 days)
router.get('/pendientes/:group', isLoggedIn, async (req, res) => {
  const user = req.user;
  const zona = req.query.zona;
  let sqlQuery = req.params.group;

  const sqlWeek = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 14 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND status = 'Pendiente'"

  const sql30Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 31 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND status = 'Pendiente'"

  const sql60Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 61 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) AND status = 'Pendiente'"

  const sqlMore60Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 91 DAY) AND status = 'Pendiente'"

  //si select zona
  if (zona) {
    switch (user.permiso) {
      case "Regional":

        switch (sqlQuery) {

          case "week":

            customer = await pool.query(sqlWeek + "AND region = ? AND zona = ?", [user.region, zona])

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "30days":

            customer = await pool.query(sql30Days + "AND region = ? AND zona = ?", [user.region, zona])

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "60days":

            customer = await pool.query(sql60Days + "AND region = ? AND zona = ?", [user.region, zona])

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "more60days":

            customer = await pool.query(sqlMore60Days + "AND region = ? AND zona = ?", [user.region, zona])

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;
        }
        break;

      case "Administrador":

        switch (sqlQuery) {

          case "week":

            customer = await pool.query(sqlWeek + "AND zona = ?", zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "30days":

            customer = await pool.query(sql30Days + "AND zona = ?", zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "60days":

            customer = await pool.query(sql60Days + "AND zona = ?", zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "more60days":

            customer = await pool.query(sqlMore60Days + "AND zona = ?", zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;
        }
        break;

      case "Encargado":

        res.redirect('/profile')
        break;
    }
  }
  //si select zona NULL
  else {
    switch (user.permiso) {
      case "Regional":

        switch (sqlQuery) {

          case "week":

            customer = await pool.query(sqlWeek + "AND region= ?", user.region)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "30days":

            customer = await pool.query(sql30Days + "AND region= ?", user.region)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "60days":

            customer = await pool.query(sql60Days + "AND region= ?", user.region)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "more60days":

            customer = await pool.query(sqlMore60Days + "AND region= ?", user.region)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;
        }
        break;

      case "Administrador":

        switch (sqlQuery) {

          case "week":

            customer = await pool.query(sqlWeek)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "30days":

            customer = await pool.query(sql30Days)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "60days":

            customer = await pool.query(sql60Days)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "more60days":

            customer = await pool.query(sqlMore60Days)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;
        }
        break;

      case "Encargado":
        switch (sqlQuery) {

          case "week":

            customer = await pool.query(sqlWeek + "AND zona= ?", user.zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "30days":

            customer = await pool.query(sql30Days + "AND zona= ?", user.zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "60days":

            customer = await pool.query(sql60Days + "AND zona= ?", user.zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "more60days":

            customer = await pool.query(sqlMore60Days + "AND zona= ?", user.zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;
        }
        break;
    }
  }
})

//?========= renderiza list-customer (motivos)
router.get('/desgloce-pendientes/:motivo', isLoggedIn, async (req, res) => {
  const { motivo } = req.params
  const user = req.user
  const zona = req.query.zona

  //*============ Consulta Administrador-Regional
  if (user.permiso === 'Regional' || user.permiso === 'Administrador') {

    //Si select zona none
    if (zona === "") {

      if (user.permiso === 'Regional') {
        const sqlSelect = "SELECT * FROM tramites WHERE region = ? AND  motivo = ? order by fecha_tramite DESC"
        customer = await pool.query(sqlSelect, [user.region, motivo])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, motivo, zona })
      }

      else {
        const sqlSelect = "SELECT * FROM tramites WHERE motivo = ? order by fecha_tramite DESC"
        customer = await pool.query(sqlSelect, [motivo])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, motivo, zona })
      }
    }

    //Si select zona
    else {
      const sqlSelect = "SELECT * FROM tramites WHERE zona = ?" + " AND  motivo = ? order by fecha_tramite DESC"
      customer = await pool.query(sqlSelect, [zona, motivo])

      //helper que cambia el formato de fecha y moneda
      customer = helpers.formatterCustomers(customer)

      res.render('customer/list-customer.hbs', { customer, motivo, zona })
    }
  }

  //*============ Consulta Encargado
  else {
    const sqlSelect = "SELECT * FROM tramites WHERE zona = ?" + " AND  motivo = ? order by fecha_tramite DESC"
    customer = await pool.query(sqlSelect, [user.zona, motivo])

    //helper que cambia el formato de fecha y moneda
    customer = helpers.formatterCustomers(customer)

    res.render('customer/list-customer.hbs', { customer, motivo, zona })
  }
});

module.exports = router;