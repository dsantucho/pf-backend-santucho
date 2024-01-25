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

  document.getElementById('productList').innerHTML = html
};
//por HTTP request
fetch('http://localhost:8080/api/products/').then((response) => {
  response.json().then(data => {
    render(data);
  });
  console.log('Se envio la data desde fetch');
});

