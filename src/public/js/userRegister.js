var form = document.formulario_cliente;
var elementos = form.elements;

console.log(elementos);

//funciones

//mostrar esconder contraseñas

function passHide() {
  var pass = document.getElementById("pass").type;
  var pass2 = document.getElementById("pass2").type;

  if (pass == 'password' || pass2 == 'password') {
    $('#pass').removeAttr('type');
    $('#pass').attr('type', 'text');
    $('#show').addClass('fa-eye-slash').removeClass('fa-eye');
    $('#pass2').removeAttr('type');
    $('#pass2').attr('type', 'text');
    $('#show2').addClass('fa-eye-slash').removeClass('fa-eye');

  } else {
    $('#pass').attr('type', 'password');
    $('#show').addClass('fa-eye').removeClass('fa-eye-slash');
    $('#pass2').attr('type', 'password');
    $('#show2').addClass('fa-eye').removeClass('fa-eye-slash');
  }
}

//validar inputs

var validarInputs = function () {
  for (var i = 0; i < elementos.length; i++) {
    if (elementos[i].type == 'text' || elementos[i].type == 'password') {
      if (elementos[i].value == 0) {
        console.log('El campo ' + elementos[i].name + ' esta incompleto');
        elementos[i].className = elementos[i].className + ' error';
        return false;
      } else {
        elementos[i].className = elementos[i].className.replace + ('error', '');
      }

      //compara passwords
      if (elementos.password.value !== elementos.password2.value) {
        elementos.password.value = ''
        elementos.password2.value = ''

        console.log('No coinciden')
        $('#pass').removeAttr('type');
        $('#pass').attr('type', 'text');
        $('#show').addClass('fa-eye-slash').removeClass('fa-eye');
        $('#pass2').removeAttr('type');
        $('#pass2').attr('type', 'text');
        $('#show2').addClass('fa-eye-slash').removeClass('fa-eye');

        return false
      }

    }
  };

  //se cambia el atributo type antes de enviar el formulario
  $('#pass').attr('type', 'password');
  $('#show').addClass('fa-eye').removeClass('fa-eye-slash');
  $('#pass2').attr('type', 'password');
  $('#show2').addClass('fa-eye').removeClass('fa-eye-slash');
  console.log('Cambiamos el type')

  return true;
}

//envia formulario

var enviar = function (e) {
  if (!validarInputs()) {
    console.log('Hay campos sin llenar')
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