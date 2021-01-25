var form = document.formulario_cotizar;
var elementos = form.elements;

// función para enviar mensaje

function mandarAlert(mensaje) {
  alertify.alert('Cotización GP', mensaje);
}

//validar inputs

var validarInputs = function () {
  for (var i = 0; i < elementos.length; i++) {
    if (elementos[i].type == 'number') {
      if (elementos[i].value == 0) {
        // console.log('El campo ' + elementos[i].name + ' esta incompleto');
        elementos[i].className = elementos[i].className + ' error';
        return false;
      } else {
        elementos[i].className = elementos[i].className.replace + ('error', '');
      }
    }
  };

  return true;
}

//envia formulario

var enviar = function (e) {
  // console.log(form)
  if (!validarInputs()) {
    let mensaje = "Ingresa una cantidad."

    mandarAlert(mensaje)
    e.preventDefault();
  }
  //  else {
  //   console.log('Envia los datos')
  //   e.preventDefault();
  // }
};

//funciones blur y focus
var focusInput = function () {
  this.parentElement.children[1].className = 'label active';
  this.parentElement.children[0].className = this.parentElement.children[0].className.replace('error', '');
};

var blurInput = function () {
  if (this.value <= 0) {
    this.parentElement.children[1].className = 'label';
    this.parentElement.children[0].className = this.parentElement.children[0].className + " error";
  }
};

//eventos
form.addEventListener('submit', enviar);

for (var i = 0; i < elementos.length; i++) {
  if (elementos[i].type == 'number') {
    elementos[i].addEventListener('focus', focusInput);
    elementos[i].addEventListener('blur', blurInput)
  }
};