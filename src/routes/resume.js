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

  const sqlWeek = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 14 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND status = 'Pendiente'"

  const sql30Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 31 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND status = 'Pendiente'"

  const sql60Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 61 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) AND status = 'Pendiente'"

  const sqlMore60Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 91 DAY) AND status = 'Pendiente'"

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

    pendientesWeek = await pool.query(sqlWeek + "AND region= ?", user.region)

    pendientes30Days = await pool.query(sql30Days + "AND region= ?", user.region)

    pendientes60Days = await pool.query(sql60Days + "AND region= ?", user.region)

    pendientesMore60Days = await pool.query(sqlMore60Days + "AND region= ?", user.region)
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

    pendientesWeek = await pool.query(sqlWeek)

    pendientes30Days = await pool.query(sql30Days)

    pendientes60Days = await pool.query(sql60Days)

    pendientesMore60Days = await pool.query(sqlMore60Days)
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

    pendientesWeek = await pool.query(sqlWeek + "AND zona= ?", user.zona)

    pendientes30Days = await pool.query(sql30Days + "AND zona= ?", user.zona)

    pendientes60Days = await pool.query(sql60Days + "AND zona= ?", user.zona)

    pendientesMore60Days = await pool.query(sqlMore60Days + "AND zona = ?", user.zona)
  }

  //objeto con cantidad de pendientes que se mandara a la vista
  cantidadPendientes = {
    pendientesWeek: pendientesWeek.length,
    pendientes30Days: pendientes30Days.length,
    pendientes60Days: pendientes60Days.length,
    pendientesMore60Days: pendientesMore60Days.length
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

  res.render('resume/resume.hbs', { status, user, titulos, region, cantidadPendientes })
});

//?========= renderiza resume (status administrador regional por zona 'busqueda zona')
router.post('/resume-zona/', isLoggedIn, async (req, res) => {
  const user = req.user
  const { zona } = req.body

  const sqlSelect = "SELECT * FROM tramites WHERE status= ? AND zona = ?"

  const sqlWeek = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 14 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND status = 'Pendiente' AND zona = ?"

  const sql30Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 31 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND status = 'Pendiente' AND zona = ?"

  const sql60Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 61 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) AND status = 'Pendiente' AND zona = ?"

  const sqlMore60Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 91 DAY) AND status = 'Pendiente' AND zona = ?"

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

  pendientesWeek = await pool.query(sqlWeek, zona)

  pendientes30Days = await pool.query(sql30Days, zona)

  pendientes60Days = await pool.query(sql60Days, zona)

  pendientesMore60Days = await pool.query(sqlMore60Days, zona)

  //objeto con cantidad de pendientes que se mandara a la vista
  cantidadPendientes = {
    pendientesWeek: pendientesWeek.length,
    pendientes30Days: pendientes30Days.length,
    pendientes60Days: pendientes60Days.length,
    pendientesMore60Days: pendientesMore60Days.length
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

  res.render('resume/resume.hbs', { status, user, titulos, zona, region, cantidadPendientes });
})

