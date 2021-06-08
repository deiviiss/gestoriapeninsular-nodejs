//Ingresar clientes por tablas

//dependends
const helpers = require('../lib/handlebars.js');
const db = require('../database');

const controller = {}

//*============== Lista altas
//envia lista
controller.getListAltas = async (req, res) => {
  const user = req.user;

  if (user.permiso === "Administrador") {

    const sqlCustomer = 'SELECT p.id_pre_altas, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.curp, p.nss, p.rfc, p.umf, p.scotizadas, p.sdescontadas, a.asesor, p.fecha_ultimo_retiro, af.afore, p.monto, p.direccion, p.lugar, p.telefono, p.sexo, p.observaciones, z.zona, p.fecha_captura, p.capturado, p.infonavit FROM pre_altas AS p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN afores AS af ON af.id_afore = p.id_afore JOIN zonas AS z ON z.id_zona = p.id_zona ORDER BY p.fecha_captura ASC;'

    const customer = await db.query(sqlCustomer)

    //helper que cambia el formato de fecha y moneda
    helpers.formatterCustomers(customer)

    //Para input de busqueda por zona (get zonas)
    const sqlZonas = 'SELECT zona FROM zonas ORDER BY zona;'
    const zonas = await db.query(sqlZonas)

    res.render('altas/list-altas.hbs', { customer, user, zonas })
  }

  else if (user.permiso === "Regional") {
    const sqlCustomer = 'SELECT p.id_pre_altas, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.curp, p.nss, p.rfc, p.umf, p.scotizadas, p.sdescontadas, a.asesor, p.fecha_ultimo_retiro, af.afore, p.monto, p.direccion, p.lugar, p.telefono, p.sexo, p.observaciones, z.zona, p.fecha_captura, p.capturado, p.infonavit FROM pre_altas AS p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN afores AS af ON af.id_afore = p.id_afore JOIN zonas AS z ON z.id_zona = p.id_zona WHERE p.region = ? ORDER BY p.fecha_captura ASC;'

    const customer = await db.query(sqlCustomer, user.region)

    //Para input de busqueda por zona (get zonas)
    const sqlZonas = 'SELECT zona FROM zonas WHERE region = ? ORDER BY zona;'
    const zonas = await db.query(sqlZonas, user.region)

    //helper que cambia el formato de fecha y moneda
    helpers.formatterCustomers(customer)

    res.render('altas/list-altas.hbs', { customer, user, zonas })
  }

  //*Encargado
  else {

    const sqlCustomer = 'SELECT p.id_pre_altas, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.curp, p.nss, p.rfc, p.umf, p.scotizadas, p.sdescontadas, a.asesor, p.fecha_ultimo_retiro, af.afore, p.monto, p.direccion, p.lugar, p.telefono, p.sexo, p.observaciones, z.zona, p.fecha_captura, p.capturado, p.infonavit FROM pre_altas AS p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN afores AS af ON af.id_afore = p.id_afore JOIN zonas AS z ON z.id_zona = p.id_zona WHERE z.zona = ? ORDER BY p.fecha_captura ASC;'

    const customer = await db.query(sqlCustomer, user.zona)

    const sqlResume = 'SELECT altas.fecha_captura, zonas.zona, count(zona) AS total FROM pre_altas AS altas JOIN zonas as zonas ON zonas.id_zona = altas.id_zona WHERE zona = ? GROUP BY zona;'

    const resume = await db.query(sqlResume, user.zona)

    //?suma los totales de altas
    let totalResume = resume.reduce((sum, value) => (typeof value.total == "number" ? sum + value.total : sum), 0);

    //helper que cambia el formato de fecha y moneda
    helpers.formatterCustomers(customer)

    res.render('altas/list-altas.hbs', { customer, user, totalResume })
  }
};

