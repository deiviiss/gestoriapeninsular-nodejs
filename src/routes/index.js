//Server Routes

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

//route index
router.get('/', (req, res) => {
  res.send('works!')
})

module.exports = router;