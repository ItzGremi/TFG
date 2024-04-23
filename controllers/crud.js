const conexion = require('../database/db');
const nodemailer = require('nodemailer');
const bcryptjs = require('bcryptjs');

exports.guardar_tarea = (req, res) => {
    const tarea = req.body.tarea;
    const usuario = req.session.usuario; // Obtener el nombre de usuario de la sesión

    conexion.query('INSERT INTO tareas SET ?', { tarea: tarea, usuario: usuario }, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.redirect('/tareas');
        }
    });
}


exports.editar_tarea = (req, res) => {
    const tarea = req.body.tarea;
    const id = req.body.id;

    conexion.query('UPDATE tareas SET tarea=? WHERE id=?', [tarea, id], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.redirect('/tareas');
        }
    });
}


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
    const { usuario, pass, correo } = req.body;

    // Verificar si ya existe un usuario con el mismo correo electrónico
    conexion.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (error, results) => {
        if (error) {
            throw error;
        } else if (results.length > 0) {
            // Si ya existe un usuario con el mismo correo electrónico, mostrar un mensaje de error
            res.render('registro', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "¡Ya existe una cuenta registrada con este correo electrónico!",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: 'iniciosesion'
            });
        } else {
            // Si no existe, proceder con el registro
            let passwordHash = await bcryptjs.hash(pass, 8);
            conexion.query('INSERT INTO usuarios SET ?', { usuario, contraseña: passwordHash, correo }, async (error, results) => {
                if (error) {
                    throw error;
                } else {
                    res.render('registro', {
                        alert: true,
                        alertTitle: "Registro",
                        alertMessage: "¡Registro Completado!",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: 'iniciosesion'
                    });
                }
            });
        }
    });
}



exports.iniciosesion = async (req, res) => {
    const bcryptjs = require('bcryptjs');
    const { user, pass } = req.body; // Desestructurar los datos del cuerpo de la solicitud
    const correo = req.body.correo; // Obtener el correo electrónico
    if (user && pass && correo) { // Verificar que se proporcionaron todos los datos necesarios
        conexion.query('SELECT id, usuario, contraseña FROM usuarios WHERE usuario = ? AND correo = ?', [user, correo], async (error, results) => {
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
                req.session.loggedin = true;
                req.session.usuario = user;
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
            alertMessage: "¡Por favor ingresa tu usuario, contraseña y correo electrónico!",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: 1500,
            ruta: 'iniciosesion'
        });
    }
}


// Iniciar fichaje
exports.iniciar_fichaje = (req, res) => {
    if (!req.session.horaInicioFichaje) { // Verificar si el fichaje ya está iniciado
        req.session.horaInicioFichaje = formatearFechaHora(new Date()); // Guardar la hora de inicio del fichaje en la sesión
    }
    res.redirect('/fichar'); // Redirigir a la página de fichaje
}

// Terminar fichaje
exports.terminar_fichaje = (req, res) => {
    if (req.session.horaInicioFichaje) { // Verificar si el fichaje está iniciado
        const usuario = req.session.usuario; // Obtener el nombre de usuario de la sesión actual
        const horaInicioFichaje = req.session.horaInicioFichaje; // Obtener la hora de inicio del fichaje de la sesión
        const horaFinFichaje = formatearFechaHora(new Date()); // Obtener la hora actual como hora de finalización del fichaje
        
        // Consulta SQL para insertar un nuevo registro de fichaje con la hora de inicio y fin
        conexion.query('INSERT INTO fichaje (usuario, hora_entrada, hora_salida) VALUES (?, ?, ?)', [usuario, horaInicioFichaje, horaFinFichaje], (error, results) => {
            if (error) {
                console.error("Error al insertar fichaje:", error); // Agregar registro de error
                res.status(500).send("Error interno del servidor"); // Enviar respuesta de error al cliente
            } else {
                delete req.session.horaInicioFichaje; // Eliminar la hora de inicio del fichaje de la sesión
                res.redirect('/fichar'); // Redirigir a la página de fichaje
            }
        });
    } else {
        res.redirect('/fichar'); // Redirigir a la página de fichaje si el fichaje no está iniciado
    }
}

