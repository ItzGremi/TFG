const express = require('express');
const router = express.Router();
const conexion = require('./database/db');

router.get('/', (req, res)=>{
    res.render('inicio');
});

router.get('/fichar', (req, res)=>{
    res.render('fichar');
});

router.get('/noticias', (req, res)=>{
    conexion.query('SELECT * FROM noticias', (error, results)=>{
        if(error){
            throw error;
        } else{
            res.render('noticias', {resultados:results});
        }
    })
})

router.get('/noticias_crear', (req, res)=>{
    res.render('noticias_crear');
})

router.get('/noticia_editar/:id', (req, res)=>{
    const id = req.params.id;
    conexion.query('SELECT * FROM noticias WHERE id=?', [id], (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('noticias_editar', {noticia:results[0]});
        }
    })
})

router.get('/noticia_eliminar/:id', (req, res)=>{
    const id = req.params.id;
    conexion.query('DELETE from noticias WHERE id=?', [id], (error, results)=>{
        if(error){
            throw error;
        } else {
            res.redirect('/noticias');
        }
    })
})


const crud = require('./controllers/crud');
router.post('/guardar_noticia', crud.guardar_noticia);
router.post('/editar_noticia', crud.editar_noticia);

module.exports = router;
