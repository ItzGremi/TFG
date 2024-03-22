const express = require('express');
const app = express();

//Añadimos el puerto
app.set('port', process.env.PORT || 4000);

//Introducimos el motor de plantillas, siempre poniendo primero view engine y después el motor que has integrado
app.set('view engine', 'ejs');

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/', require('./router'));


//Lo que escucha el servidor
app.listen(app.get('port'), ()=>{
    console.log(`El servidor está escuchando en el puerto ${app.get('port')}`);
});