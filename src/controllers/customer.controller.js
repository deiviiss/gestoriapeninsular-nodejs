const db = require('../database'); //conexión a la base de datos
const helpers = require('../lib/handlebars')

const controller = {}

//lista clientes
controller.getList = async (req, res) => {
  res.render('customer/list-customer.hbs')
};

//busqueda de clientes
controller.postQuery = async (req, res) => {
  const user = req.user
  const { busqueda } = req.body

  // condición para elegir el método de busqueda
  if (user.permiso === "Regional") {
    const sqlBuscar = "SELECT * FROM tramites WHERE region = ? AND  cliente like '%" + [busqueda] + "%'"

    customer = await db.query(sqlBuscar, user.region)
  }

  else if (user.permiso === 'Administrador') {
    const sqlBuscar = "SELECT * FROM tramites WHERE cliente like '%" + [busqueda] + "%'";

    customer = await db.query(sqlBuscar);
  }

  else {
    const sqlBuscar = "SELECT * FROM tramites WHERE zona = ?  AND  cliente like '%" + [busqueda] + "%'"

    customer = await db.query(sqlBuscar, [user.zona])
  }

  //helper que cambia el formato de fecha y moneda
  customers = helpers.formatterCustomers(customer)

  res.render('customer/list-customer.hbs', { customer })
}

//?============= agregar observaciones clientes (ENCARGADO)
//envia formulario para editar
controller.getEdit = async (req, res) => {
  const { id } = req.params
  const sqlSelect = 'SELECT t.id, t.cliente, t.fecha_tramite, t.monto, t.curp, t.nss, t.scotizadas, t.sdescontadas, t.direccion, t.telefono, t.status, t.motivo, t.zona, t.fecha_status, l.folio, t.fecha_solucion, t.observaciones FROM tramites AS t LEFT JOIN liquidaciones as l ON t.id = l.id_cliente WHERE id = ?';

  customer = await db.query(sqlSelect, [id])

  const sqlMotivos = 'SELECT motivo FROM motivos GROUP BY motivo ORDER BY motivo;'

  const motivos = await db.query(sqlMotivos)

  //helper que cambia el formato de fecha y moneda
  helpers.formatterCustomers(customer)

  res.render('customer/edit', { customer: customer[0], motivos }) //cero indica que solo tome un objeto del arreglo
};

//recibe el formulario para actualizar observaciones
controller.postEdit = async (req, res) => {
  const { id } = req.params
  const { observaciones, fecha_solucion, motivo } = req.body; //objeto del formulario
  const user = req.user
  const fechaActual = new Date() //new Date() Objeto de Js para manejo de fechas

  //objeto con las observaciones y usuario fecha
  const updateCliente = {
    motivo: motivo,
    observaciones: observaciones + '(' + user.fullname + ')',
    fecha_status: fechaActual,
    fecha_solucion: fecha_solucion
  };

  //actualizo observaciones
  const sqlUpdate = 'UPDATE tramites set ? WHERE id = ?';
  await db.query(sqlUpdate, [updateCliente, id])

  //consulto cliente
  const sqlSelect = 'SELECT * FROM tramites WHERE id =?'
  customer = await db.query(sqlSelect, [id])

  //helper que cambia el formato de fecha y moneda
  helpers.formatterCustomers(customer)

  res.render('customer/edit', { customer: customer[0], user: user });
};

//?================= movimiento de status clientes (REGIONAL)
//envia el formulario para cambiar status
controller.getStatus = async (req, res) => {
  const { id } = req.params
  const { permiso } = req.user;

  //consulto al cliente
  const sqlSelect = 'SELECT * FROM tramites WHERE id =?'
  customer = await db.query(sqlSelect, [id])

  //obtener la propiedad status y fecha de tramite de la consulta
  const { status } = customer[0];

  //* Condición para proteger cambio de status
  if (status !== 'Pendiente') {
    req.flash('fail', 'Cliente ya con status')
    res.redirect('/resume')
  }
  else if (permiso === 'Administrador' || permiso === 'Regional' || permiso === 'Temporal') {
    const sqlStatus = 'SELECT status FROM status;'
    const status = await db.query(sqlStatus)

    res.render('customer/status.hbs', { customer: customer[0], status })
  }
  else {
    req.flash('fail', 'Permiso insuficiente')
    res.redirect('/resume')
  }
};
//recibe el formulario para cambiar status
controller.postStatus = async (req, res) => {
  const { id } = req.params
  const { status, observaciones } = req.body; //objeto del formulario
  const user = req.user
  const fechaActual = new Date()

  if (status === 'Finalizado') {
    let folio = 'F-' + (fechaActual.getMonth() + 1) + helpers.numAleatorio(id, 1);

    //objeto con el folio y el id del cliente
    const createFolio = {
      id_cliente: id,
      folio
    }
    //guardo folio
    const sqlFolio = 'INSERT INTO liquidaciones SET ?'
    await db.query(sqlFolio, [createFolio])
    req.flash('warning', `Folio de cierre ${folio}`)
  }

  if (status === 'Pendiente') {
    //coloca el motivo
    motivo = "Trámite"
  }
  else {
    motivo = null
  }

  //objeto con el status, observaciones con fecha y usuario
  const updateCliente = {
    status,
    motivo,
    observaciones: observaciones + " (" + user.fullname + ").",
    fecha_status: fechaActual
  };

  //actualizo el status de customer
  const sqlUpdate = 'UPDATE tramites set ? WHERE id = ?'
  await db.query(sqlUpdate, [updateCliente, id])

  // consulto el status que se acaba de actualizar
  // const sqlSelect = 'SELECT status FROM tramites WHERE id =?'
  // customerStatus = await db.query(sqlSelect, [id])

  req.flash('success', 'Status actualizado correctamente')
  res.redirect('/resume')
};

module.exports = controller;