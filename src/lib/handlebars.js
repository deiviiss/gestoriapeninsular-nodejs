//Fuctions

// const { body } = require('express-validator');
// const { format } = require('timeago.js'); //requiere el metodo format

const helpers = {} //objeto a utilizar desde las vistas

//metodos del objeto

//Muestra fecha
// helpers.showTime = (timestamp) => {
//   return format(timestamp) //recibe la fecha ilegible de la base de datos
// }

// convierte el numero en moneda
helpers.formatterPeso = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

//recibe el record con los clientes desde la base
helpers.formatterCustomers = (sinformato) => {
  // Condición que recibe el record
  if (sinformato.length > 0) {
    // ciclo for para iterar records recibidos
    for (var i = 0; i < sinformato.length; i++) {

      let montoPeso = (sinformato[i].monto)
      let fechaFormatTramite = (sinformato[i].fecha_tramite)
      let fechaFormatRetiro = (sinformato[i].fecha_ultimo_retiro)
      let fechaFormatSolucion = (sinformato[i].fecha_solucion)
      let fechaFormatStatus = (sinformato[i].fecha_status)

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

      dateTramite = new Date(fechaFormatTramite) //new Date() Objeto de Js para manejo de fechas
      dateRetiro = new Date(fechaFormatRetiro) //new Date() Objeto de Js para manejo de fechas
      dateStatus = new Date(fechaFormatStatus) //new Date() Objeto de Js para manejo de fechas
      dateSolucion = new Date(fechaFormatSolucion) //new Date() Objeto de Js para manejo de fechas

      sinformato[i].monto = helpers.formatterPeso.format(montoPeso)
      sinformato[i].fecha_tramite = dateTramite.getDate() + '/' + month[dateTramite.getMonth()] + '/' + dateTramite.getFullYear();

      //condiciona las fechas null
      if (fechaFormatRetiro === null) {
        sinformato[i].fecha_ultimo_retiro = 'Sin retiro'
      }
      else {
        (sinformato[i].fecha_ultimo_retiro = dateRetiro.getDate() + '/' + month[dateRetiro.getMonth()] + '/' + dateRetiro.getFullYear());
      }

      if (fechaFormatStatus === null) {
        sinformato[i].fecha_status = 'En espera'
      }
      else {
        sinformato[i].fecha_status = dateStatus.getDate() + '/' + month[dateStatus.getMonth()] + '/' + dateStatus.getFullYear();
      }

      if (fechaFormatSolucion === null) {
        sinformato[i].fecha_solucion = 'En espera'
      }
      else {
        sinformato[i].fecha_solucion = dateSolucion.getDate() + '/' + month[dateSolucion.getMonth()] + '/' + dateSolucion.getFullYear();
      }

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

//formato fecha que recibe
helpers.fecha = (fecha) => {
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

  fechaActual = fecha.getDate() + '/' + month[fecha.getMonth()] + '/' + fecha.getFullYear()

  return fechaActual
}

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
      { zona: 'Champoton' },
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
      { zona: 'Champoton' },
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

//número de semana
helpers.semanaISO = ($fecha) => {

  if ($fecha.match(/\//)) {
    $fecha = $fecha.replace(/\//g, "-", $fecha); //Permite que se puedan ingresar formatos de fecha ustilizando el "/" o "-" como separador
  };

  $fecha = $fecha.split("-"); //Dividimos el string de fecha en trozos (dia,mes,año)
  $dia = eval($fecha[0]);
  $mes = eval($fecha[1]);
  $ano = eval($fecha[2]);

  console.log($dia);
  console.log($mes);
  console.log('Año ' + Math.floor($ano));

  if ($mes == 1 || $mes == 2) {
    //Cálculos si el mes es Enero o Febrero
    $a = $ano - 1;
    $b = Math.floor($a / 4) - Math.floor($a / 100) + Math.floor($a / 400);
    $c = Math.floor(($a - 1) / 4) - Math.floor(($a - 1) / 100) + Math.floor(($a - 1) / 400);
    $s = $b - $c;
    $e = 0;
    $f = $dia - 1 + (31 * ($mes - 1));
  } else {
    //Calculos para los meses entre marzo y Diciembre
    $a = $ano;
    $b = Math.floor($a / 4) - Math.floor($a / 100) + Math.floor($a / 400);
    $c = Math.floor(($a - 1) / 4) - Math.floor(($a - 1) / 100) + Math.floor(($a - 1) / 400);
    $s = $b - $c;
    $e = $s + 1;
    $f = $dia + Math.floor(((153 * ($mes - 3)) + 2) / 5) + 58 + $s;
  };

  //Adicionalmente sumándole 1 a la variable $f se obtiene numero ordinal del dia de la fecha ingresada con referencia al año actual.

  //Estos cálculos se aplican a cualquier mes
  $g = ($a + $b) % 7;
  $d = ($f + $g - $e) % 7; //Adicionalmente esta variable nos indica el dia de la semana 0=Lunes, ... , 6=Domingo.
  $n = $f + 3 - $d;

  if ($n < 0) {
    //Si la variable n es menor a 0 se trata de una semana perteneciente al año anterior
    $semana = 53 - Math.floor(($g - $s) / 5);
    $ano = $ano - 1;
  } else if ($n > (364 + $s)) {
    //Si n es mayor a 364 + $s entonces la fecha corresponde a la primera semana del año siguiente.
    $semana = 1;
    $ano = $ano + 1;
  } else {
    //En cualquier otro caso es una semana del año actual.
    $semana = Math.floor($n / 7) + 1;
  };

  return $semana + "-" + $ano; //La función retorna una cadena de texto indicando la semana y el año correspondiente a la fecha ingresada   
};

module.exports = helpers;