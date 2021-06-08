//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const controller = require('../controllers/index.controller.js');

//route index
router.get('/', controller.getIndex);

module.exports = router;