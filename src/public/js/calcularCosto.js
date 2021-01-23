// función para enviar mensaje

function mandarAlert(mensaje) {
  alertify.alert('Cotización GP', mensaje);
}

//función para cambiar a moneda

const formatterPeso = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

//function focus & blur

// document.querySelector('input').addEventListener('focus', () => {
//   console.log('focus');
//   document.querySelector('.label').classList.toggle('active')
// })

// document.querySelector('input').addEventListener('blur', () => {
//   console.log('Blur')
//   document.querySelector('.label').classList.toggle('active')
// })

//>>>>>>>>>>>>>>>>>>calculadora

//=================================== funciones para validar sucursal

//valida sucursal para calcular comisión de asesor

// function calcularComision() {
//   let sucursalComision = sucursal.value

//   if (sucursalComision == "comisionLocal") {
//     comisionLocal()
//   }

//   else if (sucursalComision == "comisionForanea") {
//     comisionForanea()
//   }x|
//   else {

//     let mensaje = "Elige una sucursal"

//     mandarAlert(mensaje)
//   }
// }


//valida sucursal para calcular retiro

function calcularRetiro() {
  let sucursalRetiro = sucursal.value

  if (sucursalRetiro == "retiroLocal") {
    calcularRetiroLocal()
  }

  else if (sucursalRetiro == "retiroForaneo") {
    calcularRetiroForaneo()
  }
  else {

    let mensaje = "Elige una sucursal"

    mandarAlert(mensaje)
  }

}


//=================================== funciones para calcular operaciones

//función para calcular retiro local

function calcularRetiroLocal() {
  let cantidad = cantidadARetirar.value;

  if (cantidad == 42510) {
    let cobroPesos = cantidad * .30;
    let libreClientePesos = cantidad - cobroPesos

    let cobro = formatterPeso.format(cobroPesos)
    let libreCliente = formatterPeso.format(libreClientePesos)

    let mensaje = "Asesoría: " + cobro + "<br/>" + "Aseguramiento: Incluido <br/>" + "Total cobro: " + cobro + "<br/>" + "<br/>" + "Cliente: " + libreCliente

    mandarAlert(mensaje)
  }

  else if (cantidad > 24999) {
    let cobroPesos = cantidad * .25;
    let aseguramientoPesos = 2000
    let cobroClientePesos = cobroPesos + aseguramientoPesos
    let libreClientePesos = cantidad - cobroClientePesos

    let cobro = formatterPeso.format(cobroPesos)
    let aseguramiento = formatterPeso.format(aseguramientoPesos)
    let cobroCliente = formatterPeso.format(cobroClientePesos)
    let libreCliente = formatterPeso.format(libreClientePesos)

    let mensaje = "Asesoría: " + cobro + "<br/>" + "Aseguramiento: " + aseguramiento + "<br/>" + "Total: " + cobroCliente + "<br/>" + "<br/>" + "Cliente: " + libreCliente

    mandarAlert(mensaje)
  }

  else if (cantidad > 14999) {
    let cobroPesos = cantidad * .25;
    let aseguramientoPesos = 1700
    let cobroClientePesos = cobroPesos + aseguramientoPesos
    let libreClientePesos = cantidad - cobroClientePesos

    let cobro = formatterPeso.format(cobroPesos)
    let aseguramiento = formatterPeso.format(aseguramientoPesos)
    let cobroCliente = formatterPeso.format(cobroClientePesos)
    let libreCliente = formatterPeso.format(libreClientePesos)

    let mensaje = "Asesoría: " + cobro + "<br/>" + "Aseguramiento: " + aseguramiento + "<br/>" + "Total: " + cobroCliente + "<br/>" + "<br/>" + "Cliente: " + libreCliente

    mandarAlert(mensaje)
  }

  else if (cantidad > 0) {
    let cobroPesos = cantidad * .25;
    let aseguramientoPesos = 1300
    let cobroClientePesos = cobroPesos + aseguramientoPesos
    let libreClientePesos = cantidad - cobroClientePesos

    let cobro = formatterPeso.format(cobroPesos)
    let aseguramiento = formatterPeso.format(aseguramientoPesos)
    let cobroCliente = formatterPeso.format(cobroClientePesos)
    let libreCliente = formatterPeso.format(libreClientePesos)

    let mensaje = "Asesoría: " + cobro + "<br/>" + "Aseguramiento: " + aseguramiento + "<br/>" + "Total: " + cobroCliente + "<br/>" + "<br/>" + "Cliente: " + libreCliente

    mandarAlert(mensaje)
  }

  else {
    let mensaje = "Escribe una cantidad"

    mandarAlert(mensaje)
  }
}

