//Ingresar clientes por tablas

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas
const helpers = require('../lib/handlebars');

const db = require('../database');
const { isLoggedIn } = require('../lib/auth');

//* Lista altas
//envia lista
router.get('/list-altas', isLoggedIn, async (req, res) => {
  const user = req.user;

  if (user.permiso === "Administrador") {

    const sqlCustomer = 'SELECT p.id_pre_altas, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.curp, p.nss, p.rfc, p.umf, p.scotizadas, p.sdescontadas, a.asesor, p.fecha_ultimo_retiro, af.afore, p.monto, p.direccion, p.lugar, p.telefono, p.sexo, p.observaciones, z.zona, p.fecha_captura, p.capturado FROM pre_altas AS p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN afores AS af ON af.id_afore = p.id_afore JOIN zonas AS z ON z.id_zona = p.id_zona ORDER BY p.fecha_captura ASC;'

    const customer = await db.query(sqlCustomer)

    //helper que cambia el formato de fecha y moneda
    helpers.formatterCustomers(customer)

    //Para input de busqueda por zona
    region = helpers.region(user.region)

    res.render('altas/list-altas.hbs', { customer, user, region })
  }

  else if (user.permiso === "Regional") {
    const sqlCustomer = 'SELECT p.id_pre_altas, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.curp, p.nss, p.rfc, p.umf, p.scotizadas, p.sdescontadas, a.asesor, p.fecha_ultimo_retiro, af.afore, p.monto, p.direccion, p.lugar, p.telefono, p.sexo, p.observaciones, z.zona, p.fecha_captura, p.capturado FROM pre_altas AS p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN afores AS af ON af.id_afore = p.id_afore JOIN zonas AS z ON z.id_zona = p.id_zona WHERE p.region = ? ORDER BY p.fecha_captura ASC;'

    const customer = await db.query(sqlCustomer, user.region)

    //Para input de busqueda por zona
    region = helpers.region(user.region)

    //helper que cambia el formato de fecha y moneda
    helpers.formatterCustomers(customer)

    res.render('altas/list-altas.hbs', { customer, user, region })
  }

  //*Encargado
  else {

    const sqlCustomer = 'SELECT p.id_pre_altas, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.curp, p.nss, p.rfc, p.umf, p.scotizadas, p.sdescontadas, a.asesor, p.fecha_ultimo_retiro, af.afore, p.monto, p.direccion, p.lugar, p.telefono, p.sexo, p.observaciones, z.zona, p.fecha_captura, p.capturado FROM pre_altas AS p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN afores AS af ON af.id_afore = p.id_afore JOIN zonas AS z ON z.id_zona = p.id_zona WHERE z.zona = ? ORDER BY p.fecha_captura ASC;'

    const customer = await db.query(sqlCustomer, user.zona)

    const sqlResume = 'SELECT altas.fecha_captura, zonas.zona, count(zona) AS total FROM pre_altas AS altas JOIN zonas as zonas ON zonas.id_zona = altas.id_zona WHERE zona = ? GROUP BY zona;'

    const resume = await db.query(sqlResume, user.zona)

    //?suma los totales de altas
    let totalResume = resume.reduce((sum, value) => (typeof value.total == "number" ? sum + value.total : sum), 0);

    //helper que cambia el formato de fecha y moneda
    helpers.formatterCustomers(customer)

    res.render('altas/list-altas.hbs', { customer, user, totalResume })
  }
});

//envia lista con select zona
router.post('/list-altas', isLoggedIn, async (req, res) => {
  const user = req.user;
  const { zona } = req.body;

  if (user.permiso === "Administrador") {

    const sqlCustomer = 'SELECT p.id_pre_altas, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.curp, p.nss, p.rfc, p.umf, p.scotizadas, p.sdescontadas, a.asesor, p.fecha_ultimo_retiro, af.afore, p.monto, p.direccion, p.lugar, p.telefono, p.sexo, p.observaciones, z.zona, p.fecha_captura, p.capturado FROM pre_altas AS p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN afores AS af ON af.id_afore = p.id_afore JOIN zonas AS z ON z.id_zona = p.id_zona WHERE zona = ? ORDER BY p.fecha_captura ASC;'

    const customer = await db.query(sqlCustomer, zona)

    //Para input de busqueda por zona
    region = helpers.region(user.region)

    //helper que cambia el formato de fecha y moneda
    helpers.formatterCustomers(customer)

    res.render('altas/list-altas.hbs', { customer, user, region })
  }

  else {
    const sqlCustomer = 'SELECT p.id_pre_altas, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.curp, p.nss, p.rfc, p.umf, p.scotizadas, p.sdescontadas, a.asesor, p.fecha_ultimo_retiro, af.afore, p.monto, p.direccion, p.lugar, p.telefono, p.sexo, p.observaciones, z.zona, p.fecha_captura, p.capturado FROM pre_altas AS p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN afores AS af ON af.id_afore = p.id_afore JOIN zonas AS z ON z.id_zona = p.id_zona WHERE p.region = ? AND zona = ? ORDER BY p.fecha_captura ASC;'

    const customer = await db.query(sqlCustomer, [user.region, zona])

    //Para input de busqueda por zona
    region = helpers.region(user.region)

    //helper que cambia el formato de fecha y moneda
    helpers.formatterCustomers(customer)

    res.render('altas/list-altas.hbs', { customer, user, region })
  }
});

