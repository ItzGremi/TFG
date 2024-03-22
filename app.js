const express = require('express');
const app = express();
const session = require('express-session');

// Configuración de express-session
app.use(session({
    secret: 'mi_secreto', // Cambia esto por una cadena de tu elección
    resave: false,
    saveUninitialized: true
}));

// Añadimos el puerto
app.set('port', process.env.PORT || 4000);

// Introducimos el motor de plantillas, siempre poniendo primero view engine y después el motor que has integrado
app.set('view engine', 'ejs');

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Importamos y usamos el enrutador
app.use('/', require('./router'));

const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

// Lo que escucha el servidor
app.listen(app.get('port'), ()=>{
    console.log(`El servidor está escuchando en el puerto ${app.get('port')}`);
});
