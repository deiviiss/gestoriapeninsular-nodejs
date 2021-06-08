//singin, login, logout  users

//dependens
const express = require('express');
const router = express.Router();

//módulo auth
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth.js');
// controller authentic
const controller = require('../controllers/authentication.controller.js');

//*============== restore password
//envía formulario
router.get('/restore-pass/:id', isLoggedIn, controller.getRestorePass);

//recibe el formulario
router.post('/restore-pass/:id', isLoggedIn, controller.postRestorePass);

//*============== login de usuario
//envía formulario
router.get('/login', isNotLoggedIn, controller.getLogin);

//recibe el formulario
router.post('/login', isNotLoggedIn, controller.postLogin);

//*============== registro de usuario
//envía formulario 
router.get('/register', isLoggedIn, controller.getRegisterUser);

//recibe el formulario
router.post('/register', isLoggedIn, controller.postRegisterUser);

//*============== perfil
router.get('/profile', isLoggedIn, controller.getProfile);

//*============== logout
router.get('/logout', isLoggedIn, controller.getLogout);

module.exports = router;