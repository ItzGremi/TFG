// Obtener todas las flechas de toggle de las noticias
const toggleNoticias = document.querySelectorAll('.toggle-noticia');

// Agregar evento de clic a cada flecha
toggleNoticias.forEach(toggle => {
    toggle.addEventListener('click', function(event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado del enlace

        const noticia = this.closest('.noticia'); // Obtener el contenedor de la noticia
        const imagenNoticia = noticia.querySelector('.imagen-noticia'); // Obtener la imagen de la noticia
        const textoNoticia = noticia.querySelector('.texto-noticia'); // Obtener el texto de la noticia

        // Verificar si hay una imagen en la noticia antes de ocultar el texto
        if (imagenNoticia && textoNoticia) {
            // Alternar la visibilidad de la imagen y el texto
            imagenNoticia.classList.toggle('d-none');
            textoNoticia.classList.toggle('d-none');

            // Cambiar la dirección de la flecha
            const iconoFlecha = this.querySelector('i');
            iconoFlecha.classList.toggle('bi-caret-up-fill');
            iconoFlecha.classList.toggle('bi-caret-down-fill');
        } else if(textoNoticia){
            textoNoticia.classList.toggle('d-none');

            const iconoFlecha = this.querySelector('i');
            iconoFlecha.classList.toggle('bi-caret-up-fill');
            iconoFlecha.classList.toggle('bi-caret-down-fill');
        }
    });
});