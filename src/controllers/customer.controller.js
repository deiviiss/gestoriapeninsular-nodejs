const db = require('../database'); //conexión a la base de datos
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/handlebars')

const controller = {}

controller.getList = async (req, res) => {
  res.render('customer/list-customer.hbs')
}

module.exports = controller;