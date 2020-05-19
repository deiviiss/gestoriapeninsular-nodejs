//start app

//dependends
const express = require('express');
const morgan = require('morgan');
const exhbs = require('express-handlebars'); //motor plantillas
const path = require('path');
const flash = require('connect-flash'); //mostrar mensajes
const session = require('express-session'); //crea la sesión
const MySQLStore = require('express-mysql-session')//para guardar la sesión en la base de datos
const { database } = require('./keys');//solicita la conexión a la bd
const passport = require('passport'); //para utiliar sus metodos


//inizializations
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 3000); //server port
app.set('views', path.join(__dirname, 'views')) //ruta para las vistas mediante path.join(_dirname)

app.engine('.hbs', exhbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs'); //motor de plantillas

//middlewares (peticiones)
app.use(session({ //configuración de sesión
  secret: 'gestoriamysqlsession',
  resave: false, //no renueva la sesión
  saveUninitialized: false, //no vuelve a establecer la sesión
  store: new MySQLStore(database)//guarda la sesión en la base de datos
}));
app.use(flash()); //mostrar mensajes
app.use(morgan('dev')); //mensajes de servidor
app.use(express.urlencoded({ extended: false })); //metodo de express que permite entender los datos.
app.use(express.json()); //metodo de express que permite entender archivos json.
app.use(passport.initialize()); //inicializa passport
app.use(passport.session()); //indica donde guardar los datos de la sesión


//global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message'); //mensaje disponible en todas las vistas
  next();
})

//routes
app.use(require('./routes/index.js'))
app.use(require('./routes/authentication.js')) //ruta de autentuficación
app.use('/links', require('./routes/links.js'))//ruta de links con prefijo /links/archivo

//public
app.use(express.static(path.join(__dirname, 'public')));//archivos estaticos

//starting the server
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
})