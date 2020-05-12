//start app

//dependends
const express = require('express');
const morgan = require('morgan');
const exhbs = require('express-handlebars'); //motor plantillas
const path = require('path');

//inizializations
const app = express();

//settings
app.set('port', process.env.PORT || 3000); //server port
app.set('views', path.join(__dirname, '../views')) //ruta para las vistas mediante path.join(_dirname)

app.engine('.hbs', exhbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs'); //motor de plantillas

//middlewares (peticiones)
app.use(morgan('dev')); //mensajes de servidor
app.use(express.urlencoded({ extended: false })) //metodo de express que permite entender los datos.
app.use(express.json()) ////metodo de express que permite entender archivos json.

//global variables
app.use((req, res, next) => {
  next();
})

//routes
app.use(require('./routes/route.js'))
app.use(require('./routes/authentication.js')) //ruta de autentuficación
app.use('/links', require('./routes/links.js'))//ruta de links con prefijo /links/archivo

//public
app.use(express.static(path.join(__dirname, 'public')));//archivos estaticos

//starting the server
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
})