//recibe lista con select zona
controller.postListAltas = async (req, res) => {
  const user = req.user;
  const { zona } = req.body;

  if (user.permiso === "Administrador") {

    const sqlCustomer = 'SELECT p.id_pre_altas, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.curp, p.nss, p.rfc, p.umf, p.scotizadas, p.sdescontadas, a.asesor, p.fecha_ultimo_retiro, af.afore, p.monto, p.direccion, p.lugar, p.telefono, p.sexo, p.observaciones, z.zona, p.fecha_captura, p.capturado FROM pre_altas AS p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN afores AS af ON af.id_afore = p.id_afore JOIN zonas AS z ON z.id_zona = p.id_zona WHERE zona = ? ORDER BY p.fecha_captura ASC;'

    const customer = await db.query(sqlCustomer, zona)

    //Para input de busqueda por zona
    const sqlZonas = 'SELECT zona FROM zonas ORDER BY zona;'
    const zonas = await db.query(sqlZonas)

    //helper que cambia el formato de fecha y moneda
    helpers.formatterCustomers(customer)

    res.render('altas/list-altas.hbs', { customer, user, zonas })
  }

  else {
    const sqlCustomer = 'SELECT p.id_pre_altas, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.curp, p.nss, p.rfc, p.umf, p.scotizadas, p.sdescontadas, a.asesor, p.fecha_ultimo_retiro, af.afore, p.monto, p.direccion, p.lugar, p.telefono, p.sexo, p.observaciones, z.zona, p.fecha_captura, p.capturado FROM pre_altas AS p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN afores AS af ON af.id_afore = p.id_afore JOIN zonas AS z ON z.id_zona = p.id_zona WHERE p.region = ? AND zona = ? ORDER BY p.fecha_captura ASC;'

    const customer = await db.query(sqlCustomer, [user.region, zona])

    //Para input de busqueda por zona (get zonas)
    const sqlZonas = 'SELECT zona FROM zonas WHERE region = ? ORDER BY zona;'
    const zonas = await db.query(sqlZonas, user.region)

    //helper que cambia el formato de fecha y moneda
    helpers.formatterCustomers(customer)

    res.render('altas/list-altas.hbs', { customer, user, zonas })
  }
};

//*============== Agregar cliente
//envia formulario para captura
controller.getAddCustomer = async (req, res) => {
  const { zona } = req.user

  // Consulta asesores
  const sqlAsesor = "SELECT a.asesor, a.status, r.region, z.zona FROM regiones AS r JOIN asesores AS a ON r.asesores_id_asesor = a.id_asesor JOIN zonas AS z ON r.zonas_id_zona = z.id_zona WHERE z.zona = ? AND a.status = 'Activo' ORDER BY a.asesor"
  const asesoresZona = await db.query(sqlAsesor, zona)

  //Consulta afores
  const sqlAfore = "SELECT * FROM afores"
  const afores = await db.query(sqlAfore)

  res.render('altas/add-customer.hbs', { asesoresZona, afores })
};

//recibe formulario de captura
controller.postAddCustomer = async (req, res) => {
  const user = req.user
  const fechaActual = new Date()

  const sqlRegion = 'SELECT region FROM zonas WHERE zona = ? ORDER BY zona;'
  const regionDb = await db.query(sqlRegion, user.zona)
  const region = regionDb[0].region

  // Objeto del formulario
  let { nombre, apellidoPaterno, apellidoMaterno, curp, nss, rfc, umf, scotizadas, sdescontadas, asesor, fecha_ultimo_retiro, afore, monto, direccion, lugar, telefono, sexo, infonavit, observaciones } = req.body;

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
  if (infonavit === 'si') {
    infonavit = true
  }
  else {
    infonavit = false
  }

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
    region,
    infonavit

    // sueldo_base: monto / 30,
    // outsourcing_id_outsourcing: outsourcing_id,
    // status_id_status: status_id,
  };

  const sqlAlta = "INSERT INTO pre_altas SET ?"
  await db.query(sqlAlta, [newCliente])

  req.flash('success', 'Cliente guardado')
  res.redirect('/add-customer')
};

