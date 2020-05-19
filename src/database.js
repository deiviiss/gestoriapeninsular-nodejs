//conexión con mysql

const mysql = require('mysql');
const { promisify } = require('util'); //modulo de nojs que permite usar promesas async await
const { database } = require('./keys'); //parámetros de la conexión

const pool = mysql.createPool(database);//crea la conexión en secuencia

//inicia la conexión con database
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('database connection was closed')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.log('database has to many connections')
    }
    if (err.code === 'ECONNREFUSED') {
      console.log('database connection was refused')
    }
  }

  if (connection) connection.release();
  console.log('database is connected')
  return;
})

// promisify pool querys, use async await
pool.query = promisify(pool.query);

module.exports = pool;