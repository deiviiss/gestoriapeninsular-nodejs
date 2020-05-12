//Server Routes

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

//routes
router.get('/', (req, res) => {
  res.send('Hello World')
})

module.exports = router;