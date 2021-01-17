//Server Routes

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

//route calcular
router.get('/calcular', (req, res) => {
  res.render('calcular.hbs')
})

module.exports = router;