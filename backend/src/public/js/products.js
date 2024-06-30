document.addEventListener('DOMContentLoaded', function () {
  let paginationLinks = [];  // Array para almacenar los objetos de paginación
  let apiUrl = '';

  // Obtener la configuración del servidor y luego ejecutar las funciones necesarias
  fetch('/api/config')
    .then(response => response.json())
    .then(config => {
      if (window.location.hostname === 'localhost') {
        apiUrl = `http://localhost:${config.apiUrl}`;
      } else {
        apiUrl = `https://${window.location.hostname}`; // Use the current hostname for production
      }
      // Llama a fetchProducts al cargar la página
      fetchProducts();
    })
    .catch(error => {
      console.error('Error al obtener la configuración del servidor:', error);
    });

  function pagesInfo(data) {
    document.getElementById('pages').innerHTML = (`
    <div>
      <h3>Total Pages = ${data.totalPages}</h3>
      <h4>Current Page = ${data.page}</h4>
    </div>
  `);
  }

  /*  function render(data, currentUser, cartProducts) {
     const html = data.map(elem => {
       let owner = 'undefined';
       let ownerInfo = 'undefined';
       let cardStyle = '';
       const thumbnail = elem.thumbnails || '/assets/default-thumbnail.jpg'; // Ruta de la imagen por defecto
 
       if (elem.owner) {
         if (elem.owner === 'admin') {
           owner = 'admin';
           ownerInfo = 'admin';
         } else {
           owner = elem.owner;
           ownerInfo = elem.owner;
         }
       }
 
       if (currentUser && currentUser.role === 'premium' && currentUser._id === owner) {
         cardStyle = 'background-color: rgba(255, 0, 0, 0.25) !important;';
       }
 
       const isInCart = cartProducts.some(product => product.product._id === elem._id);
 
       return (`
       <div class="max-w-xs rounded overflow-hidden shadow-lg bg-white m-4" style="${cardStyle}" id="card_${elem._id}">
         <div class="px-6 py-4">
           <img src="${thumbnail}" alt="${elem.title}" class="w-full h-48 object-cover">
           <div class="font-bold text-xl mb-2">${elem.title}</div>
           <p class="text-gray-700 text-base">
             <strong>Precio:</strong> $${elem.price}<br>
             <strong>Categoría:</strong> ${elem.category}<br>
             <strong>Stock:</strong> ${elem.stock}<br>
             <strong>ID:</strong> ${elem._id}<br>
             ${(currentUser.role === 'admin' || currentUser.role === 'premium')? 
             `<strong>Propietario:</strong> ${elem.owner.email}<br>
             <strong>Rol:</strong> ${elem.owner.role}<br>`: ''}
           </p>
           ${isInCart ? `
           <div class="bg-green-500 text-white font-bold text-center px-4 py-2 mt-2 flex w-full h-auto rounded-md">
             <button onclick="window.location.href = '/cart-view'">Producto en Carrito </button>
             
           </div>` : `
           <div class="flex items-center space-x-2" id="addToCartSection_${elem._id}">
             <input type="number" id="quantity_${elem._id}" min="1" max="${elem.stock}" value="1" class="mt-2 px-2 py-1 border rounded w-16">
             <button onclick="validateAndAddToCart('${elem._id}', ${elem.stock})" class="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2">
               Agregar al carrito
             </button>
           </div>
           <p id="error_${elem._id}" class="text-red-500 text-sm mt-2" style="display: none;">La cantidad deseada excede el stock disponible</p>
           `}
         </div>
       </div>
     `);
     }).join(' ');
 
     document.getElementById('productList').innerHTML = html;
   } */

  function render(data, currentUser, cartProducts) {
    const html = data.map(elem => {
      let owner = 'undefined';
      let ownerEmail = 'undefined';
      let ownerRole = 'undefined';
      let cardStyle = '';
      const thumbnail = elem.thumbnails || '/assets/default-thumbnail.jpg'; // Ruta de la imagen por defecto

      if (elem.owner) {
        owner = elem.owner._id;
        ownerEmail = elem.owner.email || 'undefined';
        ownerRole = elem.owner.role || 'undefined';
      }

      if (currentUser && currentUser.role === 'premium' && currentUser._id === owner) {
        cardStyle = 'background-color: rgba(255, 0, 0, 0.25) !important;';
      }

      const isInCart = cartProducts.some(product => product.product._id === elem._id);

      return (`
          <div class="max-w-xs rounded overflow-hidden shadow-lg bg-white m-4" style="${cardStyle}" id="card_${elem._id}">
            <div class="px-6 py-4">
              <img src="${thumbnail}" alt="${elem.title}" class="w-full h-48 object-cover">
              <div class="font-bold text-xl mb-2">${elem.title}</div>
              <p class="text-gray-700 text-base">
                <strong>Precio:</strong> $${elem.price}<br>
                <strong>Categoría:</strong> ${elem.category}<br>
                <strong>Stock:</strong> ${elem.stock}<br>
                <strong>ID:</strong> ${elem._id}<br>
                ${(currentUser.role === 'admin' || currentUser.role === 'premium') ?
                `<strong>Propietario:</strong> ${ownerEmail}<br>
                <strong>Rol:</strong> ${ownerRole}<br>` : ''}
              </p>
              ${isInCart ? `
              <div class="bg-green-500 text-white font-bold text-center px-4 py-2 mt-2 flex w-full h-auto rounded-md">
                <button onclick="window.location.href = '/cart-view'">Producto en Carrito </button>
                
              </div>` : `
              <div class="flex items-center space-x-2" id="addToCartSection_${elem._id}">
                <input type="number" id="quantity_${elem._id}" min="1" max="${elem.stock}" value="1" class="mt-2 px-2 py-1 border rounded w-16">
                <button onclick="validateAndAddToCart('${elem._id}', ${elem.stock})" class="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2">
                  Agregar al carrito
                </button>
              </div>
              <p id="error_${elem._id}" class="text-red-500 text-sm mt-2" style="display: none;">La cantidad deseada excede el stock disponible</p>
              `}
            </div>
          </div>
        `);
    }).join(' ');
    document.getElementById('productList').innerHTML = html;
  }

  async function fetchProducts(page = 1) {
    try {
      const response = await fetch(`${apiUrl}/api/products/?limit=8&page=${page}`);
      const userResponse = await fetch(`${apiUrl}/api/session/current`);
      const currentUser = await userResponse.json();
      const cartResponse = await fetch(`${apiUrl}/api/carts/${currentUser.cart}`);
      const cartData = await cartResponse.json();
      const cartProducts = cartData.products;

      if (response.ok) {
        const data = await response.json();
        render(data.payload, currentUser, cartProducts);
        updatePagination(data);
        pagesInfo(data);
        console.log(data);
      } else {
        console.error('Error al obtener la lista actualizada de productos');
      }
    } catch (error) {
      console.error('Error al obtener la lista actualizada de productos:', error);
    }
  }

  window.handlePageClick = function (link) {
    if (link && link !== null) {
      fetch(link).then(response => response.json()).then(data => {
        updatePagination(data);
        fetchProducts(new URL(link).searchParams.get('page'));
      });
    }
  }

  function updatePagination(data) {
    paginationLinks = [];

    if (data.prevPage) {
      paginationLinks.push({ type: 'prevLink', link: `${apiUrl}/api/products/?limit=8&page=${data.prevPage}` });
    }

    if (data.nextPage) {
      paginationLinks.push({ type: 'nextLink', link: `${apiUrl}/api/products/?limit=8&page=${data.nextPage}` });
    }

    console.log(paginationLinks);
    paginationData(paginationLinks);
  }

  function paginationData(paginationLinks) {
    const html = paginationLinks.map(linkObj => {
      if (linkObj.type === 'prevLink') {
        return (`
        <div>
          <button onclick="handlePageClick('${linkObj.link}')" class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 mr-2 rounded" ${linkObj.link ? '' : 'disabled'}>
            Prev Page
          </button>
        </div>
      `);
      } else if (linkObj.type === 'nextLink') {
        return (`
        <div>
          <button onclick="handlePageClick('${linkObj.link}')" class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 ml-2 rounded" ${linkObj.link ? '' : 'disabled'}>
            Next Page
          </button>
        </div>
      `);
      }
    }).join(' ');

    document.getElementById('pagination').innerHTML = html;
  }


});

