//altas especiales

// dependens
const express = require('express');
const router = express.Router();

// módulo auth
const { isLoggedIn } = require('../lib/auth.js');

//controller altas especiales
const controller = require('../controllers/especiales.controller.js');

router.get('/altas-especiales', isLoggedIn, controller.getResumeEspecial);

module.exports = router;