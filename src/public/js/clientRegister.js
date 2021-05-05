var form = document.formulario_cliente;
var elementos = form.elements;
let sdescontadas = document.getElementById("sdescontadas");
let fretiro = document.getElementById("fecha_ultimo_retiro");
let curp = document.getElementById("curp");
let nss = document.getElementById("nss");
let rfc = document.getElementById("rfc");
let umf = document.getElementById("umf");



//funciones

var validarInputs = function () {

  //valida si hay semanas descontadas
  if (sdescontadas.value != 0) {
    if (fretiro.value == "") {
      console.log('Cliente con semanas descontadas');
      fretiro.className = fretiro.className + 'error';
      return false;
    }
    else {
      fretiro.className = fretiro.className.replace + ('error', '');
    }
  }

  //valida curp
  if (curp.value.length != 18) {
    console.log('Curp incorrecta');
    curp.className = curp.className + 'error';
    return false;
  }

  //valida nss
  if (nss.value.length != 11) {
    console.log('NSS incorrecto');
    nss.className = nss.className + 'error';
    return false;
  }

  //valida umf
  if (umf.value.length != 2) {
    console.log('UMF incorrecto');
    umf.className = umf.className + 'error';
    return false;
  }

  //valida ref
  if (rfc.value.length < 10 || rfc.value.length > 13) {
    console.log('RFC incorrecto');
    rfc.className = rfc.className + 'error';
    return false;
  }

  // Ciclo que valida campos vacios
  for (var i = 0; i < elementos.length; i++) {

    if (elementos[i].type == 'text' || elementos[i].type == 'tel' || elementos[i].type == 'select-one' || elementos[i].type == 'number') {
      if (elementos[i].value == "") {
        console.log('El campo ' + elementos[i].name + ' esta incompleto');
        elementos[i].className = elementos[i].className + ' error';
        return false;
      }
      else {
        elementos[i].className = elementos[i].className.replace + ('error', '');
      }
    }
  };

  return true;

};

var enviar = function (e) {
  if (!validarInputs()) {
    console.log('Falto validar los Input')
    e.preventDefault();
  } else {
    console.log('Envia los datos')
    // e.preventDefault();
  }
};

//funciones blur y focus
var focusInput = function () {
  this.parentElement.children[1].className = 'label active';
  this.parentElement.children[0].className = this.parentElement.children[0].className.replace('error', '');
};

var blurInput = function () {
  if (this.value <= "") {
    this.parentElement.children[1].className = 'label';

    this.parentElement.children[0].className = this.parentElement.children[0].className + " error";
  }
};

//eventos
form.addEventListener('submit', enviar);

// ciclo para el evento a cada elemento
for (var i = 0; i < elementos.length; i++) {
  if (elementos[i].type == 'text' || elementos[i].type == 'tel' || elementos[i].type == 'select-one' || elementos[i].type == 'number') {
    elementos[i].addEventListener('focus', focusInput);
    elementos[i].addEventListener('blur', blurInput)
  }
};