//* Agregar cliente
//envia formulario para captura
router.get('/add-customer', isLoggedIn, async (req, res) => {
  const { zona } = req.user

  // Consulta asesores
  const sqlAsesor = "SELECT a.asesor, a.status, r.region, z.zona FROM regiones AS r JOIN asesores AS a ON r.asesores_id_asesor = a.id_asesor JOIN zonas AS z ON r.zonas_id_zona = z.id_zona WHERE z.zona = ? AND a.status = 'Activo'"
  const asesoresZona = await db.query(sqlAsesor, zona)

  //Consulta afores
  const sqlAfore = "SELECT * FROM afores"
  const afores = await db.query(sqlAfore)

  res.render('altas/add-customer.hbs', { asesoresZona, afores })
});

//recibe formulario de captura
router.post('/add-customer', isLoggedIn, async (req, res) => {
  const user = req.user
  const fechaActual = new Date()
  const region = helpers.zona(user.zona)

  // Objeto del formulario
  let { nombre, apellidoPaterno, apellidoMaterno, curp, nss, rfc, umf, scotizadas, sdescontadas, asesor, fecha_ultimo_retiro, afore, monto, direccion, lugar, telefono, sexo, observaciones } = req.body;

  //? Get valores de tablas (asesores, afores, zonas)
  const sqlAsesor = "SELECT asesor, id_asesor FROM asesores WHERE asesor = ?;"
  const rowAsesor = await db.query(sqlAsesor, asesor)
  const asesor_id = rowAsesor[0].id_asesor

  const sqlAfore = "SELECT afore, id_afore FROM afores WHERE afore = ?;"
  const rowAfore = await db.query(sqlAfore, afore)
  const afore_id = rowAfore[0].id_afore

  const sqlZona = "SELECT zona, id_zona FROM zonas WHERE zona = ?;"
  const rowZona = await db.query(sqlZona, user.zona)
  const zona_id = rowZona[0].id_zona

  // const sqlStatus = "SELECT status, id_status FROM status WHERE status = 'En espera';"
  // const rowStatus = await db.query(sqlStatus)
  // const status_id = rowStatus[0].id_status

  // const sqlOutsourcing = "SELECT outsourcing, id_outsourcing FROM outsourcing WHERE outsourcing = 'Homero';"
  // const rowOutsourcing = await db.query(sqlOutsourcing)
  // const outsourcing_id = rowOutsourcing[0].id_outsourcing

  if (sdescontadas == 0) {
    fecha_ultimo_retiro = null
  }

  const newCliente = {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    curp,
    nss,
    rfc,
    umf,
    scotizadas,
    sdescontadas,
    id_asesor: asesor_id,
    fecha_ultimo_retiro,
    id_afore: afore_id,
    monto,
    direccion,
    lugar,
    telefono,
    sexo,
    observaciones,
    id_zona: zona_id,
    fecha_captura: fechaActual,
    capturado: user.fullname,
    region: region

    // sueldo_base: monto / 30,
    // outsourcing_id_outsourcing: outsourcing_id,
    // status_id_status: status_id,
  };

  const sqlAlta = "INSERT INTO pre_altas set ?"
  await db.query(sqlAlta, [newCliente])

  req.flash('success', 'Cliente guardado')
  res.redirect('/add-customer')
});

//* Edita altas
//envia formulario para editar
router.get('/altas/edit-altas/:id_pre_altas', isLoggedIn, async (req, res) => {
  const { id_pre_altas } = req.params

  const sqlAlta = 'SELECT p.id_pre_altas, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.curp, p.nss, p.rfc, p.umf, p.scotizadas, p.sdescontadas, a.asesor, p.fecha_ultimo_retiro, af.afore, p.monto, p.direccion, p.lugar, p.telefono, p.sexo, p.observaciones, z.zona, p.fecha_captura, p.capturado FROM pre_altas AS p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN afores AS af ON af.id_afore = p.id_afore JOIN zonas AS z ON z.id_zona = p.id_zona WHERE p.id_pre_altas = ?; '

  customer = await db.query(sqlAlta, [id_pre_altas])

  //Consulta afores
  const sqlAfore = "SELECT * FROM afores"
  const afores = await db.query(sqlAfore)

  // Consulta asesores
  const sqlAsesor = "SELECT a.asesor, r.region, z.zona FROM regiones AS r JOIN asesores AS a ON r.asesores_id_asesor = a.id_asesor JOIN zonas AS z ON r.zonas_id_zona = z.id_zona WHERE z.zona = ?"
  const asesoresZona = await db.query(sqlAsesor, customer[0].zona)

  //formato a customer (fecha)
  helpers.formatterEditAlta(customer)

  res.render('altas/edit-alta', { customer: customer[0], asesoresZona, afores })
});

