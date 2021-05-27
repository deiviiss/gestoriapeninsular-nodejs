
const db = require('../database');
const helpers = require('../lib/handlebars');

controller = {};

//?========= renderiza resumen (status)
controller.getResume = async (req, res) => {
  const user = req.user

  const sqlNumWeek = 'SELECT WEEK(CURDATE()) AS total;'
  week = await db.query(sqlNumWeek)

  //*============ Consulta Regional
  if (user.permiso === 'Regional') {

    //consulta status de semana
    const sqlStatusWeek = 'SELECT status, COUNT(status) AS total FROM tramites WHERE region = ? AND WEEK(fecha_tramite) = WEEK(CURDATE()) AND YEAR(fecha_tramite) = YEAR(CURDATE()) GROUP BY status ORDER BY status;'

    const statusWeek = await db.query(sqlStatusWeek, user.region)

    //?suma los totales de altas
    let totalStatus = statusWeek.reduce((sum, value) => (typeof value.total == "number" ? sum + value.total : sum), 0);

    //consulta status
    const sqlStatus = 'SELECT status, COUNT(status) AS total FROM tramites WHERE region = ? GROUP BY status ORDER BY status;'

    const status = await db.query(sqlStatus, user.region)

    //get zonas
    const sqlZonas = 'SELECT zona FROM zonas WHERE region = ? ORDER BY zona;'
    const zonas = await db.query(sqlZonas, user.region)

    res.render('resume/resume.hbs', { status, user, zonas, week, statusWeek, totalStatus })
  }

  //*============ Consulta Administrador
  else if (user.permiso === 'Administrador') {

    //consulta status de semana
    const sqlStatusWeek = 'SELECT status, COUNT(status) AS total FROM tramites WHERE WEEK(fecha_tramite) = WEEK(CURDATE()) AND YEAR(fecha_tramite) = YEAR(CURDATE()) GROUP BY status ORDER BY status;'

    const statusWeek = await db.query(sqlStatusWeek)

    //?suma los totales de altas
    let totalStatus = statusWeek.reduce((sum, value) => (typeof value.total == "number" ? sum + value.total : sum), 0);

    //consulta status
    const sqlStatus = 'SELECT status, COUNT(status) AS total FROM tramites GROUP BY status ORDER BY status;'

    const status = await db.query(sqlStatus)

    //get zonas
    const sqlZonas = 'SELECT zona FROM zonas ORDER BY zona;'
    const zonas = await db.query(sqlZonas)

    res.render('resume/resume.hbs', { status, user, zonas, week, statusWeek, totalStatus })
  }

  //*============ Consulta encargado
  else {

    //consulta status de semana
    const sqlStatusWeek = 'SELECT status, COUNT(status) AS total FROM tramites WHERE zona = ? AND WEEK(fecha_tramite) = WEEK(CURDATE()) AND YEAR(fecha_tramite) = YEAR(CURDATE()) GROUP BY status ORDER BY status;'

    const statusWeek = await db.query(sqlStatusWeek, user.zona)

    //?suma los totales de altas
    let totalStatus = statusWeek.reduce((sum, value) => (typeof value.total == "number" ? sum + value.total : sum), 0);

    //consulta status
    const sqlStatus = 'SELECT status, COUNT(status) AS total FROM tramites WHERE zona = ? GROUP BY status ORDER BY status;'

    const status = await db.query(sqlStatus, user.zona)

    res.render('resume/resume.hbs', { status, user, week, statusWeek, totalStatus })
  }

};

