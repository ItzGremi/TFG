const conexion = require('../database/db');

exports.guardar_noticia = (req, res) => {
    const noticia = req.body.noticia;

    //FECHA Y HORA ACTUAL

    const fechaHoraActual = new Date();

    // Obtiene la hora, minutos y segundos exactos
    const horaExacta = fechaHoraActual.getHours().toString().padStart(2, '0');
    const minutosExactos = fechaHoraActual.getMinutes().toString().padStart(2, '0');
    const segundosExactos = fechaHoraActual.getSeconds().toString().padStart(2, '0');

    // Obtiene el día, mes y año exactos
    const diaExacto = fechaHoraActual.getDate();
    const mesExacto = (fechaHoraActual.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0 (enero) hasta 11 (diciembre)
    const añoExacto = fechaHoraActual.getFullYear();

    // Formatea la hora y la fecha
    const horaFormateada = `${horaExacta}:${minutosExactos}:${segundosExactos}`;
    const fechaFormateada = `${diaExacto}/${mesExacto}/${añoExacto}`;

    // Muestra la hora y la fecha en el párrafo
    const fecha_publicacion = `${fechaFormateada} - ${horaFormateada}`;

    conexion.query('INSERT INTO noticias SET ?', { noticia: noticia, fecha_publicacion: fecha_publicacion }, (error, results) => {
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
    //FECHA Y HORA ACTUAL

    const fechaHoraActual = new Date();

    // Obtiene la hora, minutos y segundos exactos
    const horaExacta = fechaHoraActual.getHours().toString().padStart(2, '0');
    const minutosExactos = fechaHoraActual.getMinutes().toString().padStart(2, '0');
    const segundosExactos = fechaHoraActual.getSeconds().toString().padStart(2, '0');
    
    // Obtiene el día, mes y año exactos
    const diaExacto = fechaHoraActual.getDate();
    const mesExacto = (fechaHoraActual.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0 (enero) hasta 11 (diciembre)
    const añoExacto = fechaHoraActual.getFullYear();
    
    // Formatea la hora y la fecha
    const horaFormateada = `${horaExacta}:${minutosExactos}:${segundosExactos}`;
    const fechaFormateada = `${diaExacto}/${mesExacto}/${añoExacto}`;
    
    // Muestra la hora y la fecha en el párrafo
    const fecha_publicacion = `${fechaFormateada} - ${horaFormateada}`;
    conexion.query('UPDATE noticias SET ? WHERE id=?', [{noticia:noticia, fecha_publicacion:`Editado a las ${fecha_publicacion}`}, id], (error, results)=>{
        if(error){
            throw error;
        } else{
            res.redirect('/noticias');
        }
    });
}
