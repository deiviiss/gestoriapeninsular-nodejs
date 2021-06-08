const db = require('../database'); //conexión a la base de datos
const helpers = require('../lib/handlebars')

const controller = {}

controller.getLiquidaciones = async (req, res) => {
  const user = req.user
  //trae todas las liquidaciones
  const sqlLiquidaciones = "SELECT l.id_liquidacion, t.cliente, l.folio, t.zona FROM liquidaciones AS l JOIN tramites AS t ON t.id = l.id_cliente WHERE l.status = 'open' "

  switch (user.permiso) {
    case "Administrador":

      liquidaciones = await db.query(sqlLiquidaciones);

      res.render('liquidaciones/list-liquidaciones.hbs', { liquidaciones })
      break;

    case "Regional":

      liquidaciones = await db.query(sqlLiquidaciones + "AND t.region = ?;", user.region);

      res.render('liquidaciones/list-liquidaciones.hbs', { liquidaciones })
      break;

    default:

      liquidaciones = await db.query(sqlLiquidaciones + "AND t.zona = ?;", user.zona);

      res.render('liquidaciones/list-liquidaciones.hbs', { liquidaciones })
      break;
  }
};

controller.getLiquidar = async (req, res) => {
  const { id } = req.params

  const sqlLiquidacion = 'SELECT t.cliente, l.status FROM liquidaciones AS l JOIN tramites AS t ON t.id = l.id_cliente WHERE l.id_liquidacion = ?;'

  let liquidacion = await db.query(sqlLiquidacion, [id])

  if (liquidacion[0].status === 'open') {

    res.render('liquidaciones/type-liquidacion.hbs', { id, cliente: liquidacion[0].cliente })
  }
  else {
    req.flash('fail', 'Liquidación cerrada')
    res.redirect('/liquidaciones')
  }
};

controller.postLiquidar = async (req, res) => {
  const { id } = req.params;
  let { tipo, abono } = req.body;
  const user = req.user;

  if (abono != '') {
    abono = parseInt(abono)
  }
  else {
    abono = 0
  }

  //trae la liquidación que se cerrara
  const sqlLiquidacion = 'SELECT t.monto FROM liquidaciones AS l JOIN tramites AS t ON t.id = l.id_cliente WHERE l.id_liquidacion = ?;'
  let liquidacion = await db.query(sqlLiquidacion, [id])

  //calcula la liquidación y crea el objeto que actualizara la bd
  const createLiquidar = helpers.liquidacion(liquidacion[0].monto, tipo, abono)

  //actualiza la bd con la liquidacion creada
  const sqlUpdateLiquidar = "UPDATE liquidaciones SET ? WHERE id_liquidacion = ?"
  await db.query(sqlUpdateLiquidar, [createLiquidar, id])

  //consulta la liquidacion actualizada para mandar a la vista
  const sqlLiquidar = 'SELECT t.cliente, l.monto AS monto_cobrado, l.porcentaje, l.comision, l.aseguramiento, l.asesor, l.sucursal, l.abono, l.sin_abono, l.liquidar, l.fecha_liquidacion, l.folio, l.status FROM liquidaciones AS l JOIN tramites AS t ON t.id = l.id_cliente WHERE l.id_liquidacion = ?;'
  const liquidar = await db.query(sqlLiquidar, [id])
  //! trabajando en la vista que mostrara la liquidación
  res.render('liquidaciones/liquidacion.hbs', { liquidar: liquidar[0], user });
}

controller.getDetails = async (req, res) => {
  res.send('Mostrar los campos de liquidación');
}

module.exports = controller;