//?========= renderiza resume (status administrador regional por zona 'busqueda zona')
controller.postResume = async (req, res) => {
  const user = req.user;
  const { zona } = req.body;

  const sqlNumWeek = 'SELECT WEEK(CURDATE()) AS total;'
  week = await db.query(sqlNumWeek)

  //*============ consulta de status week (administrador regional)
  const sqlStatusWeek = 'SELECT status, zona, COUNT(status) AS total FROM tramites WHERE zona = ? AND WEEK(fecha_tramite) = WEEK(CURDATE()) AND YEAR(fecha_tramite) = YEAR(CURDATE()) GROUP BY status ORDER BY status;'

  const statusWeek = await db.query(sqlStatusWeek, zona)

  //?suma los totales de altas
  let totalStatus = statusWeek.reduce((sum, value) => (typeof value.total == "number" ? sum + value.total : sum), 0);

  //*============ consulta de status (administrador regional)
  //consulta status
  const sqlStatus = 'SELECT status, zona, COUNT(status) AS total FROM tramites WHERE zona = ? GROUP BY status ORDER BY status;'

  const status = await db.query(sqlStatus, zona)

  if (user.permiso === 'Administrador') {
    //get zonas
    const sqlZonas = 'SELECT zona FROM zonas ORDER BY zona;'
    const zonas = await db.query(sqlZonas)

    res.render('resume/resume.hbs', { status, user, zonas, zona, week, totalStatus, statusWeek })
  }

  else {
    //get zonas
    const sqlZonas = 'SELECT zona FROM zonas WHERE region = ? ORDER BY zona;'
    const zonas = await db.query(sqlZonas, user.region)

    res.render('resume/resume.hbs', { status, user, zonas, zona, week, totalStatus, statusWeek })
  }
};

