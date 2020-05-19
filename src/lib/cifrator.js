//cifra los password

const bcryptjs = require('bcryptjs');
const helpers = {};


//metodos del objeto

//encripta contraseña
helpers.encript = async (password) => {
  const salt = await bcryptjs.genSalt(10);//metodo de bcryptjs que crea una hash
  const hashPassword = await bcryptjs.hash(password, salt); //metodo de bcryptjs que cifra la contraseña
  return hashPassword;
};

//compara contraseña
helpers.comparaPassword = async (password, savedPassword) => {
  console.log('Este es ', password)
  try {
    return await bcryptjs.compare(password, savedPassword)
  } catch (e) {
    console.log(e)
  }
};

module.exports = helpers;