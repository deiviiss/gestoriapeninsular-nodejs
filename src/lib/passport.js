// define los metodos de autentificación

const passport = require('passport');
const localStrategy = require('passport-local').Strategy //tipo de autentificación local

const pool = require('../database');
const helpers = require('../lib/cifrator');


//login de usuario
passport.use('local.login', new localStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  // console.log(req.body)
  // console.log(username)
  // console.log(password)

  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    console.log(user)
    const validarPassword = await helpers.comparaPassword(password, user.password);
    console.log(validarPassword)
    if (validarPassword) {
      done(null, user, req.flash('success', 'Bienvenido ' + user.username));
    } else {
      done(null, false, req.flash('fail', 'Constraseña incorrecta'));
    }
  } else {
    return done(null, false, req.flash('fail', 'Usuario no existe'));
  }

}));


//registro de usuario
passport.use('local.signup', new localStrategy({ //configuración de la autentificación
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //para poder recibir datos adicionales en el registro de usuario
}, async (req, username, password, done) => {//define lo que hara después de autenticar con done
  const { fullname, zona } = req.body;
  // const { zona } = req.body;
  const newUser = {
    username: username,
    password: password,
    fullname: fullname,
    zona: zona
  };
  console.log(req.body)
  console.log(username)
  console.log(password)
  newUser.password = await helpers.encript(password); //crea el user en la base de datos
  const result = await pool.query('INSERT INTO users SET ?', [newUser]);
  newUser.id = result.insertId; //usa la propiedad del objeto devuelto por la consulta sql
  return done(null, newUser); //lo almacena en una sesión
}));

//serializar el usuario, guarda el id del usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//deserializar el usuario, toma el id guardado
passport.deserializeUser(async (idusers, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE idusers=?', [idusers]);
  done(null, rows[0]);
});