//Ingresar clientes por tablas

//dependends
const express = require('express');
const router = express.Router(); //metodo de express que devuelve un objeto para listar rutas
const helpers = require('../lib/handlebars');

const db = require('../database');
const { isLoggedIn } = require('../lib/auth');

//* Agregar cliente

router.get('/add-customer', isLoggedIn, async (req, res) => {
  const { zona } = req.user

  // Consulta asesores
  const sqlAsesor = "SELECT a.asesor, r.region, z.zona FROM regiones AS r JOIN asesores AS a ON r.asesores_id_asesor = a.id_asesor JOIN zonas AS z ON r.zonas_id_zona = z.id_zona WHERE z.zona = ?"
  const asesoresZona = await db.query(sqlAsesor, zona)

  //Consulta afores
  const sqlAfore = "SELECT * FROM afores"
  const afores = await db.query(sqlAfore)

  res.render('customer/add-customer.hbs', { asesoresZona, afores })
})

router.post('/add-customer', isLoggedIn, async (req, res) => {
  const user = req.user

  // Objeto del formulario
  const { nombre, apellido, curp, nss, afore, direccion, telefono, scotizadas, sdescontadas, asesor, monto, observaciones, fecha_ultimo_retiro
  } = req.body; //objeto del formulario

  console.log(req.body);

  console.log('hey ' + helpers.semanaISO(fecha_ultimo_retiro));

  //? Get valores de tablas (asesores, pendientes, zonas, outsourcings)
  const sqlAsesor = "SELECT asesor, id_asesor FROM asesores WHERE asesor = ?;"
  const rowAsesor = await db.query(sqlAsesor, asesor)
  const asesor_id = rowAsesor[0].id_asesor

  const sqlAfore = "SELECT afore, id_afore FROM afores WHERE afore = ?;"
  const rowAfore = await db.query(sqlAfore, afore)
  const afore_id = rowAfore[0].id_afore

  const sqlStatus = "SELECT status, id_status FROM status WHERE status = 'En espera';"
  const rowStatus = await db.query(sqlStatus)
  const status_id = rowStatus[0].id_status

  const sqlZona = "SELECT zona, id_zona FROM zonas WHERE zona = ?;"
  const rowZona = await db.query(sqlZona, user.zona)
  const zona_id = rowZona[0].id_zona

  const sqlOutsourcing = "SELECT outsourcing, id_outsourcing FROM outsourcing WHERE outsourcing = 'Homero';"
  const rowOutsourcing = await db.query(sqlOutsourcing)
  const outsourcing_id = rowOutsourcing[0].id_outsourcing

  const newCliente = {
    cliente: nombre + " " + apellido,
    curp: curp,
    nss: nss,
    id_afore: afore_id,
    direccion: direccion,
    telefono: telefono,
    sdescontadas: sdescontadas,
    scotizadas: scotizadas,

    monto: monto,
    observaciones: observaciones,
    fecha_ultimo_retiro: fecha_ultimo_retiro,
    sueldo_base: monto / 30,

    outsourcing_id_outsourcing: outsourcing_id,
    asesores_id_asesor: asesor_id,
    status_id_status: status_id,
    zonas_id_zona: zona_id
  };

  const sqlClient = "INSERT INTO altas set ?"
  const rowClient = await db.query(sqlClient, [newCliente])


  console.log(newCliente);
  console.log(rowClient);
  // res.send(newCliente)
})

module.exports = router;

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
