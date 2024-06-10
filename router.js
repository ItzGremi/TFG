/* Importación de utilidades necesarias */
const express = require('express');
const router = express.Router();
const conexion = require('./database/db');
const multer = require('multer');

// Configuración de multer
const upload = multer({ dest: 'uploads/' });

/* Página de inicio */
router.get('/', (req, res)=>{
    if(req.session.loggedin){
        res.render('inicio', {
            login:true,
            usuario: req.session.usuario
        });
    } else{
        res.render('inicio', {
            login:false,
            usuario: 'Debe iniciar sesión'
        });
    }
});

/* Cerrar sesión */
router.get('/cerrarsesion', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
})

/* Fichar */
router.get('/fichar', (req, res) => {
    const usuario = req.session.usuario;
    if (req.session.loggedin) {
        conexion.query('SELECT hora_entrada, hora_salida FROM fichaje WHERE usuario = ? ORDER BY hora_entrada DESC LIMIT 10', [usuario], (error, results) => {
            if (error) {
                throw error;
            } else {
                res.render('fichar', {
                    login: req.session.loggedin,
                    usuario: req.session.usuario,
                    fichajes: results
                });
            }
        });
    } else {
        res.redirect('/iniciosesion');
    }
});

/* Tareas */
router.get('/tareas', (req, res) => {
    const usuario = req.session.usuario;
    if (req.session.loggedin) {
        conexion.query('SELECT * FROM tareas WHERE usuario = ?', [usuario], (error, results)=>{
            if (error) {
                throw error;
            } else {
                res.render('tareas', {
                    resultados: results,
                    login: req.session.loggedin,
                    usuario: req.session.usuario
                });
            }
        });
    } else {
        res.redirect('/iniciosesion');
    }
});

/* Crear Tarea */
router.get('/tareas_crear', (req, res)=>{
    if(req.session.loggedin){
        res.render('tareas_crear', {
            usuario: req.session.usuario,
            login: req.session.loggedin
        });
    } else {
        res.redirect('/iniciosesion');
    }
})

/* Editar Tarea */
router.get('/tarea_editar/:id', (req, res)=>{
    const id = req.params.id;
    conexion.query('SELECT * FROM tareas WHERE id=?', [id], (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('tareas_editar', {
                tarea:results[0],
                login: req.session.loggedin,
                usuario: req.session.usuario
            });
        }
    })
})

/* Eliminar Tarea */
router.get('/tarea_eliminar/:id', (req, res)=>{
    const id = req.params.id;
    conexion.query('DELETE FROM tareas WHERE id=?', [id], (error, results)=>{
        if(error){
            throw error;
        } else {
            res.redirect('/tareas');
        }
    });  
})

/* Noticias */
router.get('/noticias', (req, res)=>{
    conexion.query('SELECT * FROM noticias ORDER BY id DESC', (error, results)=>{
        if(error){
            throw error;
        } else{
            res.render('noticias', {
                resultados: results,
                login: req.session.loggedin,
                usuario: req.session.usuario
            });
        }
    })
})

/* Crear Noticia */
router.get('/noticias_crear', (req, res)=>{
    if(req.session.loggedin){
        res.render('noticias_crear', {
            usuario: req.session.usuario,
            login: req.session.loggedin
        });
    } else {
        res.redirect('/iniciosesion');
    }
})

/* Editar Noticia */
router.get('/noticia_editar/:id', (req, res)=>{
    const id = req.params.id;
    conexion.query('SELECT * FROM noticias WHERE id=?', [id], (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('noticias_editar', {
                noticia:results[0],
                login: req.session.loggedin,
                usuario: req.session.usuario
            });
        }
    })
})

/* Eliminar Noticia */
router.get('/noticia_eliminar/:id', (req, res)=>{
    const id = req.params.id;
    const usuario = req.session.usuario; // Obtener el nombre de usuario de la sesión actual

    // Verificar si el usuario actual es el creador original de la noticia
    conexion.query('SELECT usuario FROM noticias WHERE id=?', [id], (error, results) => {
        if (error) {
            throw error;
        } else {
            const creadorOriginal = results[0].usuario;
            if (creadorOriginal === usuario) { // Permitir la eliminación solo si el usuario actual es el creador original
                conexion.query('DELETE FROM noticias WHERE id=?', [id], (error, results)=>{
                    if(error){
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
})

/* Iniciar Sesión */
router.get('/iniciosesion', (req, res)=>{
    res.render('iniciosesion');
})

/* Registro */
router.get('/registro', (req, res)=>{
    res.render('registro');
})

/* Recordar Contraseña */
router.get('/recordar', (req, res)=>{
    res.render('recordar');
})

/* Código */
router.get('/codigo', (req, res)=>{
    res.render('codigo');
})

/* Cambiar Contraseña */
router.get('/cambiar-contra', (req, res)=>{
    res.render('cambiar-contra');
})

/* Operaciones POST con el CRUD */
const crud = require('./controllers/crud');
router.post('/guardar_noticia', upload.single('imagen'), crud.guardar_noticia);
router.post('/editar_noticia', upload.single('imagen'), crud.editar_noticia);
router.post('/register', crud.registro);
router.post('/auth', crud.iniciosesion);
router.post('/iniciar_fichaje', crud.iniciar_fichaje);
router.post('/terminar_fichaje', crud.terminar_fichaje);
router.post('/guardar_tarea', crud.guardar_tarea);
router.post('/editar_tarea', crud.editar_tarea);
router.post('/enviar-correo', crud.enviarCorreo);
router.post('/comprobar-codigo', crud.comprobarCodigoRecuperacion);
router.post('/cambiar-contra', crud.cambiarContraseña);

/* Exportación del Router */
module.exports = router;