//?========= renderiza list-customer (status except 'pendiente')
controller.getStatus = async (req, res) => {
  const user = req.user
  const { status } = req.params
  const zona = req.query.zona

  //consultas a la BD
  const sqlWeek = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 14 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND status = 'Pendiente'"
  const sql30Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 31 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND status = 'Pendiente'"
  const sql60Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 61 DAY) AND fecha_tramite >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) AND status = 'Pendiente'"
  const sqlMore60Days = "SELECT * FROM tramites WHERE fecha_tramite <= DATE_SUB(curdate(), INTERVAL 91 DAY) AND status = 'Pendiente'"

  //si select zona
  if (zona) {

    //*Regional
    if (user.permiso === "Regional") {
      //valida el status pendiente
      if (status === 'Pendiente') {

        //consulta motivos
        const sqlMotivos = 'SELECT motivo, zona, COUNT(motivo) AS total FROM tramites WHERE motivo IS NOT NULL AND zona = ? AND region = ? GROUP BY motivo ORDER BY motivo;'

        const motivos = await db.query(sqlMotivos, [zona, user.region])

        pendientesWeek = await db.query(sqlWeek + "AND zona = ? AND region= ?", [zona, user.region])
        pendientes30Days = await db.query(sql30Days + "AND zona = ? AND region= ?", [zona, user.region])
        pendientes60Days = await db.query(sql60Days + "AND zona = ? AND region= ?", [zona, user.region])
        pendientesMore60Days = await db.query(sqlMore60Days + "AND zona = ? AND region= ?", [zona, user.region])

        //objeto con cantidad de pendientes que se mandara a la vista
        cantidadPendientes = {
          pendientesWeek: pendientesWeek.length,
          pendientes30Days: pendientes30Days.length,
          pendientes60Days: pendientes60Days.length,
          pendientesMore60Days: pendientesMore60Days.length
        }

        //get zonas
        const sqlZonas = 'SELECT zona FROM zonas WHERE region = ? ORDER BY zona;'
        const zonas = await db.query(sqlZonas, user.region)

        res.render('resume/motivos.hbs', { motivos, user, zona, zonas, cantidadPendientes })
      }
      else {
        const sqlStatus = "SELECT * FROM tramites WHERE zona = ? AND  status = ? AND region = ? ORDER BY fecha_tramite DESC"
        customer = await db.query(sqlStatus, [zona, status, user.region])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, zona })
      }
    }

    //*Administrador
    else if (user.permiso === "Administrador") {
      //consulta administrador
      if (status === 'Pendiente') {

        //Consulta motivos
        const sqlMotivos = 'SELECT motivo, zona, COUNT(motivo) AS total FROM tramites WHERE motivo IS NOT NULL AND zona = ? GROUP BY motivo ORDER BY motivo;'

        const motivos = await db.query(sqlMotivos, zona)

        //Consulta cantidad de pendientes por días de atraso
        pendientesWeek = await db.query(sqlWeek + "AND zona = ?", zona)
        pendientes30Days = await db.query(sql30Days + "AND zona = ?", zona)
        pendientes60Days = await db.query(sql60Days + "AND zona = ?", zona)
        pendientesMore60Days = await db.query(sqlMore60Days + "AND zona = ?", zona)

        //objeto con cantidad de pendientes que se mandara a la vista
        cantidadPendientes = {
          pendientesWeek: pendientesWeek.length,
          pendientes30Days: pendientes30Days.length,
          pendientes60Days: pendientes60Days.length,
          pendientesMore60Days: pendientesMore60Days.length
        }

        //get zonas
        const sqlZonas = 'SELECT zona FROM zonas ORDER BY zona;'
        const zonas = await db.query(sqlZonas)

        res.render('resume/motivos.hbs', { motivos, user, zona, zonas, cantidadPendientes })
      }

      else {
        const sqlStatus = "SELECT * FROM tramites WHERE zona = ? AND  status = ? ORDER BY fecha_tramite DESC"
        customer = await db.query(sqlStatus, [zona, status])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, zona })
      }
    }

    //*Encargado
    else {
      res.redirect('/profile')
    }
  }

  //si select zona NULL
  else {

    if (user.permiso === "Regional") {
      //valida el status pendiente
      if (status === 'Pendiente') {

        //consulta motivos
        const sqlMotivos = 'SELECT motivo, COUNT(motivo) AS total FROM tramites WHERE motivo IS NOT NULL AND region = ? GROUP BY motivo ORDER BY motivo;'

        const motivos = await db.query(sqlMotivos, [user.region])

        //Consulta cantidad de pendientes por días de atraso
        pendientesWeek = await db.query(sqlWeek + "AND region= ?", user.region)
        pendientes30Days = await db.query(sql30Days + "AND region= ?", user.region)
        pendientes60Days = await db.query(sql60Days + "AND region= ?", user.region)
        pendientesMore60Days = await db.query(sqlMore60Days + "AND region= ?", user.region)

        //objeto con cantidad de pendientes que se mandara a la vista
        cantidadPendientes = {
          pendientesWeek: pendientesWeek.length,
          pendientes30Days: pendientes30Days.length,
          pendientes60Days: pendientes60Days.length,
          pendientesMore60Days: pendientesMore60Days.length
        }

        //get zonas
        const sqlZonas = 'SELECT zona FROM zonas WHERE region = ? ORDER BY zona;'
        const zonas = await db.query(sqlZonas, user.region)

        res.render('resume/motivos.hbs', { motivos, user, zona, zonas, cantidadPendientes })
      }

      else {
        const sqlStatus = "SELECT * FROM tramites WHERE region = ? AND  status = ? ORDER BY fecha_tramite DESC"

        customer = await db.query(sqlStatus, [user.region, status])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, zona })
      }
    }

    else if (user.permiso === "Administrador") {
      //valida el status pendiente
      if (status === 'Pendiente') {

        //consulta motivos
        const sqlMotivos = 'SELECT motivo, COUNT(motivo) AS total FROM tramites WHERE motivo IS NOT NULL GROUP BY motivo ORDER BY motivo;'

        const motivos = await db.query(sqlMotivos)

        //Consulta cantidad de pendientes por días de atraso
        pendientesWeek = await db.query(sqlWeek)
        pendientes30Days = await db.query(sql30Days)
        pendientes60Days = await db.query(sql60Days)
        pendientesMore60Days = await db.query(sqlMore60Days)

        //objeto con cantidad de pendientes que se mandara a la vista
        cantidadPendientes = {
          pendientesWeek: pendientesWeek.length,
          pendientes30Days: pendientes30Days.length,
          pendientes60Days: pendientes60Days.length,
          pendientesMore60Days: pendientesMore60Days.length
        }

        //get zonas
        const sqlZonas = 'SELECT zona FROM zonas;'
        const zonas = await db.query(sqlZonas)

        res.render('resume/motivos.hbs', { motivos, user, zona, zonas, cantidadPendientes })
      }

      else {
        const sqlStatus = "SELECT * FROM tramites WHERE status = ? order by fecha_tramite DESC"
        customer = await db.query(sqlStatus, [status])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, zona })
      }
    }

    //* Encargado
    else {
      //valida el status pendiente
      if (status === 'Pendiente') {

        //consulta motivos
        const sqlMotivos = 'SELECT motivo, COUNT(motivo) AS total FROM tramites WHERE motivo IS NOT NULL AND zona = ? GROUP BY motivo ORDER BY motivo;'

        const motivos = await db.query(sqlMotivos, [user.zona])

        //Consulta cantidad de pendientes por días de atraso
        pendientesWeek = await db.query(sqlWeek + "AND zona = ?", user.zona)
        pendientes30Days = await db.query(sql30Days + "AND zona = ?", user.zona)
        pendientes60Days = await db.query(sql60Days + "AND zona = ?", user.zona)
        pendientesMore60Days = await db.query(sqlMore60Days + "AND zona = ?", user.zona)

        //objeto con cantidad de pendientes que se mandara a la vista
        cantidadPendientes = {
          pendientesWeek: pendientesWeek.length,
          pendientes30Days: pendientes30Days.length,
          pendientes60Days: pendientes60Days.length,
          pendientesMore60Days: pendientesMore60Days.length
        }

        res.render('resume/motivos.hbs', { motivos, user, zona, cantidadPendientes })
      }

      else {
        const sqlStatus = "SELECT * FROM tramites WHERE zona = ? AND  status = ? order by fecha_tramite DESC"
        customer = await db.query(sqlStatus, [user.zona, status])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, zona })
      }
    }
  }
};

