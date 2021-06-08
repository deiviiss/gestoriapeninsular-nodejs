//liquidaciones de clientes

const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../lib/auth.js');

//controller liquidaciones
const controller = require('../controllers/liquidacion.controller.js');

//lista liquidaciones sin finalizar
router.get('/liquidaciones', isLoggedIn, controller.getLiquidaciones);

//abono para liquidación
router.get('/liquidaciones/liquidar/:id', isLoggedIn, controller.getLiquidar);

//liquida los clientes
router.post('/liquidaciones/liquidar/:id', isLoggedIn, controller.postLiquidar);

//muestra los detalles de la liquidación
router.get('/liquidaciones/details/:id', isLoggedIn, controller.getDetails);

module.exports = router;