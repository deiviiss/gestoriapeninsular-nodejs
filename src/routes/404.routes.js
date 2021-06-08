//error 404

//dependends
const express = require('express');
const router = express.Router();

//controller 404
const controller = require('../controllers/404.controller.js');

//404
router.get('/404', controller.get404);

module.exports = router;