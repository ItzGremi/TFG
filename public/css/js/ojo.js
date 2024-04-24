const ojo = document.getElementById('ojo');
const ojoDos = document.getElementById('ojoDos');
const inputContraseña = document.getElementById('password');
const inputContraseñaDos = document.getElementById('passwordDos');

ojo.addEventListener('click', ()=>{
    if(inputContraseña.type === 'password'){
        inputContraseña.type = 'text';
        ojo.className = 'bi bi-eye';
    } else{
        inputContraseña.type = 'password';
        ojo.className = 'bi bi-eye-slash';
    }
});

ojoDos.addEventListener('click', ()=>{
    if(inputContraseñaDos.type === 'password'){
        inputContraseñaDos.type = 'text';
        ojoDos.className = 'bi bi-eye';
    } else{
        inputContraseñaDos.type = 'password';
        ojoDos.className = 'bi bi-eye-slash';
    }
});