// Funciones globales
async function validateAndAddToCart(productId, stock) {
  const quantityInput = document.getElementById(`quantity_${productId}`);
  const quantity = parseInt(quantityInput.value);
  const errorMessage = document.getElementById(`error_${productId}`);

  if (quantity > stock) {
    quantityInput.classList.add('border-red-500');
    errorMessage.style.display = 'block';
  } else {
    quantityInput.classList.remove('border-red-500');
    errorMessage.style.display = 'none';
    await addToCart(productId, quantity);
  }
}

async function addToCart(productId, quantity) {
  try {
    const userResponse = await fetch(`${apiUrl}/api/session/current`);
    const userData = await userResponse.json();
    const cartId = userData.cart;
    const addToCartResponse = await fetch(`${apiUrl}/api/carts/${cartId}/product/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity })
    });
    const result = await addToCartResponse.json();

    if (addToCartResponse.ok) {
      const card = document.getElementById(`card_${productId}`);
      const addToCartSection = document.getElementById(`addToCartSection_${productId}`);
      const successMessage = document.createElement('div');
      successMessage.classList.add('bg-green-500', 'text-white', 'font-bold', 'text-center', 'px-4', 'py-2', 'mt-2', 'flex', 'w-full', 'h-auto');
      successMessage.textContent = 'Producto agregado';

      addToCartSection.innerHTML = ''; // Clear the section content
      addToCartSection.appendChild(successMessage);
    }

    console.log(result.message);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
  }
}

function irCarrito() {
  window.location.href = `${apiUrl}/profile-view`;
}
