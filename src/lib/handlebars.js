//funciones

const { body } = require('express-validator');
const { format } = require('timeago.js'); //requiere el metodo format


const helpers = {} //objeto a utilizar desde las vistas

//metodos del objeto

//Muestra fecha
helpers.showTime = (timestamp) => {
  return format(timestamp) //recibe la fecha ilegible de la base de datos
}

//cambiar a moneda
helpers.formatterPeso = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
  // convierte el numero en moneda
})

//recibe el record con los clientes desde la base
helpers.formatterCustomers = (sinformato) => {
  // Condición que recibe el record
  if (sinformato.length > 0) {

    // ciclo for para iterar records recibidos.
    for (var i = 0; i < sinformato.length; i++) {

      let montoPeso = (sinformato[i].monto)
      let fechaFormat = (sinformato[i].fecha_tramite)
      let month = new Array(); //Array que contiene los meses

      month[0] = "Enero";
      month[1] = "Febrero";
      month[2] = "Marzo";
      month[3] = "Abril";
      month[4] = "Mayo";
      month[5] = "Junio";
      month[6] = "Julio";
      month[7] = "Agosto";
      month[8] = "Septiembre";
      month[9] = "Octubre";
      month[10] = "Noviembre";
      month[11] = "Diciembre";

      date = new Date(fechaFormat) //new Date() Objeto de Js para manejo de fechas

      sinformato[i].monto = helpers.formatterPeso.format(montoPeso)
      sinformato[i].fecha_tramite = date.getDate() + '/' + month[date.getMonth()] + '/' + date.getFullYear()

      // console.log(customers[i].fecha_tramite)
    }
    return sinformato
  }

}

//funciones costos
helpers.costoLocal = (cantidad) => {
  let cobro
  let aseguramiento
  let cobroCliente
  let libreCliente

  if (cantidad > 42509) {
    cobro = cantidad * .30
    aseguramiento = 'Incluido'
    cobroCliente = cobro
    libreCliente = cantidad - cobro
  }

  else if (cantidad > 25001) {
    cobro = cantidad * .25
    aseguramiento = 2000
    cobroCliente = cobro + aseguramiento
    libreCliente = cantidad - cobroCliente
  }

  else if (cantidad > 15000) {
    cobro = cantidad * .25
    aseguramiento = 1700
    cobroCliente = cobro + aseguramiento
    libreCliente = cantidad - cobroCliente
  }

  else if (cantidad > 0) {
    cobro = cantidad * .25
    aseguramiento = 1300
    cobroCliente = cobro + aseguramiento
    libreCliente = cantidad - cobroCliente
  }

  //  formato moneda
  montoPesos = helpers.formatterPeso.format(cantidad)
  cobroPesos = helpers.formatterPeso.format(cobro)
  if (aseguramiento === 'Incluido') {
    aseguramientoPesos = 'Incluido'
  }
  else {
    aseguramientoPesos = helpers.formatterPeso.format(aseguramiento)
  }
  cobroClientePesos = helpers.formatterPeso.format(cobroCliente)
  libreClientePesos = helpers.formatterPeso.format(libreCliente)

  // // objeto que recibe la vista result
  retiro = {
    montoPesos,
    cobroPesos,
    aseguramientoPesos,
    cobroClientePesos,
    libreClientePesos,
  }

  return (retiro)
}

helpers.costoforaneo1 = (cantidad) => {
  let cobro
  let aseguramiento
  let cobroCliente
  let libreCliente

  if (cantidad > 30801) {
    cobro = cantidad * .30
    aseguramiento = 'Incluido'
    cobroCliente = cobro
    libreCliente = cantidad - cobro
  }

  else if (cantidad > 24999) {
    cobro = cantidad * .25
    aseguramiento = 2000
    cobroCliente = cobro + aseguramiento
    libreCliente = cantidad - cobroCliente
  }

  else if (cantidad > 14999) {
    cobro = cantidad * .25
    aseguramiento = 1700
    cobroCliente = cobro + aseguramiento
    libreCliente = cantidad - cobroCliente
  }

  else if (cantidad > 0) {
    cobro = cantidad * .25
    aseguramiento = 1300
    cobroCliente = cobro + aseguramiento
    libreCliente = cantidad - cobroCliente
  }

  //  formato moneda
  montoPesos = helpers.formatterPeso.format(cantidad)
  cobroPesos = helpers.formatterPeso.format(cobro)
  if (aseguramiento === 'Incluido') {
    aseguramientoPesos = 'Incluido'
  }
  else {
    aseguramientoPesos = helpers.formatterPeso.format(aseguramiento)
  }
  cobroClientePesos = helpers.formatterPeso.format(cobroCliente)
  libreClientePesos = helpers.formatterPeso.format(libreCliente)

  // // objeto que recibe la vista result
  retiro = {
    montoPesos,
    cobroPesos,
    aseguramientoPesos,
    cobroClientePesos,
    libreClientePesos,
  }

  return (retiro)
}

helpers.costoforaneo2 = (cantidad) => {
  let cobro
  let aseguramiento
  let cobroCliente
  let libreCliente

  cobro = cantidad * .30
  aseguramiento = 'Incluido'
  cobroCliente = cobro
  libreCliente = cantidad - cobro

  //  formato moneda
  montoPesos = helpers.formatterPeso.format(cantidad)
  cobroPesos = helpers.formatterPeso.format(cobro)
  if (aseguramiento === 'Incluido') {
    aseguramientoPesos = 'Incluido'
  }
  else {
    aseguramientoPesos = helpers.formatterPeso.format(aseguramiento)
  }
  cobroClientePesos = helpers.formatterPeso.format(cobroCliente)
  libreClientePesos = helpers.formatterPeso.format(libreCliente)

  // // objeto que recibe la vista result
  retiro = {
    montoPesos,
    cobroPesos,
    aseguramientoPesos,
    cobroClientePesos,
    libreClientePesos,
  }

  return (retiro)
}

//valida la sucursal
helpers.cotizacion = (cantidad, sucursal) => {

  if (sucursal == "Campeche" || "Campeche2" || "Campeche3") {

    helpers.costoLocal(cantidad)
  }

  else if (sucursal == "Cancun" || "Cancun2" || "Carmen" || "Chetumal" || "Cozumel" || "Cuautitlan" || "Cuernavaca" || "Cuernavaca2" || "Ixtapaluca" || "Merida" || "Palenque" || "Playa del Carmen" || "Tizimin" || "Valladolid" || "Villahermosa") {

    helpers.costoforaneo1(cantidad)
  }

  else if (sucursal == "Champoton" || "Candelaria" || "Escarcega") {

    helpers.costoforaneo2(cantidad)
  }

}

//Valida el usuario para validar si usa body o user
helpers.calculaCosto = (permiso, body, user) => {
  if (permiso === "Administrador") {

    let cantidad = body.montoRetiro
    let sucursal = body.zona

    helpers.cotizacion(cantidad, sucursal)

  }

  else {

    let cantidad = body.montoRetiro
    let sucursal = user.zona

    helpers.cotizacion(cantidad, sucursal)

  }

}

module.exports = helpers;