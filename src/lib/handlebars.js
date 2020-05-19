//funciones

const { format } = require('timeago.js'); //requiere el metodo format


const helpers = {} //objeto a utilizar desde las vistas

//metodos del objeto

//Muestra fecha
helpers.showTime = (timestamp) => {
  return format(timestamp) //recibe la fecha ilegible de la base de datos
}

module.exports = helpers;