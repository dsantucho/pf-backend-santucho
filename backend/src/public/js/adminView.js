let paginationLinks = [];  // Array para almacenar los objetos de paginación

function bannerPersonalDataAdmin(data) {
  document.getElementById('bannerPersonalDataAdmin').innerHTML =
    (`
       <h1 class ="text-4xl tracking-wide font-sans" >User Profile</h1>
       <h1 class="text-2xl tracking-wide font-sans">Nombre: ${data.email}!</h1>
       <p  class="text-2xl tracking-wide font-sans">Rol: ${data.role}</p>
       <p class = "text-2xl tracking-wide font-sans">Mi Carrito = ${data.cart} </p>
       <div class= "my-3"> 
       <a class="my-2 w-fit font-bold py-2 px-4 rounded text-white bg-red-600" href="/auth/logout">Logout</a>
       <a class="my-2 w-fit font-bold py-2 px-4 rounded text-white bg-red-600" href="http://localhost:8080/products">Ir a Productos</a>
       </div>
      `)
}
function pagesInfo(data) {
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
        <div id="productCard" class="w-full rounded overflow-hidden shadow-lg bg-white m-4">
          <div class="px-6 py-4">
            <div id="productTitle" class="font-bold text-xl mb-2">${elem.title}</div>
            <p class="text-gray-700 text-base">
              <strong id="productPrice">Precio:</strong> $${elem.price}<br>
              <strong id="productCategory">Categoría:</strong> ${elem.category}<br>
              <strong id="productStock">Stock:</strong> ${elem.stock}<br>
              <strong>ID:</strong> ${elem._id}<br>
            </p>
          </div>
          <div class="flex justify-center">
            <button onclick="edit('${elem._id}')" class="bg-red-600 m-3 text-white font-bold py-2 px-4 rounded">Editar Producto</button>
            <button onclick="deleteProduct('${elem._id}')" class="bg-black m-3 text-white font-bold py-2 px-4 rounded">Eliminar Producto</button>
          </div>

          <!-- Formulario de edición -->
          <form id="editForm" class="editForm" style="display: none;">
            <label for="editTitle_${elem._id}">Título:</label>
            <input type="text" id="editTitle" name="editTitle" value="${elem.title}" ><br>
            <label for="editPrice_${elem._id}">Precio:</label>
            <input type="number" id="editPrice" name="editPrice" value="${elem.price}" step="0.01" ><br>
            <label for="editCategory_${elem._id}">Categoría:</label>
            <input type="text" id="editCategory" name="editCategory" value="${elem.category}" ><br>
            <label for="editStock_${elem._id}">Stock:</label>
            <input type="number" id="editStock" name="editStock" value="${elem.stock}"><br>

            <button type="button" onclick="submitEdit('${elem._id}')">Guardar Cambios</button>
          </form>
        </div>
      `);
  }).join('');

  document.getElementById('productList').innerHTML = html;
};

async function updateProductList() {
  try {
    const response = await fetch('http://localhost:8080/api/products/?limit=4&page=1');
    if (response.ok) {
      const data = await response.json();
      render(data.payload);
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


async function addProduct(event) {
  event.preventDefault(); // Evitar el envío predeterminado del formulario
  try {
    data = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      price: document.getElementById('price').value,
      code: document.getElementById('code').value,
      stock: document.getElementById('stock').value,
      category: document.getElementById('category').value,
      thumbnails: document.getElementById('thumbnails').value,
    };

    console.log('data CON stringgify', JSON.stringify(data))
    const response = await fetch(`http://localhost:8080/api/products/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Indicar que el contenido es JSON
      },
      body: JSON.stringify(data) // Enviar los datos como una cadena JSON
    });

    if (response.ok) {
      console.log('Producto agregado exitosamente = ', response);
      // Después de agregar el producto con éxito, actualiza la lista de productos
      updateProductList();
    } /* else {
      const errorData = await response.json();
      console.error('Error al agregar producto:', errorData.error);
      return errorData
    } */
  } catch (error) {
    return console.error('Error al agregar producto:', error);
  }


}
//limpiar los campos al submit:
document.getElementById('productForm').addEventListener('submit', function () {
  // Clear form fields after submission
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('price').value = '';
  document.getElementById('code').value = '';
  document.getElementById('stock').value = '';
  document.getElementById('category').value = '';
  document.getElementById('thumbnails').value = '';
});


function edit(productId) {
  // Obtener el card del producto correspondiente
  const productCard = document.getElementById(`productCard`);
  // Obtener el formulario de edición dentro del card
  const editForm = document.getElementById('editForm');

  // Mostrar el formulario de edición
  editForm.style.display = 'block';

  // Obtener los valores actuales del producto y llenar el formulario
  const title = document.getElementById('productTitle').innerText;
  const price = document.getElementById('productPrice').innerText;
  const category = document.getElementById('productCategory').innerText;
  const stock = document.getElementById('productStock').innerText;


  // Llenar el formulario con los valores actuales
  editForm.getElementsByTagName('editTitle').value = title;
  editForm.getElementsByTagName('editPrice').value = price;
  editForm.getElementsByTagName('editCategory').value = category;
  editForm.getElementsByTagName('editStock').value = stock;
}

async function submitEdit(productId) {
  try {
    const form = {
      title: document.getElementById('editTitle').value,
      price: document.getElementById('editPrice').value,
      category: document.getElementById('editCategory').value,
      stock: document.getElementById('editStock').value
    }
    const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
      method: 'PUT',
      body: form
    });
    console.log('response = ', response)
    if (response.ok) {
      console.log('Producto editado exitosamente');
      // Ocultar el formulario después de la edición
      editForm.style.display = 'none';
      location.reload();
    } else {
      const errorData = await response.json();
      console.error('Error al editar producto:', errorData.error);
    }
  } catch (error) {
    console.error('Error al editar producto:', error);
  }
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      // Eliminación exitosa, actualizar la vista
      console.log('Producto eliminado exitosamente');
      // Recargar la página para refrescar la lista de productos
      location.reload();
    } else {
      const errorData = await response.json();
      console.error('Error al eliminar producto:', errorData.error);
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
  }
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

// Obtener información del usuario actual
fetch('http://localhost:8080/api/session/current').then((response) => {
  response.json().then(data => {
    bannerPersonalDataAdmin(data);
  });
})
  .catch(error => {
    console.error('Error al obtener información del usuario actual:', error);
  });
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