//*============== Edita alta
//envia formulario para editar
controller.getEditCustomer = async (req, res) => {
  const { id_pre_altas } = req.params

  const sqlAlta = 'SELECT p.id_pre_altas, p.nombre, p.apellidoPaterno, p.apellidoMaterno, p.curp, p.nss, p.rfc, p.umf, p.scotizadas, p.sdescontadas, a.asesor, p.fecha_ultimo_retiro, af.afore, p.monto, p.direccion, p.lugar, p.telefono, p.sexo, p.observaciones, z.zona, p.fecha_captura, p.capturado, p.infonavit FROM pre_altas AS p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN afores AS af ON af.id_afore = p.id_afore JOIN zonas AS z ON z.id_zona = p.id_zona WHERE p.id_pre_altas = ?; '

  customer = await db.query(sqlAlta, [id_pre_altas])

  //Consulta afores
  const sqlAfore = "SELECT * FROM afores"
  const afores = await db.query(sqlAfore)

  // Consulta asesores
  const sqlAsesor = "SELECT a.asesor, r.region, z.zona FROM regiones AS r JOIN asesores AS a ON r.asesores_id_asesor = a.id_asesor JOIN zonas AS z ON r.zonas_id_zona = z.id_zona WHERE z.zona = ? ORDER BY a.asesor"
  const asesoresZona = await db.query(sqlAsesor, customer[0].zona)

  //formato a customer (fecha)
  helpers.formatterEditAlta(customer)

  let infonavitDb = customer[0].infonavit

  if (infonavitDb === 1) {
    customer.push({ infonavitSi: 'checked', infonavitNo: '' })
  }
  else {
    customer.push({ infonavitNo: 'checked', infonavitSi: '' })
  }

  res.render('altas/edit-alta', { customer: customer[0], asesoresZona, afores, infonavit: customer[1] })
};

//recibe formulario editado
controller.postEditCustomer = async (req, res) => {
  const customer_id = req.params.id_pre_altas;
  const fechaActual = new Date()
  const user = req.user;

  // Objeto del formulario
  let { nombre, apellidoPaterno, apellidoMaterno, curp, nss, rfc, umf, scotizadas, sdescontadas, asesor, fecha_ultimo_retiro, afore, monto, direccion, lugar, telefono, sexo, infonavit, observaciones } = req.body;

  //? Get valores de tablas (asesores, afores, zonas)
  const sqlAsesor = "SELECT asesor, id_asesor FROM asesores WHERE asesor = ?;"
  const rowAsesor = await db.query(sqlAsesor, asesor)
  const asesor_id = rowAsesor[0].id_asesor

  const sqlAfore = "SELECT afore, id_afore FROM afores WHERE afore = ?;"
  const rowAfore = await db.query(sqlAfore, afore)
  const afore_id = rowAfore[0].id_afore

  // const sqlZona = "SELECT zona, id_zona FROM zonas WHERE zona = ?;"
  // const rowZona = await db.query(sqlZona, user.zona)
  // const zona_id = rowZona[0].id_zona

  if (infonavit === 'si') {
    infonavit = true
  }
  else {
    infonavit = false
  }

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
    // id_zona: zona_id,
    fecha_captura: fechaActual,
    capturado: user.fullname,
    infonavit

    // sueldo_base: monto / 30,
    // outsourcing_id_outsourcing: outsourcing_id,
    // status_id_status: status_id,
  };

  const sqlUpdateAlta = "UPDATE pre_altas set ? WHERE id_pre_altas = ?"
  await db.query(sqlUpdateAlta, [updateCliente, customer_id])

  req.flash('success', 'Cliente actualizado')
  res.redirect('/list-altas')
};

//*============== Borrar altas
controller.getDeleteCustomer = async (req, res) => {
  const { id_pre_altas } = req.params
  const user = req.user

  await db.query('DELETE FROM pre_altas WHERE id_pre_altas= ?', [id_pre_altas])
  console.log('Elimino el usuario ' + user.fullname);
  req.flash('fail', 'Cliente borrado correctamente')
  res.redirect('/list-altas')
};

//*============== Resume altas
controller.getResumeAltas = async (req, res) => {
  const user = req.user;

  //*Resumen Administrador
  if (user.permiso === 'Administrador') {
    const sqlAltas = 'SELECT altas.fecha_captura, zonas.zona, count(zona) AS total FROM pre_altas AS altas JOIN zonas as zonas ON zonas.id_zona = altas.id_zona GROUP BY zona ORDER BY altas.fecha_captura ASC;'

    const resume = await db.query(sqlAltas)

    if (resume.length !== 0) {

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

  }
  //*Resumen Regional
  else if (user.permiso === "Regional") {
    const sqlAltas = 'SELECT altas.fecha_captura, zonas.zona, count(zona) AS total FROM pre_altas AS altas JOIN zonas as zonas ON zonas.id_zona = altas.id_zona WHERE zonas.region = ? GROUP BY zona;'

    const resume = await db.query(sqlAltas, user.region)

    if (resume.length !== 0) {

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
  }

  else {
    res.redirect('/list-altas')
  }
};

module.exports = controller;
