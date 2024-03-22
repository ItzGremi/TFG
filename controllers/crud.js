const conexion = require('../database/db');

exports.guardar_noticia = (req, res) => {
    const noticia = req.body.noticia;
    const usuario = req.session.usuario; // Obtener el nombre de usuario de la sesión actual

    //FECHA Y HORA ACTUAL
    const fechaHoraActual = new Date();
    const fecha_publicacion = formatearFechaHora(fechaHoraActual);

    conexion.query('INSERT INTO noticias SET ?', { noticia: noticia, usuario: usuario, fecha_publicacion: fecha_publicacion }, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.redirect('/noticias');
        }
    });
}

exports.editar_noticia = (req, res) => {
    const noticia = req.body.noticia;
    const id = req.body.id;
    const usuario = req.session.usuario; // Obtener el nombre de usuario de la sesión actual

    // Verificar si el usuario actual es el creador original de la noticia
    conexion.query('SELECT usuario FROM noticias WHERE id=?', [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            const creadorOriginal = results[0].usuario;
            if (creadorOriginal === usuario) { // Solo permitir la edición si el usuario actual es el creador original
                //FECHA Y HORA ACTUAL
                const fechaHoraActual = new Date();
                const fecha_publicacion = formatearFechaHora(fechaHoraActual);

                conexion.query('UPDATE noticias SET ? WHERE id=?', [{ noticia: noticia, fecha_publicacion: `Editado a las ${fecha_publicacion}` }, id], (error, results) => {
                    if (error) {
                        throw error;
                    } else {
                        res.redirect('/noticias');
                    }
                });
            } else {
                res.redirect('/noticias');
            }
        }
    });
}

// Función para formatear la fecha y la hora
function formatearFechaHora(fechaHora) {
    const horaExacta = fechaHora.getHours().toString().padStart(2, '0');
    const minutosExactos = fechaHora.getMinutes().toString().padStart(2, '0');
    const segundosExactos = fechaHora.getSeconds().toString().padStart(2, '0');

    const diaExacto = fechaHora.getDate();
    const mesExacto = (fechaHora.getMonth() + 1).toString().padStart(2, '0');
    const añoExacto = fechaHora.getFullYear();

    return `${diaExacto}/${mesExacto}/${añoExacto} - ${horaExacta}:${minutosExactos}:${segundosExactos}`;
}


exports.registro = async (req, res) => {
    const bcryptjs = require('bcryptjs');
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    conexion.query('INSERT INTO usuarios SET ?', {usuario:user, contraseña:passwordHaash}, async(error, results)=>{
        if(error){
            throw error;
        } else {
            res.render('registro', {
                alert: true,
                alertTitle: "Registro",
                alertMessage: "¡Registro Completado!",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta:''
            })
        }
    })
}

exports.iniciosesion = async (req, res) => {
    const bcryptjs = require('bcryptjs');
    const user = req.body.user;
    const pass = req.body.pass;
    if (user && pass) {
        conexion.query('SELECT id, usuario, contraseña FROM usuarios WHERE usuario = ?', [user], async (error, results) => {
            if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].contraseña))) {
                res.render('iniciosesion', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o contraseña incorrectas",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'iniciosesion'
                })
            } else {
                // Inicializar loggedin en la sesión
                req.session.loggedin = true;
                req.session.usuario = user; // Opcional: almacenar el nombre de usuario en la sesión
                res.render('iniciosesion', {
                    alert: true,
                    alertTitle: "Has iniciado sesión",
                    alertMessage: "Inicio de sesión correcta",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }
        })
    } else {
        res.render('iniciosesion', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "¡Por favor ingresa tu usuario y contraseña!",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: 1500,
            ruta: 'iniciosesion'
        });
    }
}



