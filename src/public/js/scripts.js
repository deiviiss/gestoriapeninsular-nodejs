var form = document.formulario_cliente;
var elementos = form.elements;

// console.log(elementos);

//funciones

var validarInputs = function () {
  for (var i = 0; i < elementos.length; i++) {
    if (elementos[i].type == 'text' || elementos[i].type == 'radio' || elementos[i].type == 'tel') {
      if (elementos[i].value == 0) {
        console.log('El campo ' + elementos[i].name + ' esta incompleto');
        elementos[i].className = elementos[i].className + ' error';
        return false;
      } else {
        elementos[i].className = elementos[i].className.replace + ('error', '');
      }
    }
  };
  return true;
};

var validarRadios = function () {
  var opciones = document.getElementsByName('service');
  var resultado = false;
  console.log(opciones);

  //recorre buscando radio
  for (var i = 0; i < elementos.length; i++) {
    if (elementos[i].type == 'radio' && elementos[i].name == 'service') {

      //recorre los radio buscando checked
      for (var o = 0; o < opciones.length; o++) {
        if (opciones[o].checked) {
          resultado = true;
          break;
        }
      }
      console.log('Las opciones ', opciones);
      if (resultado == false) {
        elementos[i].parentNode.className = elementos[i].parentNode.className + ' error';
        console.log('El campo servicio no está completo')
        return false;
      } else {
        elementos[i].parentNode.className = elementos[i].parentNode.className.replace('error', '');
        return true;
      }
    }
  }
};

var enviar = function (e) {
  if (!validarRadios()) {
    console.log('Falto validar los Radio')
    e.preventDefault();
  } else if (!validarInputs()) {
    console.log('Falto validar los Input')
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
  if (elementos[i].type == 'text' || elementos[i].type == 'radio' || elementos[i].type == 'tel') {
    elementos[i].addEventListener('focus', focusInput);
    elementos[i].addEventListener('blur', blurInput)
  }

};