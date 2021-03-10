
// Add customer
// Envía el formulario captura cliente
// router.get('/add', isLoggedIn, (req, res) => {
//   res.render('customer/add.hbs')
// })

// Recibe el formulario captura cliente
// router.post('/add', isLoggedIn, async (req, res) => { //función asincrona
//   const { asesor, cliente, curp, afore, nss, monto, sueldo_base, fecha_baja, fecha_tramite, direccion, telefono, observaciones, status, outsourcing, zona, pendiente, scotizadas, sdescontadas, fecha_ultimo_retiro, honorarios, seguro } = req.body; //objeto del formulario
//   const newCliente = {
//     asesor,
//     cliente,
//     curp,
//     afore,
//     nss,
//     monto,
//     sueldo_base,
//     fecha_baja,
//     fecha_tramite,
//     direccion,
//     telefono,
//     observaciones,
//     status,
//     outsourcing,
//     zona,
//     pendiente,
//     scotizadas,
//     sdescontadas,
//     fecha_ultimo_retiro,
//     honorarios,
//     seguro
//   };
//   await pool.query('INSERT INTO tramites set ?', [newCliente]) //insertamos los datos en la base, la petición es asincrona
//   req.flash('success', 'Cliente guardado correctamente')//parámetros: el nombre de como se guarda el mensaje y el valor del mensaje
//   res.redirect('/customer'); //direciona a los links
// })


//borrar clientes
// router.get('/delete/:idtramites', isLoggedIn, async (req, res) => {
//   const { idtramites } = req.params
//   console.log(idtramites)
//   await pool.query('DELETE FROM tramites WHERE idtramites= ?', [idtramites])
//   req.flash('fail', 'Cliente borrado correctamente')
//   res.redirect('/customer')
// })
