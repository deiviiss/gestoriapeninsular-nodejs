//almacena las llaves para utilzar el servicio, numero de puerto conexion y dirección de la base de datos

const newLocal = require('dotenv').config();

module.exports = {
  database: {
    host: process.env.CLEVER_HOST,
    user: process.env.CLEVER_USER,
    password: process.env.CLEVER_PASSWORD,
    port: process.env.CLEVER_PORT,
    database: process.env.CLEVER_DATABASE
  }
}