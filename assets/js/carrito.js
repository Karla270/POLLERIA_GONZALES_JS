// Variables
let baseDeDatos = [];
let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
let total = 0;
const divisa = 'S/';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotalCarrito = document.getElementById('totalCarrito');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const DOMbotonConfirmar = document.getElementById("boton-confirmar");
const DOMaside = document.querySelector('aside');

//Clase
class Producto {
    constructor(item) {
        this.id = item.id;
        this.nombre = item.nombre;
        this.imagen = item.imagen;
        this.cantidad = item.cantidad;
        this.precioUnitario = parseFloat(item.precio);
        this.precio = parseFloat(this.precioUnitario * this.cantidad);
    }
    agregar(item) {
        carrito.push(item);
    }
}

// Funciones
const renderizarProductos = async () => {
    try {
        const respuesta = await fetch('data.json');
        baseDeDatos = await respuesta.json();
        baseDeDatos.forEach((info) => {
            // Estructura
            const miNodoPadre = document.createElement('div');
            miNodoPadre.classList.add('col-sm-3', 'col-xs-12');
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'text-center', 'height-promocion');
            // Titulo
            const miNodoTitle = document.createElement('h2');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('productos-img', 'img-rounded');
            miNodoImagen.setAttribute('src', 'assets/img/' + info.imagen);
            // Descripcion
            const miNodoDescripcion = document.createElement('div');
            miNodoDescripcion.classList.add('m-3');
            miNodoDescripcion.innerHTML = `${info.descripcion}`;
            // Precio
            const miNodoPrecio = document.createElement('h3');
            miNodoPrecio.classList.add('card-text', 'font-weight-bold');
            miNodoPrecio.textContent = `${divisa}${info.precio.toFixed(2)}`;
            // Boton 
            const miNodoBoton = document.createElement('i');
            miNodoBoton.classList.add('fa', 'fa-cart-plus', 'icon-card');
            miNodoBoton.addEventListener('click', function () { agregarProductoAlCarrito(`${info.id}`) });

            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoDescripcion);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            miNodoPadre.appendChild(miNodo);
            DOMitems.appendChild(miNodoPadre);
        });
    } catch {
        mostrarAlerta('Error al cargar lista de productos!', 'red');
    } finally {
        renderizarCarrito();
    }
}

function agregarProductoAlCarrito(id) {
    var producto = carrito.find((item) => item.id === id);
    if (producto != undefined) {
        const { cantidad, precioUnitario } = producto;
        if (cantidad + 1 > 10) {
            mostrarAlerta('La cantidad máxima es 10!', 'orange');
            return;
        }
        producto.cantidad = cantidad + 1;
        producto.precio = parseFloat(precioUnitario * (cantidad + 1));
    }
    else {
        var item = baseDeDatos.find((itemBaseDatos) => itemBaseDatos.id === id);
        item.cantidad = 1;
        item = new Producto(item);
        item.agregar(item);
        producto = item;
    }
    mostrarAlerta(`${producto.nombre} agregado con éxito!`, '#0062cc');
    renderizarCarrito();
}

function renderizarCarrito() {
    DOMcarrito.textContent = '';
    carrito.forEach((item) => {
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-center');
        miNodo.innerHTML = `<img class='carrito-img mr-3' src=${'assets/img/' + item.imagen}>`
            + `<input class='text-center' type='number' id='cantidad' min='0' max='10' value='${item.cantidad}' onchange="actualizarCantidad('${item.id}',this.value)"> `
            + `<span style='font-size:14px'>x ${item.nombre} - ${divisa}${item.precioUnitario} = ${divisa}${item.precio}</span>`;
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.addEventListener('click', function () { borrarItemCarrito(`${item.id}`) });
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    sessionStorage.setItem('total', `${divisa}` + calcularTotal());
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
    if (carrito.length == 0) {
        //Ocultar botones
        document.getElementById('lblCartCount').style.display = 'none';
        mostraBotones('boton-vaciar', 'none');
        mostraBotones('boton-confirmar', 'none');
    }
    else {
        //Mostrar botones
        document.getElementById('lblCartCount').style.display = 'inherit';
        mostraBotones('boton-vaciar', 'block');
        mostraBotones('boton-confirmar', 'block');
    }
    if (JSON.parse(sessionStorage.getItem('verCarrito'))) {
        //Mostrar carrito
        DOMaside.style.display = 'none';
        verCarrito();
        sessionStorage.removeItem('verCarrito');

    }
    DOMtotal.innerText = sessionStorage.getItem('total');
    DOMtotalCarrito.innerText = sessionStorage.getItem('total');
}

function borrarItemCarrito(id) {
    Swal.fire({
        title: 'Está seguro de eliminar el producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, seguro',
        cancelButtonText: 'No, no quiero'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = carrito.filter((item) => {
                return item.id !== id;
            });
            Swal.fire({
                title: 'Borrado!',
                icon: 'success',
                text: 'El producto ha sido borrado'
            })
            renderizarCarrito();
        }
    })
}

function calcularTotal() {
    return carrito.reduce((total, item) => {
        return total + item.precio;
    }, 0).toFixed(2);
}

function vaciarCarrito() {
    carrito = [];
    renderizarCarrito();
}

function mostraBotones(id, text) {
    document.getElementById(id).style.display = text;
}

function actualizarCantidad(id, value) {
    if (value >= 1 && value <= 10) {
        const producto = carrito.find((item) => item.id === id);
        const { precioUnitario } = producto;
        producto.cantidad = value;
        producto.precio = parseFloat(precioUnitario * value);
    }
    else if (value > 10) {
        mostrarAlerta('La cantidad máxima es 10!', 'orange');
    }
    else {
        carrito = carrito.filter((item) => {
            return item.id !== id;
        });
    }
    renderizarCarrito();
}

function verCarrito() {
    if (DOMaside.style.display == 'none') {
        document.getElementById('carousel').style.display = 'none';
        let productoDOM = document.querySelectorAll('#items div.col-sm-3');
        DOMaside.style.display = 'block';
        DOMitems.classList.remove('col-lg-12', 'col-md-12');
        DOMitems.classList.add('col-lg-8', 'col-md-10');
        productoDOM.forEach(element => {
            element.classList.add('col-sm-6');
            element.classList.remove('col-sm-3');
        });

    }
    else {
        document.getElementById('carousel').style.display = 'block';
        let productoDOM = document.querySelectorAll('#items div.col-sm-6');
        DOMaside.style.display = 'none';
        DOMitems.classList.remove('col-lg-8', 'col-md-10');
        DOMitems.classList.add('col-lg-12', 'col-md-12');
        productoDOM.forEach(element => {
            element.classList.add('col-sm-3');
            element.classList.remove('col-sm-6');
        });
    }
}


function mostrarPedido() {
    const DateTime = luxon.DateTime;
    Swal.fire({
        title: 'Pedido confirmado!',
        html: 'Fecha: ' + DateTime.now().toLocaleString(DateTime.DATETIME_SHORT) +
            '<br><br><b>Total: ' + sessionStorage.getItem('total') + '</b>',
        icon: 'success'
    })
    vaciarCarrito();
    verCarrito();
}
// Eventos
DOMbotonVaciar.addEventListener('click', vaciarCarrito);
DOMbotonConfirmar.onclick = () => { mostrarPedido(); };
DOMaside.style.display = 'none';


// Inicio
renderizarProductos();

