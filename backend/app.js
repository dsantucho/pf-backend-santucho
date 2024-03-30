// -------- Servidor Express ---------
const express = require("express");
const DataBase = require("./src/models/db/index.js")
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const MongoStore = require ('connect-mongo');
const session = require('express-session');
const routerProd = require("./src/routes/product.routes.js");
const routerCart = require("./src/routes/carts.routes.js");
const routerAuth = require("./src/routes/auth.routes.js")
const uiRouter = require("./src/routes/app.routes.js");
const routerSession = require("./src/routes/session.routes.js");
const app = express(); // creo la app
const http = require('http');
const server = http.createServer(app);
//const ProductManager = require("./dao/FileSystem/ProductManager.js");
const ProductManager = require ("./src/services/ProductManager.js");
const passport = require('passport');
const initializePassport = require('./src/passport/passport.js');
const { Command } = require('commander');
const dotenv = require('dotenv');

//Socket
const io = new Server(server);

// Commander
const program = new Command();
program
  .option('-d', 'Variable para hacer debug', false)
  .option('--mode <mode>', 'Modo de trabajo' , 'dev')
  program.parse()
// Cargar la configuración de .env.dev o .env.prod dependiendo del modo
try {
  console.log('que entra opts: ', program.opts().mode)
  dotenv.config({
    path: program.opts().mode == 'dev' ? '.env.dev' : '.env.prod'
  });
  console.log('Options mode: ', program.opts())
} catch (error) {
  console.error('Error cargando archivos .env:', error);
}


//Public
app.use(express.static(__dirname + '/src/public'));
//Middelwares
app.use(express.json()); //enviar y recibir archivos JSON
app.use(express.urlencoded({ extended: true })); //permitir extensiones en la url

//motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + "/src/views");

//Routes
app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://dsantucho:coder123456@proyectofinalbk.syalrvk.mongodb.net/ecommerce',
    //ttl: 10
  }),
  secret:'secretCoder',
  resave:true,
  saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', uiRouter) //tiene las vistas de home y realtimeProducts
app.use('/api/products/', routerProd)
app.use('/api/carts/', routerCart)
app.use('/auth/',routerAuth)
app.use('/api/session/', routerSession)

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

app.get('/sessionSet', (req,res)=>{
  req.session.user = 'sol';
  req.session.age = 32;
  res.send('Session OK!')
})

console.log(process.env.PORT)
server.listen(process.env.PORT, () => {
  console.log("Server listen: ",process.env.PORT);
  //ON DATABASE
  DataBase.connect()
})