//función para calcular retiro foraneo

function calcularRetiroForaneo() {
  let cantidad = cantidadARetirar.value;

  if (cantidad == 42510) {
    let cobroPesos = cantidad * .30;
    let libreClientePesos = cantidad - cobroPesos

    let cobro = formatterPeso.format(cobroPesos)
    let libreCliente = formatterPeso.format(libreClientePesos)

    let mensaje = "Asesoría: " + cobro + "<br/>" + "Aseguramiento: Incluido <br/>" + "Total cobro: " + cobro + "<br/>" + "<br/>" + "Cliente: " + libreCliente

    mandarAlert(mensaje)
  }

  else if (cantidad > 24999) {
    let cobroPesos = cantidad * .25;
    let aseguramientoPesos = 2000
    let cobroClientePesos = cobroPesos + aseguramientoPesos
    let libreClientePesos = cantidad - cobroClientePesos

    let cobro = formatterPeso.format(cobroPesos)
    let aseguramiento = formatterPeso.format(aseguramientoPesos)
    let cobroCliente = formatterPeso.format(cobroClientePesos)
    let libreCliente = formatterPeso.format(libreClientePesos)

    let mensaje = "Asesoría: " + cobro + "<br/>" + "Aseguramiento: " + aseguramiento + "<br/>" + "Total: " + cobroCliente + "<br/>" + "<br/>" + "Cliente: " + libreCliente

    mandarAlert(mensaje)
  }

  else if (cantidad > 14999) {
    let cobroPesos = cantidad * .25;
    let aseguramientoPesos = 1700
    let cobroClientePesos = cobroPesos + aseguramientoPesos
    let libreClientePesos = cantidad - cobroClientePesos

    let cobro = formatterPeso.format(cobroPesos)
    let aseguramiento = formatterPeso.format(aseguramientoPesos)
    let cobroCliente = formatterPeso.format(cobroClientePesos)
    let libreCliente = formatterPeso.format(libreClientePesos)

    let mensaje = "Asesoría: " + cobro + "<br/>" + "Aseguramiento: " + aseguramiento + "<br/>" + "Total: " + cobroCliente + "<br/>" + "<br/>" + "Cliente: " + libreCliente

    mandarAlert(mensaje)
  }

  else if (cantidad > 0) {
    let cobroPesos = cantidad * .25;
    let aseguramientoPesos = 1300
    let cobroClientePesos = cobroPesos + aseguramientoPesos
    let libreClientePesos = cantidad - cobroClientePesos

    let cobro = formatterPeso.format(cobroPesos)
    let aseguramiento = formatterPeso.format(aseguramientoPesos)
    let cobroCliente = formatterPeso.format(cobroClientePesos)
    let libreCliente = formatterPeso.format(libreClientePesos)

    let mensaje = "Asesoría: " + cobro + "<br/>" + "Aseguramiento: " + aseguramiento + "<br/>" + "Total: " + cobroCliente + "<br/>" + "<br/>" + "Cliente: " + libreCliente

    mandarAlert(mensaje)
  }

  else {
    let mensaje = "Escribe una cantidad"

    mandarAlert(mensaje)
  }
}

//función para calcular comisión local

// function comisionLocal() {
//   let cantidad = cantidadARetirar.value;

//   if (cantidad > 36965) {
//     let comisionPesos = cantidad * .05
//     let comision = formatterPeso.format(comisionPesos)

//     let mensaje = "Comisión: " + comision

//     mandarAlert(mensaje)
//   }
//   else if (cantidad > 30800) {
//     let comisionPesos = 1500
//     let comision = formatterPeso.format(comisionPesos)

//     let mensaje = "Comisión: " + comision

//     mandarAlert(mensaje)
//   }
//   else if (cantidad > 12000) {
//     let comisionPesos = 1000
//     let comision = formatterPeso.format(comisionPesos)

//     let mensaje = "Comisión: " + comision

//     mandarAlert(mensaje)
//   }
//   else if (cantidad > 0) {
//     let mensaje = "Comisión: $500.00"

//     mandarAlert(mensaje)
//   }
//   else {
//     let mensaje = "Escribe una cantidad"

//     mandarAlert(mensaje)
//   }
// }

//función para calcular comisión foranéa

// function comisionForanea() {

//   let cantidad = cantidadARetirar.value

//   if (cantidad == "") {
//     let mensaje = "Escribe una cantidad"

//     mandarAlert(mensaje)
//   }

//   else {
//     let comisionPesos = cantidad * .05
//     let comision = formatterPeso.format(comisionPesos)

//     let mensaje = "Comisión: " + comision

//     mandarAlert(mensaje)
//   }
// }