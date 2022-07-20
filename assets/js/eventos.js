const DOMtotal = document.getElementById('total');
const DMnameUser = document.getElementById('nameUser');

function mostrarAlerta(mensaje, color) {
    Toastify({
        text: (mensaje).toUpperCase(),
        style: {
            background: color,
        },
        duration: 1500
    }).showToast();
}

function validarUsuario() {
    DMnameUser.innerText = sessionStorage.getItem('user') || 'Bienvenid@';
    DOMtotal.innerText = sessionStorage.getItem('total') || 'S/0.00';

    const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    carrito.length == 0 ? document.getElementById('lblCartCount').style.display = 'none' : document.getElementById('lblCartCount').style.display = 'inherit';
}

function mostrarCarrito() {
    sessionStorage.setItem('verCarrito', true);
}

validarUsuario();
