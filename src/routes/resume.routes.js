//muestra la relación de trámites

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const { isLoggedIn } = require('../lib/auth');
//controller resume
const controller = require('../controllers/resume.controller.js')

//?========= renderiza resumen (status)
router.get('/resume', isLoggedIn, controller.getResume);

//?========= renderiza resume (status administrador regional por zona 'busqueda zona')
router.post('/resume-zona/', isLoggedIn, controller.postResume);

//?========= renderiza list-customer (status except 'pendiente')
router.get('/resume/:status', isLoggedIn, controller.getStatus);

//?========= renderiza list-customer (motivos)
router.get('/desgloce-pendientes/:motivo', isLoggedIn, controller.getMotivo);

//?========= renderiza list-customer (status week)
router.get('/status-week/:status', isLoggedIn, controller.getStatusWeek)

//?========= renderiza list-customer (pendientes por semana, 30 & 60 days)
router.get('/pendientes/:group', isLoggedIn, controller.getGroup);

module.exports = router;