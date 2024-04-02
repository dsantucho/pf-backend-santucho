// Obtener el cartId del atributo de datos
const cartList = document.getElementById('cartList');
const cartId = cartList.dataset.cartId;

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
        `)
  }).join(' ')

  document.getElementById('cartList').innerHTML = html;
};
// Esta función manejará el evento de hacer clic en el botón "Agregar a carrito"
function addQuantity(numero) {
    // Puedes realizar aquí la lógica para agregar el producto al carrito
    console.log(`Producto agregado al carrito`);
  }

//por HTTP request
fetch(`http://localhost:8080/api/carts/${cartId}`).then((response) => {
  response.json().then(data => {
    console.log(data.products)
    render(data.products);
  });
  console.log('Se envio la data desde fetch');
});



