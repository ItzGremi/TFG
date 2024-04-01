const express = require('express');
const router = express.Router();
const conexion = require('./database/db');

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


router.get('/cerrarsesion', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
})

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

router.get('/noticias', (req, res)=>{
    conexion.query('SELECT * FROM noticias ORDER BY fecha_publicacion DESC', (error, results)=>{
        if(error){
            throw error;
        } else{
            res.render('noticias', {
                resultados: results,
                login: req.session.loggedin, // Pasar la variable login basada en si el usuario está autenticado o no
                usuario: req.session.usuario // Pasar el nombre de usuario desde la sesión
            });
        }
    })
})



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



router.get('/iniciosesion', (req, res)=>{
    res.render('iniciosesion');
})

router.get('/registro', (req, res)=>{
    res.render('registro');
})

const crud = require('./controllers/crud');
router.post('/guardar_noticia', crud.guardar_noticia);
router.post('/editar_noticia', crud.editar_noticia);
router.post('/register', crud.registro);
router.post('/auth', crud.iniciosesion);
router.post('/iniciar_fichaje', crud.iniciar_fichaje);
router.post('/terminar_fichaje', crud.terminar_fichaje);
router.post('/guardar_tarea', crud.guardar_tarea);
router.post('/editar_tarea', crud.editar_tarea);


module.exports = router;
