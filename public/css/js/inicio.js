function actualizarSaludo() {
    // Obtener la hora actual del sistema
    var horaActual = new Date().getHours();

    // Obtener el elemento con la clase "titulo-principal"
    var tituloPrincipal = document.querySelector(".titulo-principal");

    // Definir el saludo según la hora del día
    var saludo;
    if (horaActual >= 5 && horaActual < 13) {
        saludo = `¡Buenos días! <br> <span>¿Listo para trabajar?</span>`;
    } else if (horaActual >= 13 && horaActual < 21) {
        saludo = `¡Buenas tardes, <br> <span>ánimo con el trabajo!</span>`;
    } else {
        saludo = `¡Buenas noches, <br> <span>aprovecha para descansar!</span>`;
    }

    // Actualizar el contenido del elemento con el saludo
    tituloPrincipal.innerHTML = saludo;
}

// Ejecutar la función inicialmente para que el saludo se muestre de inmediato
actualizarSaludo();

// Actualizar el saludo cada segundo
setInterval(actualizarSaludo, 1000);