//?========= renderiza list-customer (motivos)
controller.getMotivo = async (req, res) => {
  const { motivo } = req.params
  const user = req.user
  const zona = req.query.zona

  //*============ Consulta Administrador-Regional
  if (user.permiso === 'Regional' || user.permiso === 'Administrador') {

    //Si select zona
    if (zona) {
      const sqlSelect = "SELECT * FROM tramites WHERE zona = ? AND  motivo = ? order by fecha_tramite DESC"
      customer = await db.query(sqlSelect, [zona, motivo])

      //helper que cambia el formato de fecha y moneda
      customer = helpers.formatterCustomers(customer)

      res.render('customer/list-customer.hbs', { customer, motivo, zona, week })
    }

    //Si select zona NULL
    else {

      if (user.permiso === 'Regional') {
        const sqlSelect = "SELECT * FROM tramites WHERE region = ? AND  motivo = ? order by fecha_tramite DESC"
        customer = await db.query(sqlSelect, [user.region, motivo])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, motivo, zona })
      }

      else {
        const sqlSelect = "SELECT * FROM tramites WHERE motivo = ? order by fecha_tramite DESC"
        customer = await db.query(sqlSelect, [motivo])

        //helper que cambia el formato de fecha y moneda
        customer = helpers.formatterCustomers(customer)

        res.render('customer/list-customer.hbs', { customer, motivo, zona })
      }
    }
  }

  //*============ Consulta Encargado
  else {
    const sqlSelect = "SELECT * FROM tramites WHERE zona = ? AND  motivo = ? order by fecha_tramite DESC"
    customer = await db.query(sqlSelect, [user.zona, motivo])

    //helper que cambia el formato de fecha y moneda
    customer = helpers.formatterCustomers(customer)

    res.render('customer/list-customer.hbs', { customer, motivo, zona })
  }
};