function generarCodigo() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}

// Configuración nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port:587,
    secure:true,
    auth: {
      user: 'joclockapp@gmail.com',
      pass: 's l c n c p h j h z h g o k x w'
    }
  });

// Variable global para almacenar el código de recuperación
let codigoRecuperacion = '';
var correoRecogido = '';

// Controlador para enviar correo de recuperación
exports.enviarCorreo = async (req, res) => {
    const { correo } = req.body;
    correoRecogido = correo;

    // Consultar si el correo electrónico existe en la base de datos
    conexion.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (error, results) => {
        if (error) {
            console.log(error);
            // Manejar el error y renderizar la página de recordar con un mensaje de error
            res.render('recordar', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "¡Error al buscar el correo electrónico en la base de datos!",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: 'recordar'
            });
        } else if (results.length === 0) {
            // Si no se encuentra el correo electrónico en la base de datos
            res.render('recordar', {
                alert: true,
                alertTitle: "Correo electrónico no encontrado",
                alertMessage: "No hay ninguna cuenta vinculada a este correo electrónico.",
                alertIcon: "warning",
                showConfirmButton: true,
                timer: false,
                ruta: 'recordar'
            });
        } else {
            // Si se encuentra el correo electrónico, generar y almacenar el código de recuperación
            codigoRecuperacion = generarCodigo();

            const mailOptions = {
                from: 'joclockapp@gmail.com',
                to: correo,
                subject: 'Código de recuperación de contraseña',
                text: `Tu código de recuperación es: ${codigoRecuperacion}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    // Manejar el error y renderizar la página de recordar con un mensaje de error
                    res.render('recordar', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "¡Error al enviar el correo electrónico!",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'recordar'
                    });
                } else {
                    console.log('Email enviado: ' + info.response);
                    // Al enviar el correo con el código, redirigir a la página para comprobar el código
                    res.redirect(`/codigo`);
                }
            });
        }
    });
};

// Controlador para comprobar el código de recuperación
exports.comprobarCodigoRecuperacion = async (req, res) => {
    const { codigo } = req.body;

    // Consultar si el código ingresado coincide con el código almacenado
    if (codigo == codigoRecuperacion) {
        // Si los códigos coinciden, redirigir a la página de restablecimiento de contraseña
        res.redirect(`/cambiar-contra`);
    } else {
        // Si los códigos no coinciden, mostrar un mensaje de error
        res.render('codigo', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "El código de recuperación ingresado es incorrecto. Por favor, inténtalo de nuevo.",
            alertIcon: "error",
            showConfirmButton: true,
            timer: 1500,
            ruta: 'codigo'
        });
    }
};

// Controlador para cambiar la contraseña
exports.cambiarContraseña = async (req, res) => {
    const { pass, confirmarpass } = req.body;

    // Verificar que las contraseñas coincidan
    if (pass !== confirmarpass) {
        res.render('cambiar-contra', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Las contraseñas no coinciden. Por favor, inténtalo de nuevo.",
            alertIcon: "error",
            showConfirmButton: true,
            timer: 1500,
            ruta: 'cambiar-contra'
        });
        return;
    }

    // Encriptar la nueva contraseña
    let passwordHash = await bcryptjs.hash(pass, 8);

    // Actualizar la contraseña en la base de datos
    conexion.query('UPDATE usuarios SET contraseña = ? WHERE correo = ?', [passwordHash, correoRecogido], async (error, results) => {
        if (error) {
            console.error('Error al cambiar la contraseña:', error);
            res.render('cambiar-contraseña', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Ocurrió un error al cambiar la contraseña. Por favor, inténtalo de nuevo más tarde.",
                alertIcon: "error",
                showConfirmButton: true,
                timer: 1500,
                ruta: 'cambiar-contra'
            });
        } else {
            res.redirect('/iniciosesion');
        }
    });
};











