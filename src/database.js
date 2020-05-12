//conexión con mysql

const mysel = require('mysql');
const { database } = require('./keys'); //parámetros de la conexión

const pool = mysql.createPool(database);//crea la conexión en secuencia