//?========= renderiza list-customer (status except 'pendiente')
router.get('/resume/:status', isLoggedIn, async (req, res) => {
  const user = req.user
  const { status } = req.params
  const zona = req.query.zona

  //*============ Consulta region-administrador
  if (user.permiso === "Regional" || user.permiso === "Administrador") {

    //Si select zona NULL
    if (zona === "") {

      //consulta regional
      if (user.permiso === "Regional") {

        //valida el status pendiente
        if (status === 'pendiente') {
          const sqlSelect = "SELECT * FROM tramites WHERE motivo = ? AND region = ?"

          afore = await pool.query(sqlSelect, ['afore', user.region])

          antigüedad = await pool.query(sqlSelect, ['antigüedad', user.region])

          cobro = await pool.query(sqlSelect, ['cobro', user.region])

          cita = await pool.query(sqlSelect, ['cita', user.region])

          demanda = await pool.query(sqlSelect, ['demanda', user.region])

          documentos = await pool.query(sqlSelect, ['documentos', user.region])

          orden = await pool.query(sqlSelect, ['orden', user.region])

          saldos = await pool.query(sqlSelect, ['saldos', user.region])

          tramite = await pool.query(sqlSelect, ['trámite', user.region])

          unificacion = await pool.query(sqlSelect, ['unificación', user.region])

          salud = await pool.query(sqlSelect, ['salud', user.region])

          vigente = await pool.query(sqlSelect, ['vigente', user.region])

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

          region = helpers.region(user.region)

          res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, zona, region })
        }

        else {
          const sqlSelect = "SELECT * FROM tramites WHERE region = ? AND  status = ? ORDER BY fecha_tramite DESC"

          customer = await pool.query(sqlSelect, [user.region, status])

          //helper que cambia el formato de fecha y moneda
          customer = helpers.formatterCustomers(customer)

          res.render('customer/list-customer.hbs', { customer, zona })
        }
      }

      //consulta administrador
      else {

        //valida el status pendiente
        if (status === 'pendiente') {
          sqlSelect = "SELECT * FROM tramites WHERE motivo = ?"

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

          res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, zona, region })
        }

        else {
          const sqlSelect = "SELECT * FROM tramites WHERE status = ? order by fecha_tramite DESC"
          customer = await pool.query(sqlSelect, [status])

          //helper que cambia el formato de fecha y moneda
          customer = helpers.formatterCustomers(customer)

          res.render('customer/list-customer.hbs', { customer, zona })
        }
      }
    }

    //Si select zona
    else {

      //al dar la zona no es necesario validar el permiso.
      //consulta regional
      if (user.permiso === "Regional") {
        //valida el status pendiente
        if (status === 'pendiente') {
          const sqlSelect = "SELECT * FROM tramites WHERE motivo = ? AND zona = ? AND region = ?"

          afore = await pool.query(sqlSelect, ['afore', zona, user.region])

          antigüedad = await pool.query(sqlSelect, ['antigüedad', zona, user.region])

          cobro = await pool.query(sqlSelect, ['cobro', zona, user.region])

          cita = await pool.query(sqlSelect, ['cita', zona, user.region])

          demanda = await pool.query(sqlSelect, ['demanda', zona, user.region])

          documentos = await pool.query(sqlSelect, ['documentos', zona, user.region])

          orden = await pool.query(sqlSelect, ['orden', zona, user.region])

          saldos = await pool.query(sqlSelect, ['saldos', zona, user.region])

          tramite = await pool.query(sqlSelect, ['trámite', zona, user.region])

          unificacion = await pool.query(sqlSelect, ['unificación', zona, user.region])

          vigente = await pool.query(sqlSelect, ['vigente', zona, user.region])

          salud = await pool.query(sqlSelect, ['salud', zona, user.region])

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

          res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, zona, region })
        }

        else {
          const sqlSelect = "SELECT * FROM tramites WHERE zona = ? AND  status = ? AND region = ? order by fecha_tramite DESC"
          customer = await pool.query(sqlSelect, [zona, status, user.region])

          //helper que cambia el formato de fecha y moneda
          customer = helpers.formatterCustomers(customer)

          res.render('customer/list-customer.hbs', { customer, zona })
        }
      }

      //consulta administrador
      if (status === 'pendiente') {
        const sqlSelect = "SELECT * FROM tramites WHERE motivo = ? AND zona = ?"

        afore = await pool.query(sqlSelect, ['afore', zona])

        antigüedad = await pool.query(sqlSelect, ['antigüedad', zona])

        cobro = await pool.query(sqlSelect, ['cobro', zona])

        cita = await pool.query(sqlSelect, ['cita', zona])

        demanda = await pool.query(sqlSelect, ['demanda', zona])

        documentos = await pool.query(sqlSelect, ['documentos', zona])

        orden = await pool.query(sqlSelect, ['orden', zona])

        saldos = await pool.query(sqlSelect, ['saldos', zona])

        tramite = await pool.query(sqlSelect, ['trámite', zona])

        unificacion = await pool.query(sqlSelect, ['unificación', zona])

        vigente = await pool.query(sqlSelect, ['vigente', zona])

        salud = await pool.query(sqlSelect, ['salud', zona])

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

        res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, zona, region })
      }

      else {
        const sqlSelect = "SELECT * FROM tramites WHERE zona = ? AND  status = ? order by fecha_tramite DESC"
        customer = await pool.query(sqlSelect, [zona, status])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, zona })
      }
    }
  }

  //*============ Consulta encargado
  else {

    //valida el status pendiente
    if (status === 'pendiente') {
      const sqlSelect = "SELECT * FROM tramites WHERE motivo = ? AND zona = ?"

      afore = await pool.query(sqlSelect, ['afore', user.zona])

      antigüedad = await pool.query(sqlSelect, ['antigüedad', , user.zona])

      cobro = await pool.query(sqlSelect, ['cobro', user.zona])

      cita = await pool.query(sqlSelect, ['cita', user.zona])

      demanda = await pool.query(sqlSelect, ['demanda', user.zona])

      documentos = await pool.query(sqlSelect, ['documentos', user.zona])

      orden = await pool.query(sqlSelect, ['orden', user.zona])

      saldos = await pool.query(sqlSelect, ['saldos', user.zona])

      tramite = await pool.query(sqlSelect, ['trámite', user.zona])

      unificacion = await pool.query(sqlSelect, ['unificación', user.zona])

      vigente = await pool.query(sqlSelect, ['vigente', user.zona])

      salud = await pool.query(sqlSelect, ['salud', user.zona])

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

      region = helpers.region(user.region)

      res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, region })
    }

    else {
      const sqlSelect = "SELECT * FROM tramites WHERE zona = ? AND  status = ? order by fecha_tramite DESC"
      customer = await pool.query(sqlSelect, [user.zona, status])

      //helper que cambia el formato de fecha y moneda
      customer = helpers.formatterCustomers(customer)

      res.render('customer/list-customer.hbs', { customer, zona })
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

            customer = await pool.query(sqlWeek, +"AND zona = ?", zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "30days":

            customer = await pool.query(sql30Days, +"AND zona = ?", zona)

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

//?=============== renderiza list-customer (status administrador)
// router.post('/pendientes-zona/:status', isLoggedIn, async (req, res) => {
//   //? Desestructurar para obtener valor para consulta
//   const { zona } = req.body
//   const { status } = req.params
//   const user = req.user

//   //valida el status pendiente renderiza desgloce pendientes
//   if (status === 'pendiente') {
//     const sqlSelect = "SELECT * FROM tramites WHERE motivo = ? AND zona = " + [zona]

//     afore = await pool.query(sqlSelect, 'afore')

//     antigüedad = await pool.query(sqlSelect, 'antigüedad')

//     cobro = await pool.query(sqlSelect, 'cobro')

//     cita = await pool.query(sqlSelect, 'cita')

//     demanda = await pool.query(sqlSelect, 'demanda')

//     documentos = await pool.query(sqlSelect, 'documentos')

//     orden = await pool.query(sqlSelect, 'orden')

//     saldos = await pool.query(sqlSelect, 'saldos')

//     tramite = await pool.query(sqlSelect, 'trámite')

//     unificacion = await pool.query(sqlSelect, 'unificación')

//     vigente = await pool.query(sqlSelect, 'vigente')

//     salud = await pool.query(sqlSelect, 'salud')

//     //objeto con status que se mandara a la vista
//     motivos = {
//       afore: afore.length,
//       antigüedad: antigüedad.length,
//       cobro: cobro.length,
//       cita: cita.length,
//       demanda: demanda.length,
//       documentos: documentos.length,
//       orden: orden.length,
//       tramite: tramite.length,
//       saldos: saldos.length,
//       unificacion: unificacion.length,
//       vigente: vigente.length,
//       salud: salud.length
//     }

//     //objeto con titulos de status
//     titulos = {
//       afore: 'afore',
//       antigüedad: 'antigüedad',
//       cobro: 'cobro',
//       cita: 'cita',
//       demanda: 'demanda',
//       documentos: 'documentos',
//       orden: 'orden',
//       saldos: 'saldos',
//       tramite: 'tramite',
//       unificacion: 'unificacion',
//       vigente: 'vigente',
//       salud: 'salud'
//     }

//     region = helpers.region(user.region)
//     res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, region })
//   }

//   else {

//     const sqlSelect = "SELECT * FROM tramites WHERE zona = ?" + " AND  status = ? order by fecha_tramite DESC"
//     customer = await pool.query(sqlSelect, [zona, status])

//     //helper que cambia el formato de fecha y moneda
//     customer = helpers.formatterCustomers(customer)

//     res.render('customer/list-customer.hbs', { customer, zona })
//   }
// })