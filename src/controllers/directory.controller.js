//lista y consulta el directorio

//depends
const db = require('../database');

const controller = {};

// lista el directorio
controller.getDirectorio = async (req, res) => {
  const directorio = await db.query('SELECT * FROM users');

  res.render('directory/list.hbs', { directorio }) //muestra el objeto en la vista
};

// búsqueda de sucursal
controller.postSearch = async (req, res) => {
  const { busqueda } = req.body

  if (busqueda !== '') {
    directorio = directorio = await db.query("SELECT * FROM users WHERE fullname like '%" + [busqueda] + "%' OR zona like '%" + [busqueda] + "%'") // consulta a la base

    res.render('directory/list.hbs', { directorio })
  }
  else {
    req.flash('fail', 'Escribe el nombre de la sucursal o encargado')
    res.redirect('/directorio')
  }
}

module.exports = controller;