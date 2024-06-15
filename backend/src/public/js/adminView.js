document.addEventListener('DOMContentLoaded', function () {
  let paginationLinks = [];  // Array para almacenar los objetos de paginación
  let apiUrl = '';
  // ** FETCH **
  // Obtener la configuración del servidor y luego ejecutar las funciones necesarias
  fetch('/api/config')
    .then(response => response.json())
    .then(config => {
      apiUrl = `http://localhost:${config.apiUrl}`;
      // Realizar las solicitudes fetch necesarias después de obtener la configuración
      fetchCurrentUser();
      updateProductList();
    })
    .catch(error => {
      console.error('Error al obtener la configuración del servidor:', error);
    });

  function pagesInfo(data) {
    document.getElementById('pages').innerHTML = (`
    <div>
      <h3>Total Pages = ${data.totalPages}</h3>
      <h4>Current Page = ${data.currentPage}</h4>
    </div>
  `);
  };

  async function render(data) {
    // Obtener información del usuario actual
    const userResponse = await fetch(`${apiUrl}/api/session/current`);
    const currentUser = await userResponse.json();
    const html = data.map(elem => {
      let owner = 'undefined';
      if (elem.owner) {
        owner = elem.owner === 'admin' ? 'admin' : elem.owner;
      }
      // Condición para mostrar el botón de eliminar
      const showDeleteButton = currentUser.role === 'admin' || (currentUser.role === 'premium' && elem.owner === currentUser._id);
      return (`
    <div id="productCard_${elem._id}" class="w-full rounded overflow-hidden shadow-lg bg-white m-4">
    <div class="px-6 py-4">
      <div id="productTitle" class="font-bold text-xl mb-2">${elem.title}</div>
      <p class="text-gray-700 text-base">
        <strong id="productPrice">Precio:</strong> $${elem.price}<br>
        <strong id="productCategory">Categoría:</strong> ${elem.category}<br>
        <strong id="productStock">Stock:</strong> ${elem.stock}<br>
        <strong>Codigo:</strong> ${elem.code}<br>
        <strong>ID:</strong> ${elem._id}<br>
        <strong id="productOwner">Propietario:</strong> ${owner}<br>
      </p>
    </div>
    <div class="flex justify-center">
    <button onclick="edit('${elem._id}')" class="bg-red-600 m-3 text-white font-bold py-2 px-4 rounded">Editar Producto</button>
    ${showDeleteButton ? `<button onclick="deleteProduct('${elem._id}')" class="bg-black m-3 text-white font-bold py-2 px-4 rounded">Eliminar Producto</button>` : ''}
  </div>

    <!-- Formulario de edición -->
    <form id="editForm_${elem._id}" class="editForm bg-white p-4 rounded shadow-md" style="display: none;">
      <label for="editTitle_${elem._id}" class="block text-gray-700 text-sm font-bold my-2">Título:</label>
      <input type="text" id="editTitle_${elem._id}" name="editTitle" value="${elem.title}" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"><br>
      <label for="editPrice_${elem._id}" class="block text-gray-700 text-sm font-bold my-2">Precio:</label>
      <input type="number" id="editPrice_${elem._id}" name="editPrice" value="${elem.price}" step="0.01" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"><br>
      <label for="editCategory_${elem._id}" class="block text-gray-700 text-sm font-bold my-2">Categoría:</label>
      <input type="text" id="editCategory_${elem._id}" name="editCategory" value="${elem.category}" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"><br>
      <label for="editStock_${elem._id}" class="block text-gray-700 text-sm font-bold my-2">Stock:</label>
      <input type="number" id="editStock_${elem._id}" name="editStock" value="${elem.stock}" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"><br>

      <button type="button" onclick="submitEdit('${elem._id}')" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-auto my-8">Guardar Cambios</button>
    </form>
  </div>
      `);
    }).join('');

    document.getElementById('productList').innerHTML = html;
  };

  async function updateProductList() {
    try {
      const response = await fetch(`${apiUrl}/api/products/?limit=4&page=1`);
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

      //console.log('data CON stringgify', JSON.stringify(data))
      const response = await fetch(`${apiUrl}/api/products/`, {
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
      } else {
        console.error('Error al agregar producto:', response);
      }
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


  /* function edit(productId) {
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
  } */

  function edit(productId) {
    const editForm = document.getElementById(`editForm_${productId}`);
    editForm.style.display = 'block';
  }

  /* async function submitEdit(productId) {
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
  } */
  async function submitEdit(productId) {
    try {
      const form = {
        title: document.getElementById(`editTitle_${productId}`).value,
        price: document.getElementById(`editPrice_${productId}`).value,
        category: document.getElementById(`editCategory_${productId}`).value,
        stock: document.getElementById(`editStock_${productId}`).value
      };
      const response = await fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });
      console.log('response = ', response)
      if (response.ok) {
        console.log('Producto editado exitosamente');
        document.getElementById(`editForm_${productId}`).style.display = 'none';
        updateProductList();
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
      const response = await fetch(`${apiUrl}/api/products/${productId}`, {
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

  //por HTTP request
  fetch(`${apiUrl}/api/products/?limit=4&page=1`).then((response) => {
    response.json().then(data => {
      render(data.payload);
      updatePagination(data);
      pagesInfo(data)
      console.log(data)
    });
    console.log('Se envio la data desde fetch');
  });
});
