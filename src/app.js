//start app

//dependends
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars'); //motor plantillas
const session = require('express-session'); //crea la sesión para flash
const passport = require('passport'); //para utiliar sus metodos
const flash = require('connect-flash'); //mostrar mensajes
const MySQLStore = require('express-mysql-session')(session);//para guardar la sesión en la base de datos
// const bodyParser = require('body-parser');
// const cors = require('cors'); // http header

const { database } = require('./keys');//solicita la conexión a la bd

//handlebars if_equal
const isEqualHelperHandlerbar = function (a, b, opts) {
  if (a == b) {
    return opts.fn(this)
  } else {
    return opts.inverse(this)
  }
}

//inizializations
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 3000); //server port
app.set('views', path.join(__dirname, 'views')) //ruta para las vistas mediante path.join(_dirname), le dice a node donde están las vistas

app.engine('.hbs', exphbs({ // configuración motor de plantillas
  defaultLayout: 'main', //nombre de la plantilla principal
  layoutsDir: path.join(app.get('views'), 'layouts'), //une con el método join para unir views con layout
  partialsDir: path.join(app.get('views'), 'partials'), //une con el método join para unir views con partials
  extname: '.hbs', //nombre de la extensión
  helpers: require('./lib/handlebars'), // ruta de los helpers
  helpers: { if_equal: isEqualHelperHandlerbar } // usar funcion en vistas
}));
app.set('view engine', '.hbs'); // llama motor de plantillas

//middlewares (peticiones)
// app.use(cors()); //http header
app.use(morgan('dev')); //mensajes de servidor
app.use(express.urlencoded({ extended: false })); //metodo de express que permite entender los datos.
app.use(express.json()); //metodo de bodyParser que permite entender archivos json.

app.use(session({ //configuración de sesión para usar conect-flash
  secret: 'gestoriamysqlsession', //como guarda la sesión
  resave: false, //no renueva la sesión
  saveUninitialized: false, //no vuelve a establecer la sesión
  store: new MySQLStore(database)//guarda la sesión en la base de datos
}));
app.use(flash()); //mostrar mensajes
app.use(passport.initialize()); //inicializa passport
app.use(passport.session()); //indica donde guardar los datos de la sesión passport

//global variables
app.use((req, res, next) => {
  app.locals.success = req.flash('success'); //mensaje disponible en todas las vistas
  app.locals.fail = req.flash('fail'); //mensaje disponible en todas las vistas
  app.locals.user = req.user; //usuario disponible en todas las vistas
  next();
});

//routes
app.use(require('./routes/index.js')); //ruta inicial
app.use(require('./routes/calculate.js')); //ruta calcular
app.use(require('./routes/authentication.js')); //ruta de autenficación
app.use('/customer', require('./routes/customer.routes.js')); //ruta de customer con prefijo /customer/archivo
app.use(require('./routes/directory.js')); //ruta directorio users
app.use(require('./routes/resume.routes.js')); //ruta resume
app.use(require('./routes/altas.js')); //ruta altas
app.use(require('./routes/404.js'))

//public
app.use(express.static(path.join(__dirname, 'public')));//archivos estaticos

//starting the server
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
})