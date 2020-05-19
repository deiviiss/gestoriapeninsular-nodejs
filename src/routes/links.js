//guardar listar actualizar eliminar

const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas.

const pool = require('../database');

//routes

//Formulario
router.get('/add', (req, res) => {
  res.render('links/add.hbs')
})

// Recibe el formulario
router.post('/add', async (req, res) => { //función asincrona
  const { cliente, curp, nss, sdescontadas, scotizadas, direccion, telefono } = req.body; //objeto del formulario
  const newCliente = {
    cliente,
    curp,
    nss,
    sdescontadas,
    scotizadas,
    direccion,
    telefono
  };
  await pool.query('INSERT INTO tramites set ?', [newCliente]) //insertamos los datos en la base, la petición es asincrona
  req.flash('message', 'Cliente guardado correctamente')//parámetros: el nombre de como se guarda el mensaje y el valor del mensaje
  res.redirect('/links'); //direciona a los links
})

//lista de clientes
router.get('/', async (req, res) => {
  const links = await pool.query('SELECT * FROM tramites');
  console.log(links)
  res.render('links/list.hbs', { links }) //muestra el objeto en la vista
})

//borrar clientes
router.get('/delete/:idtramites', async (req, res) => {
  const { idtramites } = req.params
  console.log(idtramites)
  await pool.query('DELETE FROM tramites WHERE idtramites= ?', [idtramites])
  req.flash('message', 'Cliente borrado correctamente')
  res.redirect('/links')
})

//editar clientes
router.get('/edit/:idtramites', async (req, res) => {
  const { idtramites } = req.params
  const links = await pool.query('SELECT * FROM tramites WHERE idtramites = ?', [idtramites])
  res.render('links/edit', { link: links[0] }) //cero indica que solo tome un objeto del arreglo
})

router.post('/edit/:idtramites', async (req, res) => {
  const { idtramites } = req.params
  const { cliente, curp, nss, sdescontadas, scotizadas, direccion, telefono } = req.body; //objeto del formulario
  const updateCliente = {
    cliente,
    curp,
    nss,
    sdescontadas,
    scotizadas,
    direccion,
    telefono
  };
  await pool.query('UPDATE tramites set ? WHERE idtramites = ?', [updateCliente, idtramites])
  req.flash('message', 'Cliente editado correctamente')
  res.redirect('/links');
})


//consulta
router.get('/consult', (req, res) => {
  res.render('links/consult.hbs')
})

router.post('/consult', async (req, res) => {
  const { cliente } = req.body
  const consultaCliente = {
    cliente
  }
  // console.log(consultaCliente)
  await pool.query('SELECT * FROM tramites WHERE cliente = ?', [consultaCliente])
  res.send(consultaCliente)
})



module.exports = router;