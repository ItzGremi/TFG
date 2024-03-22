const mysql = require('mysql');

const conexion = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    port: '3306',
    password:'1234',
    database:'joclock'
});

conexion.connect((error)=>{
    if(error){
        console.error('El error de conexión es: '+ error);
        return;
    }
    console.log('¡Conectado a la BD de MySql!');
});

module.exports = conexion;