//cotización customer

//dependends
const helpers = require('../lib/handlebars')
const db = require('../database');

const controller = {};

//envía el formulario de cantidad
controller.getCalculate = async (req, res) => {
  const user = req.user

  if (user.permiso === 'Administrador') {
    const sqlZonas = 'SELECT zona FROM zonas'
    const zonas = await db.query(sqlZonas)

    res.render('calculate/calcular.hbs', { user, zonas })
  }
  else {
    const sqlZonas = 'SELECT zona FROM zonas WHERE region = ?'
    const zonas = await db.query(sqlZonas, user.region)

    res.render('calculate/calcular.hbs', { user, zonas })
  }
};

//recibe la cantidad a calcular
controller.postCalculate = async (req, res) => {
  const user = req.user
  const body = req.body

  helpers.calculaCosto(body, user)

  res.render('calculate/result.hbs', { retiro, user })
};

module.exports = controller;