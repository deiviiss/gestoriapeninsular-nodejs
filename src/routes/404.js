//Server Routes

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

//route index
router.get('/404', (req, res) => {
  res.render('404.hbs')
})

module.exports = router;