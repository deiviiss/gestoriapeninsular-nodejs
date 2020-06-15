var form = document.formulario_cliente;
var elementos = form.elements;

console.log(elementos);

//funciones

var validarInputs = function () {
  //   for (var i = 0; i < elementos.length; i++) {
  //     if (elementos[i].type == 'text' || elementos[i].type == 'password') {
  //       if (elementos[i].value == 0) {
  //         console.log('El campo ' + elementos[i].name + ' esta incompleto');
  //         elementos[i].className = elementos[i].className + ' error';
  //         return false;
  //       } else {
  //         elementos[i].className = elementos[i].className.replace + ('error', '');
  //       }
  //     }
  //   };

  //compara passwords
  if (elementos.password.value !== elementos.password2.value) {
    elementos.password.value = ''
    elementos.password2.value = ''
    elementos.password.className = elementos.password.className + ' error'
    elementos.password2.className = elementos.password2.className + ' error'
  } else {
    elementos.password.className = elementos.password.replace('error', '')
    elementos.password2.className = elementos.password2.replace('error', '')
  }

  return true;
}


var enviar = function (e) {
  if (!validarInputs()) {
    console.log('Falto validar los Inputs')
    e.preventDefault();
  } else {
    console.log('Envia los datos')
    // e.preventDefault();
  }
};

//funciones blur y focus
//Optimizar funciones con el método toggle de JS para agregar y quitar la clase
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
  if (elementos[i].type == 'text' || elementos[i].type == 'password') {
    elementos[i].addEventListener('focus', focusInput);
    elementos[i].addEventListener('blur', blurInput)
  }
};