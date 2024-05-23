// Obtener el cartId del atributo de datos
const cartList = document.getElementById('cartList');
//const cartId = cartList.dataset.cartId;

let apiUrl = '';
let cartId = '';

// ** FETCH **
// Obtener la configuración del servidor y luego ejecutar las funciones necesarias
fetch('/api/config')
    .then(response => response.json())
    .then(config => {
        apiUrl = `http://localhost:${config.apiUrl}`;
        console.log(apiUrl)
        fetchCurrentUserAndCart();
    })
    .catch(error => {
        console.error('Error al obtener la configuración del servidor:', error);
    });

function fetchCurrentUserAndCart() {
    fetch(`${apiUrl}/api/session/current`)
        .then(response => response.json())
        .then(data => {
            cartId = data.cart; // Asignar el cartId del usuario actual
            fetchCartProducts();
        })
        .catch(error => {
            console.error('Error al obtener información del usuario actual:', error);
        });
}

function fetchCartProducts() {
    fetch(`${apiUrl}/api/carts/${cartId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.products);
            render(data.products);
        })
        .catch(error => {
            console.error('Error al obtener productos del carrito:', error);
        });
}

function render(data) {
    const html = data.map(elem => {
        return (`
            <div class="max-w-xs rounded overflow-hidden shadow-lg bg-white m-4">
            <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">${elem.product.title}</div>
                <p class="text-gray-700 text-base">
                    <strong>Precio:</strong> $${elem.product.price}<br>
                    <strong>Categoría:</strong> ${elem.product.category}<br>
                    <strong>Description:</strong> ${elem.product.description}<br>
                    <strong>Quantity:</strong> ${elem.quantity}<br>
                    <strong>ID:</strong> ${elem.product._id}<br>
                </p>
            </div>
            <button onclick="addQuantity('${elem.quantity}')" class=" text-black font-bold py-2 px-4 rounded">
            Sumar Quantity
            </button>
        </div>
        `);
    }).join(' ');

    document.getElementById('cartList').innerHTML = html;
}

// Esta función manejará el evento de hacer clic en el botón "Agregar a carrito"
function addQuantity(numero) {
    // Puedes realizar aquí la lógica para agregar el producto al carrito
    console.log(`Producto agregado al carrito`);
}