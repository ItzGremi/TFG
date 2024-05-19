document.addEventListener('DOMContentLoaded', () => {
    const btnIniciar = document.getElementById('btn-fichar-i');
    const btnTerminar = document.getElementById('btn-fichar-t');

    // Almacenar el estado inicial en localStorage
    if (!localStorage.getItem('fichaje')) {
        localStorage.setItem('fichaje', 'iniciar');
    }

    // Obtener el estado del fichaje del localStorage
    const estadoFichaje = localStorage.getItem('fichaje');

    // Mostrar u ocultar los botones según el estado almacenado
    if (estadoFichaje === 'iniciar') {
        btnIniciar.style.display = 'block';
        btnTerminar.style.display = 'none';
    } else {
        btnIniciar.style.display = 'none';
        btnTerminar.style.display = 'block';
    }

    // Agregar el evento click al botón de iniciar
    btnIniciar.addEventListener('click', () => {
        // Ocultar el botón de iniciar y mostrar el de terminar
        btnIniciar.style.display = 'none';
        btnTerminar.style.display = 'block';

        // Almacenar el estado en localStorage
        localStorage.setItem('fichaje', 'terminar');
    });

    // Agregar el evento click al botón de terminar
    btnTerminar.addEventListener('click', () => {
        // Ocultar el botón de terminar y mostrar el de iniciar
        btnIniciar.style.display = 'block';
        btnTerminar.style.display = 'none';

        // Almacenar el estado en localStorage
        localStorage.setItem('fichaje', 'iniciar');
    });
});