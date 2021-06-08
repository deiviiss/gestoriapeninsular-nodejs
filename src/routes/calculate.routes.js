//cotización customer

//dependends
const express = require('express');
const router = express.Router();

//controller calculate
const controller = require('../controllers/calculate.controller.js');

//envía el formulario de cantidad
router.get('/calcular', controller.getCalculate);

//recibe la cantidad a calcular
router.post('/calcular', controller.postCalculate);

module.exports = router;