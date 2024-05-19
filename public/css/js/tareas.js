document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.toggle-tarea');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Previene el comportamiento predeterminado del botón
            const tareaTexto = this.closest('.tarea').querySelector('.texto-tarea');
            tareaTexto.classList.toggle('is-hidden');
            const iconoFlecha = this.querySelector('i');
            iconoFlecha.classList.toggle('bi-caret-up-fill');
            iconoFlecha.classList.toggle('bi-caret-down-fill');
        });
    });
});