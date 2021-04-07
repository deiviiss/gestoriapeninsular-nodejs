//muestra la relación de trámites

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/handlebars')

// routes

//?=============== renderizar resumen (status)
router.get('/resume', isLoggedIn, async (req, res) => {
  const user = req.user

  const sqlSelect = "SELECT * FROM tramites WHERE status= ?"

  //todo mejorar Está consulta customers = await pool.query("SELECT status, COUNT(*) as total FROM tramites WHERE zona like '%" + [req.user.zona] + "%'GROUP BY status")

  //*Consulta Regional
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
  }

  //*Consulta Administrador
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
  }

  //*Consulta encargado
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

  region = helpers.region(user.region)

  res.render('resume/resume.hbs', { status, user, titulos, region })
})

//?=============== renderiza resume (status administrador)
router.post('/resume-zona/', isLoggedIn, async (req, res) => {
  const user = req.user
  const { zona } = req.body

  const sqlSelect = "SELECT * FROM tramites WHERE status= ?"

  //* consulta de status (administrador)
  aclaraciones = await pool.query(sqlSelect + "AND zona = ?", ['aclaración', zona])

  asegurados = await pool.query(sqlSelect + "AND zona = ?", ['asegurado', zona])

  bajas = await pool.query(sqlSelect + "AND zona = ?", ['baja', zona])

  espera = await pool.query(sqlSelect + "AND zona = ?", ['en espera', zona])

  fallidos = await pool.query(sqlSelect + "AND zona = ?", ['fallido', zona])

  finalizados = await pool.query(sqlSelect + "AND zona = ?", ['finalizado', zona])

  juridico = await pool.query(sqlSelect + "AND zona = ?", ['jurídico', zona])

  pendientes = await pool.query(sqlSelect + "AND zona = ?", ['pendiente', zona])

  liquidar = await pool.query(sqlSelect + "AND zona = ?", ['liquidar', zona])

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

  res.render('resume/resume.hbs', { status, user, titulos, zona, region });
})

//?=============== renderiza list-customer (status)
router.get('/resume/:status', isLoggedIn, async (req, res) => {
  const user = req.user
  const { status } = req.params
  const zona = req.query.zona

  //* Consulta por region-administrador.
  if (user.permiso === "Regional" || user.permiso === "Administrador") {

    //Si select zona NULL
    if (zona === "") {

      //consulta regional
      if (user.permiso === "Regional") {

        //valida el status pendiente
        if (status === 'pendiente') {
          const sqlSelect = "SELECT * FROM tramites WHERE pendiente = ? AND region = ?"

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
            unificacion: 'unificacion',
            actualizar: 'Actualizar'
          }

          region = helpers.region(user.region)

          res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, zona, region })
        }

        else {
          const sqlSelect = "SELECT * FROM tramites WHERE region = ? AND  status = ? ORDER BY fecha_tramite DESC"
          customer = await pool.query(sqlSelect, [user.region, status])

          //helper que cambia el formato de fecha y moneda
          customer = helpers.formatterCustomers(customer)

          res.render('customer/list-customer.hbs', { customer })
        }
      }

      //consulta administrador
      else {

        //valida el status pendiente
        if (status === 'pendiente') {
          sqlSelect = "SELECT * FROM tramites WHERE pendiente = ?"

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

          //! Puede ser una consulta a la base
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

          //get zonas
          region = helpers.region(user.region)

          res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, zona, region })
        }

        else {
          const sqlSelect = "SELECT * FROM tramites WHERE status = ? order by fecha_tramite DESC"
          customer = await pool.query(sqlSelect, [status])

          //helper que cambia el formato de fecha y moneda
          customer = helpers.formatterCustomers(customer)

          res.render('customer/list-customer.hbs', { customer })
        }
      }
    }

    //Si select zona
    else {

      //valida el status pendiente
      if (status === 'pendiente') {
        const sqlSelect = "SELECT * FROM tramites WHERE pendiente = ? AND zona = ?"

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

        //get zonas
        region = helpers.region(user.region)

        res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, zona, region })
      }

      else {
        const sqlSelect = "SELECT * FROM tramites WHERE zona = ? AND  status = ? order by fecha_tramite DESC"
        customer = await pool.query(sqlSelect, [zona, status])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer })
      }
    }
  }

  //* Consulta por zona (encargado)
  else {

    //valida el status pendiente
    if (status === 'pendiente') {
      const sqlSelect = "SELECT * FROM tramites WHERE pendiente = ? AND zona = ?"

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

      region = helpers.region(user.region)

      res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, region })
    }

    else {
      const sqlSelect = "SELECT * FROM tramites WHERE zona = ? AND  status = ? order by fecha_tramite DESC"
      customer = await pool.query(sqlSelect, [user.zona, status])

      //helper que cambia el formato de fecha y moneda
      customer = helpers.formatterCustomers(customer)

      res.render('customer/list-customer.hbs', { customer })
    }
  }
})

