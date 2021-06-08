//altas especiales

//dependens
const db = require('../database.js');

const controller = {}

//resume especiales
controller.getResumeEspecial = async (req, res) => {
  const user = req.user;

  if (user.permiso === "Administrador") {

    const sqlEspeciales = "SELECT MONTHNAME(fecha_status) AS Mes, COUNT(fecha_status) AS total FROM tramites WHERE status = 'Baja' AND fecha_status IS NOT NULL GROUP BY MONTHNAME(fecha_status) ORDER BY MONTH(fecha_status);"

    const especiales = await db.query(sqlEspeciales);


    //! Trabajando la forma en la que se va a renderizar y cambiar los meses a español
    res.render('especiales/resume-especiales.hbs', { especiales })

  }
  else {
    req.flash('fail', 'Sin permiso suficiente')
    res.redirect('/profile')
  }

}

module.exports = controller;