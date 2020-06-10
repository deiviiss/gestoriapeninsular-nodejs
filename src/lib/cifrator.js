//cifra y compara los password

const bcryptjs = require('bcryptjs');

const cifrator = {};


//metodos del objeto

//encripta contraseña
cifrator.encryptaPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);//metodo de bcryptjs que crea una cadena de caraccteres (salt)
  const hashPassword = await bcryptjs.hash(password, salt);//metodo de bcryptjs que cifra la contraseña
  return hashPassword;
};

//compara contraseña
cifrator.comparaPassword = async (password, savedPassword) => {
  console.log('Comparación de los pass', password, savedPassword)
  try {
    return await bcryptjs.compare(password, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

module.exports = cifrator;