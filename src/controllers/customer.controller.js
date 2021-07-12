//Buscar, listar, cambiar status

//dependends
const db = require('../database');
const helpers = require('../lib/handlebars');

const controller = {};

//*============== lista de clientes
controller.getList = async (req, res) => {
  res.render('customer/list-customer.hbs')
};

//*============== busqueda de cliente
controller.postQuery = async (req, res) => {
  const user = req.user
  const { busqueda } = req.body

  //evita busqueda vacia
  if (busqueda !== '') {
    //condición para elegir el método de busqueda
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
  else {
    req.flash('fail', 'Escribe el nombre de un cliente')
    res.redirect('/customer')
  }
};

//?============= agregar observaciones clientes (ENCARGADO)
//envia formulario para editar
controller.getEdit = async (req, res) => {
  const { id } = req.params
  const sqlSelect = 'SELECT t.id, t.cliente, t.fecha_tramite, t.monto, t.curp, t.nss, t.scotizadas, t.sdescontadas, t.direccion, t.telefono, t.status, t.motivo, t.zona, t.fecha_status, l.folio, t.fecha_solucion, t.observaciones FROM tramites AS t LEFT JOIN liquidaciones as l ON t.id = l.id_cliente WHERE id = ?';

  customer = await db.query(sqlSelect, [id])

  const sqlMotivos = "SELECT motivo FROM motivos where motivo != 'Trámite' ORDER BY motivo;"

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

  const sqlMotivos = "SELECT motivo FROM motivos where motivo != 'Trámite' ORDER BY motivo;"

  const motivos = await db.query(sqlMotivos)

  //helper que cambia el formato de fecha y moneda
  helpers.formatterCustomers(customer)

  // req.flash('success', 'Motivo actualizado correctamente')
  // res.render('customer/edit', { customer: customer[0], user: user, motivos });
  res.render('customer/edit', { customer: customer[0], motivos });
};

//?================= movimiento de status clientes (REGIONAL)
//envia el formulario para cambiar status
controller.getStatus = async (req, res) => {
  const { id } = req.params
  const { permiso } = req.user;

  //consulto al cliente
  const sqlSelect = 'SELECT * FROM tramites WHERE id =?'
  customer = await db.query(sqlSelect, [id])

  //obtener la propiedad status
  const statusCustomer = customer[0].status;

  //* Condición para proteger cambio de status
  if (statusCustomer !== 'Pendiente' && statusCustomer != 'Liquidar') {
    req.flash('fail', 'Cliente ya con status')
    res.redirect('/resume')
  }
  else if (permiso !== 'Encargado') {

    if (statusCustomer === 'Liquidar') {
      //objeto que validad si se solicita el folio de cierre
      folio = {
        folio: "liquidar"
      }

      const sqlStatus = 'SELECT status FROM status WHERE status = "Finalizado";'
      status = await db.query(sqlStatus)
      res.render('customer/status.hbs', { customer: customer[0], status, folio })
    }
    else {
      //objeto que validad si se solicita el folio de cierre
      folio = {
        folio: "noliquidar"
      }

      const sqlStatus = 'SELECT status FROM status WHERE status != "Pendiente" AND status != "Liquidar" AND status != "En espera" AND status != "Finalizado" ORDER BY statuS;'

      status = await db.query(sqlStatus)
      res.render('customer/status.hbs', { customer: customer[0], status, folio })
    }
  }
  else {
    req.flash('fail', 'Permiso insuficiente')
    res.redirect('/resume')
  }
};

//recibe el formulario para cambiar status
controller.postStatus = async (req, res) => {
  const { id } = req.params
  const { status, observaciones, folio } = req.body; //objeto del formulario
  const user = req.user
  const fechaActual = new Date()

  console.log(status);

  if (folio === undefined) {
    //objeto con el status, observaciones con fecha y usuario
    const updateCliente = {
      status,
      observaciones: observaciones + " (" + user.fullname + ").",
      fecha_status: fechaActual
    };

    //actualizo el status de customer
    const sqlUpdate = 'UPDATE tramites SET ? WHERE id = ?'
    await db.query(sqlUpdate, [updateCliente, id])

    req.flash('success', 'Status actualizado correctamente')
    res.redirect('/resume')
  }

  else {

    const sqlValidarCliente = 'SELECT id_cliente FROM liquidaciones WHERE id_cliente = ? AND status = "closed";'
    const validarCliente = await db.query(sqlValidarCliente, id);

    if (validarCliente.length !== 0) {
      const sqlValidarFolio = 'SELECT folio FROM liquidaciones WHERE folio = ?;'
      const validarFolio = await db.query(sqlValidarFolio, folio);

      if (validarFolio.length !== 0) {
        //objeto con el status, observaciones con fecha y usuario
        const updateCliente = {
          status,
          observaciones: observaciones + " (" + user.fullname + ").",
          fecha_status: fechaActual
        };

        //actualizo el status de customer
        const sqlUpdate = 'UPDATE tramites SET ? WHERE id = ?'
        await db.query(sqlUpdate, [updateCliente, id])

        req.flash('success', 'Finalizado correctamente')
        res.redirect('/resume')
      }
      else {
        req.flash('fail', 'Folio incorrecto')
        res.redirect('/customer/edit/' + id)
      }

    }
    else {
      req.flash('fail', 'No se ha liquidado')
      res.redirect('/customer/edit/' + id)
    }
  }
};

module.exports = controller;