//Fuctions

const helpers = {} //objeto a utilizar desde las vistas

//métodos del objeto

//convierte la moneda en numero
// helpers.formatterNumber = (monto) => {

//   monto = monto.replace(",", "")
//   monto = parseFloat(monto.slice(1, -3))
//   return monto
// }

// convierte el numero en moneda
helpers.formatterPeso = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

//Formato fecha (dd/mes/yy)
helpers.formatterFecha = (fecha) => {
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

  fecha = fecha.getDate() + '/' + month[fecha.getMonth()] + '/' + fecha.getFullYear()

  return fecha
}

//Formato a clientes (moneda, fechas)
helpers.formatterCustomers = (customer) => {

  if (customer.length > 0) {
    //recorrer para acceder a propiedades
    for (var i = 0; i < customer.length; i++) {

      let montoPeso = (customer[i].monto)
      let fechaTramite = (customer[i].fecha_tramite)
      let fechaRetiro = (customer[i].fecha_ultimo_retiro)
      let fechaSolucion = (customer[i].fecha_solucion)
      let fechaStatus = (customer[i].fecha_status)
      let fechaCaptura = (customer[i].fecha_captura)

      //monto
      customer[i].monto = helpers.formatterPeso.format(montoPeso)

      //* condiciona las fechas null
      //Fecha de trámite
      if (fechaTramite != null || fechaTramite != undefined) {
        customer[i].fecha_tramite = helpers.formatterFecha(fechaTramite)
      }
      else {
        customer[i].fecha_tramite = 'Sin asignar'
      }

      //Fecha de último retiro
      if (fechaRetiro != null || fechaRetiro != undefined) {
        customer[i].fecha_ultimo_retiro = helpers.formatterFecha(fechaRetiro)
      }
      else {
        customer[i].fecha_ultimo_retiro = 'Sin retiro'
      }

      //Fecha de status
      if (fechaStatus != null || fechaStatus != undefined) {
        customer[i].fecha_status = helpers.formatterFecha(fechaStatus)
      }
      else {
        customer[i].fecha_status = 'Sin fecha'
      }

      //Fecha de solución
      if (fechaSolucion != null || fechaSolucion != undefined) {
        customer[i].fecha_solucion = helpers.formatterFecha(fechaSolucion)
      }
      else {
        customer[i].fecha_solucion = 'En espera'
      }

      //Fecha de captura
      if (fechaCaptura != null || fechaCaptura != undefined) {
        customer[i].fecha_captura = helpers.formatterFecha(fechaCaptura)
      }

    }
    return customer
  }
}

//Formato a altas (fecha)
helpers.formatterEditAlta = (customer) => {

  if (customer.length > 0) {
    //recorrer para acceder a propiedades
    for (let i = 0; i < customer.length; i++) {

      let fechaRetiro = customer[i].fecha_ultimo_retiro

      //valida si hay fecha convierte a yy-mm-dd
      if (fechaRetiro != null) {
        fechaRetiro = fechaRetiro.toLocaleDateString('en-GB');
        fechaRetiro = fechaRetiro.split("/").reverse().join("-")
        customer[i].fecha_ultimo_retiro = fechaRetiro
      }
    }
  }

  return customer
};

// Arreglo con las zona por region
//! pudiera convertirse en una consulta
helpers.region = (region) => {
  if (region === 1) {
    return region = [
      { zona: 'Campeche' },
      { zona: 'Campeche2' },
      { zona: 'Cuernavaca' },
      { zona: 'Mérida' }
    ]
  }

  else if (region === 2) {
    return region = [
      { zona: 'Cancun' },
      { zona: 'Cancun2' },
      { zona: 'Candelaria' },
      { zona: 'Chetumal' },
      { zona: 'Cozumel' },
      { zona: 'Playa del Carmen' },
    ]
  }

  else if (region === 3) {
    return region = [
      { zona: 'Campeche3' },
      { zona: 'Carmen' },
      { zona: 'Champotón' },
      { zona: 'Coatzacoalcos' },
      { zona: 'Palenque' },
      { zona: 'Villahermosa' }
    ]
  }

  else if (region === 4) {
    return region = [
      { zona: 'Cuautitlán' },
      { zona: 'Cuernavaca2' },
      { zona: 'Ixtapaluca' }
    ]
  }

  else if (region === 5) {
    return region = [
      { zona: 'Escarcega' },
      { zona: 'Valladolid' },
      { zona: 'Tizimín' }
    ]
  }

  else {
    return regiones = [
      { zona: 'Campeche' },
      { zona: 'Campeche2' },
      { zona: 'Campeche3' },
      { zona: 'Cancun' },
      { zona: 'Cancun2' },
      { zona: 'Candelaria' },
      { zona: 'Carmen' },
      { zona: 'Champotón' },
      { zona: 'Chetumal' },
      { zona: 'Coatzacoalcos' },
      { zona: 'Cozumel' },
      { zona: 'Cuautitlán' },
      { zona: 'Cuernavaca' },
      { zona: 'Cuernavaca2' },
      { zona: 'Escarcega' },
      { zona: 'Ixtapaluca' },
      { zona: 'Mérida' },
      { zona: 'Palenque' },
      { zona: 'Playa del Carmen' },
      { zona: 'Tizimin' },
      { zona: 'Valladolid' },
      { zona: 'Villahermosa' }
    ]
  }
}

//Retorna la region por zona
helpers.zona = (zona) => {
  switch (zona) {

    // region 1
    case "Campeche":
      return 1
    case "Campeche2":
      return 1
    case "Curnavaca":
      return 1
    case "Mérida":
      return 1

    // region 2
    case "Cancun":
      return 2
    case "Cancun2":
      return 2
    case "Candelaria":
      return 2
    case "Chetumal":
      return 2
    case "Cozumel":
      return 2
    case "Playa del Carmen":
      return 2

    //region 3
    case "Campeche3":
      return 3
    case "Carmen":
      return 3
    case "Champotón":
      return 3
    case "Coatzacoalcos":
      return 3
    case "Palenque":
      return 3
    case "Villahermosa":
      return 3

    //region 4
    case "Cuernavaca2":
      return 4
    case "Cuautitlán":
      return 4
    case "Ixtapaluca":
      return 4

    //region 5
    case "Escarcega":
      return 4
    case "Valladolid":
      return 4
    case "Tizimín":
      return 4
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

  // objeto que recibe la vista result
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

  // objeto que recibe la vista result
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

  // objeto que recibe la vista result
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