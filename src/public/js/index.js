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
                <strong>Stock:</strong> ${elem.stock}
            </p>
        </div>
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



