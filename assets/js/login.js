
document.getElementById('formLogin')
    .addEventListener('submit', function (event) {
        event.preventDefault();
        mostrarAlerta(`Bienvenid@ ${document.getElementById("user").value}`, '#0062cc');
        sessionStorage.setItem('user', document.getElementById("user").value);
        document.getElementById('formLogin').reset();
        mostrarUsuario();
        validarUsuario();
    });



document.getElementById('formPerfil')
    .addEventListener('submit', function (event) {
        event.preventDefault();
        sessionStorage.removeItem('user');
        mostrarUsuario();
        validarUsuario();
    });

function mostrarUsuario() {
    if (sessionStorage.getItem('user')) {
        document.querySelector('#formPerfil h4').innerText = `Hola, ${sessionStorage.getItem('user')}`;
        document.getElementById('formPerfil').style.display = 'block';
        document.getElementById('formLogin').style.display = 'none';
    }
    else {
        document.getElementById('formLogin').style.display = 'block';
        document.getElementById('formPerfil').style.display = 'none';
    }

}

mostrarUsuario();



