//Ingresar clientes por tablas

//dependends
const express = require('express');
const router = express.Router();

//móduo auth
const { isLoggedIn } = require('../lib/auth.js');
//controller altas
const controller = require('../controllers/altas.controller.js')

//*============== Lista altas
//envia lista
router.get('/list-altas', isLoggedIn, controller.getListAltas);

//recibe lista con select zona
router.post('/list-altas', isLoggedIn, controller.postListAltas);

//*============== Agregar cliente
//envia formulario para captura
router.get('/add-customer', isLoggedIn, controller.getAddCustomer);

//recibe formulario de captura
router.post('/add-customer', isLoggedIn, controller.postAddCustomer);

//*============== Edita altas
//envia formulario para editar
router.get('/altas/edit-altas/:id_pre_altas', isLoggedIn, controller.getEditCustomer);

//recibe formulario editado
router.post('/altas/edit-altas/:id_pre_altas', isLoggedIn, controller.postEditCustomer);

//*============== Borrar altas
router.get('/altas/delete-altas/:id_pre_altas', isLoggedIn, controller.getDeleteCustomer);

//*============== Resume altas
router.get('/resume-altas', isLoggedIn, controller.getResumeAltas);

// router.get('/dev', async (re, res) => {

//   const sqlAltas = "SELECT a.asesor, CONCAT(p.nombre, ' ', apellidoPaterno, ' ', apellidoMaterno) AS cliente, p.curp, p.nss, af.afore, p.monto, (p.monto/30) AS sueldo, p.direccion, p.telefono, p.observaciones, z.zona, p.scotizadas, p.sdescontadas, p.fecha_ultimo_retiro, p.region FROM pre_altas as p JOIN asesores AS a ON p.id_asesor = a.id_asesor JOIN zonas as z ON p.id_zona = z.id_zona JOIN afores as af ON p.id_afore = af.id_afore;"

//   const altas = await db.query(sqlAltas)

//   console.log(sqlAltas);

//   console.log(altas);

//   res.send({ altas: json })


// });

module.exports = router;