//?=============== renderiza list-customer (motivos)
router.get('/desgloce-pendientes/:motivo', isLoggedIn, async (req, res) => {
  const { motivo } = req.params
  const user = req.user
  const zona = req.query.zona

  //*Consulta Administrador-Regional descendente
  if (user.permiso === 'Regional' || user.permiso === 'Administrador') {

    //Si select zona none
    if (zona === "") {

      if (user.permiso === 'Regional') {
        const sqlSelect = "SELECT * FROM tramites WHERE region = ? AND  pendiente = ? order by fecha_tramite DESC"
        customer = await pool.query(sqlSelect, [user.region, motivo])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, motivo, zona })
      }

      else {
        const sqlSelect = "SELECT * FROM tramites WHERE pendiente = ? order by fecha_tramite DESC"
        customer = await pool.query(sqlSelect, [motivo])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, motivo, zona })
      }
    }

    //Si select zona
    else {
      const sqlSelect = "SELECT * FROM tramites WHERE zona = ?" + " AND  pendiente = ? order by fecha_tramite DESC"
      customer = await pool.query(sqlSelect, [zona, motivo])

      //helper que cambia el formato de fecha y moneda
      customer = helpers.formatterCustomers(customer)

      res.render('customer/list-customer.hbs', { customer, motivo, zona })
    }
  }

  //*Consulta Encargado descendente
  else {
    const sqlSelect = "SELECT * FROM tramites WHERE zona = ?" + " AND  pendiente = ? order by fecha_tramite DESC"
    customer = await pool.query(sqlSelect, [user.zona, motivo])

    //helper que cambia el formato de fecha y moneda
    customer = helpers.formatterCustomers(customer)

    res.render('customer/list-customer.hbs', { customer, motivo, zona })
  }
})

//?=============== renderiza list-customer (status administrador)
router.post('/pendientes-zona/:status', isLoggedIn, async (req, res) => {
  //? Desestructurar para obtener valor para consulta
  const { zona } = req.body
  const { status } = req.params
  const user = req.user

  //valida el status pendiente renderiza desgloce pendientes
  if (status === 'pendiente') {
    const sqlSelect = "SELECT * FROM tramites WHERE pendiente = ? AND zona = " + [zona]
    //! Sustituir con la consulta
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

    region = helpers.region(user.region)
    res.render('resume/desgloce-pendientes.hbs', { motivos, user, titulos, region })
  }

  else {

    const sqlSelect = "SELECT * FROM tramites WHERE zona = ?" + " AND  status = ? order by fecha_tramite DESC"
    customer = await pool.query(sqlSelect, [zona, status])

    //helper que cambia el formato de fecha y moneda
    customer = helpers.formatterCustomers(customer)

    res.render('customer/list-customer.hbs', { customer, zona })
  }
})

module.exports = router;