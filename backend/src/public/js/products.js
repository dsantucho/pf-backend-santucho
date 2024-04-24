let paginationLinks = [];  // Array para almacenar los objetos de paginación
function pagesInfo(data){
  document.getElementById('pages').innerHTML = (`
    <div>
      <h3>Total Pages = ${data.totalPages}</h3>
      <h4>Current Page = ${data.currentPage}</h4>
    </div>
  `);
};
function render(data) {
  const html = data.map(elem => {
    return (`
        <div class="max-w-xs rounded overflow-hidden shadow-lg bg-white m-4">
        <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">${elem.title}</div>
            <p class="text-gray-700 text-base">
                <strong>Precio:</strong> $${elem.price}<br>
                <strong>Categoría:</strong> ${elem.category}<br>
                <strong>Stock:</strong> ${elem.stock}<br>
                <strong>ID:</strong> ${elem._id}<br>
            </p>
        </div>
        <button onclick="addToCart('${elem._id}')" class=" text-black font-bold py-2 px-4 rounded">
        Agregar a carrito
        </button>
    </div>
        `)
  }).join(' ')

  document.getElementById('productList').innerHTML = html;
};

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
function handlePageClick(link) {
  if (link && link !== null) {
    fetch(link).then(response => response.json()).then(data => {
      updatePagination(data);
      pagesInfo(data);
      render(data.payload);
    });
  }
}

function updatePagination(data) {
  paginationLinks = [];  // Limpiar el array antes de actualizarlo

  if (data.prevLink) {
    paginationLinks.push({ type: 'prevLink', link: data.prevLink });
  }

  if (data.nextLink) {
    paginationLinks.push({ type: 'nextLink', link: data.nextLink });
  }

  console.log(paginationLinks);
  paginationData(paginationLinks);
}
// Esta función manejará el evento de hacer clic en el botón "Agregar a carrito"
async function addToCart(productId) {
  // Puedes realizar aquí la lógica para agregar el producto al carrito
  console.log(`Producto agregado al carrito: ${productId}`);
  try {
    const response = await fetch(`http://localhost:8080/api/session/current`);
    const userData = await response.json();
    const cartId = userData.cart; // Suponiendo que el ID del carrito está en userData.cart
    const addToCartResponse = await fetch(`http://localhost:8080/api/carts/${cartId}/product/${productId}`, {
        method: 'POST'
    });
    const result = await addToCartResponse.json();
    console.log(result.message);
} catch (error) {
    console.error('Error al agregar producto al carrito:', error);
}
}
function infoBienvenida (data){
  document.getElementById('infoBienvenida').innerHTML = 
     (`
      <h1 id="infoBienvenido" class="text-2xl tracking-wide font-sans">Bienvenido, ${data.email}!</h1>
      <p id="infoRol" class="text-2xl tracking-wide font-sans">Rol: ${data.role}</p>
    `) 
}

//por HTTP request
fetch('http://localhost:8080/api/products/?limit=4&page=1').then((response) => {
  response.json().then(data => {
    render(data.payload);
    updatePagination(data);
    pagesInfo(data)
    console.log(data)
  });
  console.log('Se envio la data desde fetch');
});

fetch ('http://localhost:8080/api/session/current').then((response)=>{
  response.json().then(data => {
    infoBienvenida(data)
  });
})



