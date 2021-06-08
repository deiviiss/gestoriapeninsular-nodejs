//lista y consulta el directorio

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

// módulo auth
const { isLoggedIn } = require('../lib/auth.js');

// controlador directorio
const controller = require('../controllers/directory.controller.js')

// lista el directorio
router.get('/directorio', isLoggedIn, controller.getDirectorio);

// búsqueda de sucursal
router.post('/directorio', isLoggedIn, controller.postSearch);

module.exports = router;