function bannerPersonalData (data){
    document.getElementById('bannerPersonalData').innerHTML = 
       (`
       <h1 class ="text-4xl tracking-wide font-sans" >User Profile</h1>
       <h1 class="text-2xl tracking-wide font-sans">Nombre: ${data.email}!</h1>
       <p  class="text-2xl tracking-wide font-sans">Rol: ${data.role}</p>
       <p class = "text-2xl tracking-wide font-sans">Mi Carrito = ${data.cart} </p>
       <a class="my-2 w-fit font-bold py-2 px-4 rounded text-white bg-red-600" href="/auth/logout">Logout</a>

      `) 
  }

  function render(data) {
    const cartListElement = document.getElementById('cartList');
    
    if (data.length === 0) {
        // Si no hay productos en el carrito, mostrar un mensaje y un botón para ir a la página de productos
        cartListElement.innerHTML = `
            <div class="text-center">
                <p class="text-xl font-bold">No hay productos en tu carrito</p>
                <button onclick="window.location.href = 'http://localhost:8080/products'" class="my-4 py-2 px-4 rounded bg-blue-500 text-white font-bold">Explora productos</button>
            </div>`;
    } else {
            // Si hay productos en el carrito, generar el HTML para mostrar los productos
            let html = '';
            data.forEach(elem => {
                html += `
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
                        <button onclick="addQuantity('${elem.quantity}')" class="text-black font-bold py-2 px-4 rounded">
                            Sumar Quantity
                        </button>
                    </div>`;
            });
          
            // Agregar el botón "Comprar" arriba de la lista de productos
            html = `
                <div class="">
                <button onclick="realizarCompra()" class=" my-4 py-2 px-4 rounded bg-green-500 text-white font-bold">Comprar</button>
                <button onclick="window.location.href = 'http://localhost:8080/products'" class="my-4 py-2 px-4 rounded bg-blue-500 text-white font-bold">Explora productos</button>
                </div>
                ${html}`;
      
        cartListElement.innerHTML = html;
    }
}

  
// Obtener información del usuario actual
fetch('http://localhost:8080/api/session/current')
    .then((response) => {
        response.json().then(data => {
            bannerPersonalData(data);
            const cartId = data.cart; // Se asume que la propiedad cart contiene la ID del carrito
            // Obtener productos del carrito usando la ID del carrito
            fetch(`http://localhost:8080/api/carts/${cartId}`)
                .then((response) => {
                    response.json().then(data => {
                        render(data.products);
                    });
                })
                .catch(error => {
                    console.error('Error al obtener productos del carrito:', error);
                });
        });
    })
    .catch(error => {
        console.error('Error al obtener información del usuario actual:', error);
    });


