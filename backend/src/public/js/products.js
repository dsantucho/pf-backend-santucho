document.addEventListener('DOMContentLoaded', function () {
  let paginationLinks = [];  // Array para almacenar los objetos de paginación
  let apiUrl = '';

  // Obtener la configuración del servidor y luego ejecutar las funciones necesarias
  fetch('/api/config')
    .then(response => response.json())
    .then(config => {
      apiUrl = `http://localhost:${config.apiUrl}`;
      console.log(apiUrl);

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

  function render(data, currentUser) {
    const html = data.map(elem => {
      let owner = 'undefined';
      let ownerInfo = 'undefined';
      let cardStyle = '';

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

      return (`
      <div class="max-w-xs rounded overflow-hidden shadow-lg bg-white m-4" style="${cardStyle}">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">${elem.title}</div>
          <p class="text-gray-700 text-base">
            <strong>Precio:</strong> $${elem.price}<br>
            <strong>Categoría:</strong> ${elem.category}<br>
            <strong>Stock:</strong> ${elem.stock}<br>
            <strong>ID:</strong> ${elem._id}<br>
            <strong>Propietario:</strong> ${ownerInfo}<br>
          </p>
        </div>
        ${(currentUser.role === 'admin' || currentUser.role === 'user' || (currentUser.role === 'premium' && currentUser._id !== owner)) ? `
          <button onclick="addToCart('${elem._id}')" class=" text-black font-bold py-2 px-4 rounded">
            Agregar a carrito
          </button>
        ` : ''}
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

      if (response.ok) {
        const data = await response.json();
        render(data.payload, currentUser);
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
async function addToCart(productId) {
  try {
    const userResponse = await fetch(`${apiUrl}/api/session/current`);
    const userData = await userResponse.json();
    const cartId = userData.cart;
    const addToCartResponse = await fetch(`${apiUrl}/api/carts/${cartId}/product/${productId}`, {
      method: 'POST'
    });
    const result = await addToCartResponse.json();
    console.log(result.message);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
  }
}

function irCarrito() {
  window.location.href = `${apiUrl}/profile-view`;
}