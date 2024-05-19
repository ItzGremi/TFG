const modo = document.getElementById('modo');
const modoIcono = document.getElementById('modo-icono');
const modoTexto = document.getElementById('modo-texto');

const sunImage = '/css/icons/sun.png';
const sunBlueImage = '/css/icons/sunBlue.png';
const moonImage = '/css/icons/moon.png';
const moonBlueImage = '/css/icons/moonBlue.png';

let isDarkMode = localStorage.getItem('darkMode') === 'true'; // Obtener el estado del modo del almacenamiento local
let isHovered = false; // Variable para rastrear el estado del hover

function updateMode() {
    document.body.classList.toggle('dark', isDarkMode); // Aplicar la clase 'dark' según el estado del modo

    // Cambiar el texto y la imagen del icono según el estado del modo
    if(isDarkMode){
        modoIcono.src = moonImage;
        modoTexto.textContent = 'Modo Oscuro';
    } else{
        modoIcono.src = sunImage;
        modoTexto.textContent = 'Modo Claro';
    }

    // Actualizar el color del icono según el estado del hover
    if (isHovered) {
        if (isDarkMode) {
            modoIcono.src = moonBlueImage;
        } else {
            modoIcono.src = sunBlueImage;
        }
    }
}

updateMode(); // Llamar a esta función al cargar la página para aplicar el modo inicial

modo.addEventListener('click', function(){
    isDarkMode = !isDarkMode; // Invertir el estado del modo al hacer clic
    localStorage.setItem('darkMode', isDarkMode); // Guardar el estado del modo en el almacenamiento local
    updateMode(); // Actualizar el modo después de hacer clic
});

modo.addEventListener('mouseenter', () => {
    isHovered = true; // Establecer el estado del hover en verdadero al pasar el ratón por encima

    // Cambiar la imagen del icono según el estado del modo si el mouse está dentro
    if (isDarkMode) {
        modoIcono.src = moonBlueImage;
    } else {
        modoIcono.src = sunBlueImage;
    }
});

modo.addEventListener('mouseleave', () => {
    isHovered = false; // Establecer el estado del hover en falso al quitar el ratón

    // Cambiar la imagen del icono según el estado del modo si el mouse está fuera
    if (isDarkMode) {
        modoIcono.src = moonImage;
    } else {
        modoIcono.src = sunImage;
    }
});

const botonMenu = document.getElementById("menu-boton");
const menuCabecera = document.querySelector(".opciones-navegacion");
let esMenuVisible = false;

botonMenu.addEventListener("click", () => {
    menuCabecera.classList.toggle("navegacion--visible");
    menuCabecera.classList.toggle("mostrar");
    
    // Toggle del estado del menú
    esMenuVisible = !esMenuVisible;

    // Ajuste de la altura de la cabecera
    const cabecera = document.getElementById('cabecera');
    const computedStyle = window.getComputedStyle(menuCabecera);
    const height = parseInt(computedStyle.height);

    if (esMenuVisible) {
        cabecera.style.marginBottom = height + 'px';
    } else {
        cabecera.style.marginBottom = '0px';
    }
});

















