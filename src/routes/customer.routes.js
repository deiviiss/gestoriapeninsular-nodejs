//Buscar, listar, cambiar status 

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const { isLoggedIn } = require('../lib/auth');

//controller customer
const controller = require('../controllers/customer.controller.js')

//routes

//lista de clientes
router.get('/', isLoggedIn, controller.getList);

//busqueda de cliente
router.post('/query', isLoggedIn, controller.postQuery);

//?============= agregar observaciones clientes (ENCARGADO)
//envia formulario para editar
router.get('/edit/:id', isLoggedIn, controller.getEdit);

//recibe el formulario para actualizar observaciones
router.post('/edit/:id', isLoggedIn, controller.postEdit);

//?================= movimiento de status clientes (REGIONAL)
//envía el formulario para cambiar status
router.get('/status/:id', isLoggedIn, controller.getStatus);

//recibe el formulario para cambiar status
router.post('/status/:id', isLoggedIn, controller.postStatus);

module.exports = router;