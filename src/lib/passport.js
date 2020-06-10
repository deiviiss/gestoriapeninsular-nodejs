// define los metodos de autentificación

const passport = require('passport');
const localStrategy = require('passport-local').Strategy; //tipo de autentificación local

const pool = require('../database');
const cifrator = require('./cifrator');

//login de usuario
passport.use(
  'local.login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      console.log(req.body)
      console.log(username)
      console.log('La contraseña', password)

      const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

      if (rows.length > 0) {
        const user = rows[0];
        const validarPassword = await cifrator.comparaPassword(password, user.password);
        console.log('Resultado de la validación del pass', validarPassword)
        if (validarPassword) {
          done(null, user, req.flash('success', 'Bienvenido ' + user.username));
        } else {
          done(null, false, req.flash('fail', 'Constraseña incorrecta'));
        }
      } else {
        return done(null, false, req.flash('fail', 'Usuario no existe'));
      }
    }
  )
);

//registro de usuario
passport.use(
  'local.register',
  new localStrategy(
    { //configuración de la autentificación
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true //para poder recibir datos adicionales en el registro de usuario
    },
    async (req, username, password, done) => {//define lo que hara después de autenticar con done
      const { fullname, zona } = req.body; //obtiene los datos de req.body
      // const { zona } = req.body;
      let newUser = { //objeto con un nuevo usuario que guarda los datos
        username,//username: username
        password,
        fullname,
        zona
      };

      newUser.password = await cifrator.encryptaPassword(password); //crea la contraseña encriptada
      console.log(password);
      const result = await pool.query('INSERT INTO users SET ?', newUser); //guarda en database
      // console.log(result)
      newUser.id = result.insertId; //usa la propiedad del objeto devuelto por la consulta sql
      console.log(newUser)
      return done(null, newUser); //lo almacena en una sesión
    }
  )
);

//serializar el usuario, guarda el id del usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
  console.log('Enserializa', user.id)
});

//deserializar el usuario, toma el id guardado
passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id=?', [id]);
  console.log('Des enzerializa', rows)
  done(null, rows[0]);
});