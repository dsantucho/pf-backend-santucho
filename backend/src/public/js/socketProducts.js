function render(data){
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

var products = [];
//prender socket
const socket = io();
//escuchar eventos/ mensajes del servidor [soy cliente]

//escucho el mensaje de conexion con el servidor
socket.on('mensaje1', (data)=>{
    console.log(data)
})

//esucho la lista que viene del servidor
socket.on('productList',(data)=>{
    products = data;
    render(data);
})
 //VUELTA del servidor con EL  producto nuevos para agregar en la lista existente. 
socket.on('newProduct', (data) => {
    console.log('newproduct listen: ', data);
    products.push(JSON.parse(data));
    console.log('array products: ', products)
    render(products);
})

// form IDA DEL CLIENTE con nuevo product al servidor
function addProduct() {
    //envio desde cliente al servidor
    data = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
        thumbnails: document.getElementById('thumbnails').value,
    };
    //envio al servidor
    console.log('data CON stringgify',JSON.stringify(data))
    socket.emit('addProduct', JSON.stringify(data)); //envio alservidor
    return false
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