//?========= renderiza list-customer (status week)
controller.getStatusWeek = async (req, res) => {
  const user = req.user
  const { status } = req.params
  const zona = req.query.zona

  //si select zona
  if (zona) {

    //*Regional
    if (user.permiso === "Regional") {
      const sqlStatus = "SELECT * FROM tramites WHERE zona = ? AND  status = ? AND region = ? AND WEEK(fecha_tramite) = WEEK(CURDATE()) AND YEAR(fecha_tramite) = YEAR(CURDATE()) GROUP BY status ORDER BY status;"
      customer = await db.query(sqlStatus, [zona, status, user.region])

      //helper que cambia el formato de fecha y moneda
      customer = helpers.formatterCustomers(customer)

      res.render('customer/list-customer.hbs', { customer, zona })
    }

    //*Administrador
    else if (user.permiso === "Administrador") {

      const sqlStatus = "SELECT * FROM tramites WHERE zona = ? AND  status = ? AND WEEK(fecha_tramite) = WEEK(CURDATE()) AND YEAR(fecha_tramite) = YEAR(CURDATE()) GROUP BY status ORDER BY status;"
      customer = await db.query(sqlStatus, [zona, status])

      //helper que cambia el formato de fecha y moneda
      customer = helpers.formatterCustomers(customer)

      res.render('customer/list-customer.hbs', { customer, zona })
    }

    //*Encargado
    else {
      res.redirect('/profile')
    }
  }

  //si select zona NULL
  else {

    if (user.permiso === "Regional") {

      const sqlStatus = "SELECT * FROM tramites WHERE region = ? AND  status = ?  AND WEEK(fecha_tramite) = WEEK(CURDATE()) AND YEAR(fecha_tramite) = YEAR(CURDATE());"

      customer = await db.query(sqlStatus, [user.region, status])

      //helper que cambia el formato de fecha y moneda
      customer = helpers.formatterCustomers(customer)

      res.render('customer/list-customer.hbs', { customer, zona })
    }

    else if (user.permiso === "Administrador") {

      const sqlStatus = "SELECT * FROM tramites WHERE status = ? AND WEEK(fecha_tramite) = WEEK(CURDATE()) AND YEAR(fecha_tramite) = YEAR(CURDATE());"
      customer = await db.query(sqlStatus, [status])

      //helper que cambia el formato de fecha y moneda
      customer = helpers.formatterCustomers(customer)

      res.render('customer/list-customer.hbs', { customer, zona })
    }

    //* Encargado
    else {

      const sqlStatus = "SELECT * FROM tramites WHERE zona = ? AND  status = ? AND WEEK(fecha_tramite) = WEEK(CURDATE()) AND YEAR(fecha_tramite) = YEAR(CURDATE());"
      customer = await db.query(sqlStatus, [user.zona, status])

      //helper que cambia el formato de fecha y moneda
      customer = helpers.formatterCustomers(customer)

      res.render('customer/list-customer.hbs', { customer, zona })
    }
  }
}

//?========= renderiza list-customer (pendientes por semana, 30 & 60 days)
controller.getGroup = async (req, res) => {
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

            customer = await db.query(sqlWeek + "AND region = ? AND zona = ?", [user.region, zona])

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "30days":

            customer = await db.query(sql30Days + "AND region = ? AND zona = ?", [user.region, zona])

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "60days":

            customer = await db.query(sql60Days + "AND region = ? AND zona = ?", [user.region, zona])

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "more60days":

            customer = await db.query(sqlMore60Days + "AND region = ? AND zona = ?", [user.region, zona])

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;
        }
        break;

      case "Administrador":

        switch (sqlQuery) {

          case "week":

            customer = await db.query(sqlWeek + "AND zona = ?", zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "30days":

            customer = await db.query(sql30Days + "AND zona = ?", zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "60days":

            customer = await db.query(sql60Days + "AND zona = ?", zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "more60days":

            customer = await db.query(sqlMore60Days + "AND zona = ?", zona)

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

            customer = await db.query(sqlWeek + "AND region= ?", user.region)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "30days":

            customer = await db.query(sql30Days + "AND region= ?", user.region)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "60days":

            customer = await db.query(sql60Days + "AND region= ?", user.region)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "more60days":

            customer = await db.query(sqlMore60Days + "AND region= ?", user.region)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;
        }
        break;

      case "Administrador":

        switch (sqlQuery) {

          case "week":

            customer = await db.query(sqlWeek)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "30days":

            customer = await db.query(sql30Days)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "60days":

            customer = await db.query(sql60Days)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "more60days":

            customer = await db.query(sqlMore60Days)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;
        }
        break;

      case "Encargado":
        switch (sqlQuery) {

          case "week":

            customer = await db.query(sqlWeek + "AND zona= ?", user.zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "30days":

            customer = await db.query(sql30Days + "AND zona= ?", user.zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "60days":

            customer = await db.query(sql60Days + "AND zona= ?", user.zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;

          case "more60days":

            customer = await db.query(sqlMore60Days + "AND zona= ?", user.zona)

            customer = helpers.formatterCustomers(customer)

            res.render('customer/list-customer.hbs', { customer, zona })
            break;
        }
        break;
    }
  }
};

module.exports = controller;