//recibe formulario editado
router.post('/altas/edit-altas/:id_pre_altas', isLoggedIn, async (req, res) => {
  const customer_id = req.params.id_pre_altas;
  const fechaActual = new Date()
  const user = req.user;

  // Objeto del formulario
  let { nombre, apellidoPaterno, apellidoMaterno, curp, nss, rfc, umf, scotizadas, sdescontadas, asesor, fecha_ultimo_retiro, afore, monto, direccion, lugar, telefono, sexo, observaciones } = req.body;

  //? Get valores de tablas (asesores, afores, zonas)
  const sqlAsesor = "SELECT asesor, id_asesor FROM asesores WHERE asesor = ?;"
  const rowAsesor = await db.query(sqlAsesor, asesor)
  const asesor_id = rowAsesor[0].id_asesor

  const sqlAfore = "SELECT afore, id_afore FROM afores WHERE afore = ?;"
  const rowAfore = await db.query(sqlAfore, afore)
  const afore_id = rowAfore[0].id_afore

  const sqlZona = "SELECT zona, id_zona FROM zonas WHERE zona = ?;"
  const rowZona = await db.query(sqlZona, user.zona)
  const zona_id = rowZona[0].id_zona

  if (sdescontadas == 0) {
    fecha_ultimo_retiro = null
  }

  const updateCliente = {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    curp,
    nss,
    rfc,
    umf,
    scotizadas,
    sdescontadas,
    id_asesor: asesor_id,
    fecha_ultimo_retiro,
    id_afore: afore_id,
    monto,
    direccion,
    lugar,
    telefono,
    sexo,
    observaciones,
    id_zona: zona_id,
    fecha_captura: fechaActual,
    capturado: user.fullname,

    // sueldo_base: monto / 30,
    // outsourcing_id_outsourcing: outsourcing_id,
    // status_id_status: status_id,
  };

  const sqlUpdateAlta = "UPDATE pre_altas set ? WHERE id_pre_altas = ?"
  await db.query(sqlUpdateAlta, [updateCliente, customer_id])

  req.flash('success', 'Cliente actualizado')
  res.redirect('/list-altas')
});

//*Resume altas
router.get('/resume-altas', isLoggedIn, async (req, res) => {
  const user = req.user;

  //*Resumen Administrador
  if (user.permiso === 'Administrador') {
    const sqlAltas = 'SELECT altas.fecha_captura, zonas.zona, count(zona) AS total FROM pre_altas AS altas JOIN zonas as zonas ON zonas.id_zona = altas.id_zona GROUP BY zona ORDER BY altas.fecha_captura ASC;'

    const resume = await db.query(sqlAltas)

    //?suma los totales de altas
    let totalResume = resume.reduce((sum, value) => (typeof value.total == "number" ? sum + value.total : sum), 0);

    //? número de semana con base a la primera captura
    const sqlWeek = "SELECT WEEK(?) AS total"
    week = await db.query(sqlWeek, resume[0].fecha_captura)

    res.render('altas/resume-altas.hbs', { resume, week, totalResume })
  }
  //*Resumen Regional
  else if (user.permiso === "Regional") {
    const sqlAltas = 'SELECT altas.fecha_captura, zonas.zona, count(zona) AS total FROM pre_altas AS altas JOIN zonas as zonas ON zonas.id_zona = altas.id_zona WHERE region = ? GROUP BY zona;'

    const resume = await db.query(sqlAltas, user.region)

    //?suma los totales de altas
    let totalResume = resume.reduce((sum, value) => (typeof value.total == "number" ? sum + value.total : sum), 0);

    //? número de semana con base a la primera captura
    const sqlWeek = "SELECT WEEK(?) AS total"
    week = await db.query(sqlWeek, resume[0].fecha_captura)

    res.render('altas/resume-altas.hbs', { resume, week, totalResume })
  }

  else {
    res.redirect('/list-altas')
  }
});

module.exports = router;

//borrar clientes
// router.get('/delete/:idtramites', isLoggedIn, async (req, res) => {
//   const { idtramites } = req.params
//   console.log(idtramites)
//   await pool.query('DELETE FROM tramites WHERE idtramites= ?', [idtramites])
//   req.flash('fail', 'Cliente borrado correctamente')
//   res.redirect('/customer')
// })
