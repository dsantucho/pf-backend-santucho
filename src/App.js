// -------- Servidor Express ---------
const express = require("express");
const DataBase = require("./dao/db/index.js")
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const routerProd = require("./routes/product.routes.js");
const routerCart = require("./routes/carts.routes.js");
const uiRouter = require("./routes/app.routes.js")
const app = express() // creo la app
const http = require('http');
const server = http.createServer(app);
//const ProductManager = require("./dao/FileSystem/ProductManager.js");
const ProductManager = require ("./ProductManager.js")

//Socket
const io = new Server(server);


//PORT
const PORT = 8080 || process.env.PORT;

//Public
app.use(express.static(__dirname + '/public'))
//Middelwares
app.use(express.json()) //enviar y recibir archivos JSON
app.use(express.urlencoded({ extended: true })) //permitir extensiones en la url

//motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + "/views");
console.log(__dirname)
//Routes
app.use('/', uiRouter) //tiene las vistas de home y realtimeProducts
app.use('/api/products/', routerProd)
app.use('/api/carts/', routerCart)

//InicialiCarzar el Socket en el servido
//on prendo socket - escuchador de eventos
io.on('connection', async (socket) => {
  // aqui se hace toda la magia, si conecta a mi socket se hablan
  console.log('user conectado');

  const product = new ProductManager();

  //enviar mensaje desde el servidor
  socket.emit('mensaje1', 'Hola Cliente,estas escuchando al servidor');
  socket.emit("productList", await product.getProducts());//envio la lista de productos

  //ESCUCHAR CLIENTE addProduct y envio newProduct el producto nuevo
  socket.on('addProduct', (data) => {
    console.log('Escuchando add product')
    // json data
    product.addProduct(JSON.parse(data)); //add new product usando productManager.js method
    socket.emit('newProduct', data); //envio el nuevo producto agregado al cliente
    console.log('dato nuevo: ',data) // consola de servidor: que dato agrego
  })

})




server.listen(PORT, () => {
  console.log("Puerto arriba en consola: ", PORT);
  //ON DATABASE
  DataBase.connect()
})
