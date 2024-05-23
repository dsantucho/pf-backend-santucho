// -------- Servidor Express ---------
const express = require("express");
//const DataBase = require("./dao/db/index.js")
const DataBase = require('./config/db.js')
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const MongoStore = require('connect-mongo');
const session = require('express-session');
const routerProd = require("./routes/product.routes.js");
const routerCart = require("./routes/carts.routes.js");
const routerAuth = require("./routes/auth.routes.js")
const uiRouter = require("./routes/app.routes.js");
const routerSession = require("./routes/session.routes.js");
const userRouter = require("./routes/user.routes.js")
const app = express(); // creo la app
const http = require('http');
const server = http.createServer(app);
//const ProductManager = require("./dao/FileSystem/ProductManager.js");qßweqweßß
const ProductManager = require('./dao/ProductDao.js');
const passport = require('passport');
const initializePassport = require('./passport/passport.js');
const { Command } = require('commander');
const dotenv = require('dotenv');
const cors = require("cors");
const { addLogger } = require('./utils/logger.js');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUIExpress = require('swagger-ui-express')



// many origins 
/* const whiteList = ['http://localhost:8080/', 'http://localhost:8080/', 'http://localhost:8080/'];
const corsOptions = {
  origin: function (origin, callback){
    if(whiteList.indexOf(origin) !== -1){
      callback(null, true) //exite dentro de la whitelist
    }else{
      callback( new Error ('Acceso no autorizado por CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
} */

//Socket
const io = new Server(server);

// Commander
const program = new Command();
program.option('--mode <mode>', 'Modo de trabajo', 'dev')
program.parse()
// Cargar la configuración de .env.dev o .env.prod dependiendo del modo
try {
  dotenv.config({
    path: program.opts().mode == 'DEV' ? '.env.dev' : '.env.prod'
  });
} catch (error) {
  console.error('Error cargando archivos .env:', error);
}
//cors 
// 1 origin
const corsOptions = {
  origin: `http://localhost${process.env.PORT}/`,
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(addLogger)
//cors
app.use(cors(corsOptions))
//Public
app.use(express.static(__dirname + '/public'));
//Middelwares
app.use(express.json()); //enviar y recibir archivos JSON
app.use(express.urlencoded({ extended: true })); //permitir extensiones en la url
// Middleware para manejar la página de acceso denegado
app.get('/access-denied', (req, res) => {
  res.status(401).render('./views/denied.handlebars'); // Renderizar la vista 'denied.hbs'
});
//motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + "/views");

//Routes
app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://dsantucho:coder123456@proyectofinalbk.syalrvk.mongodb.net/ecommerce',
    //ttl: 10
  }),
  secret: 'secretCoder',
  resave: true,
  saveUninitialized: true
}));

initializePassport(process.env.PORT);

app.use(passport.initialize());
app.use(passport.session());
app.use('/', uiRouter) //tiene las vistas de home y realtimeProducts
app.use('/api/products/', routerProd)
app.use('/api/carts/', routerCart)
app.use('/auth/', routerAuth)
app.use('/api/session/', routerSession)
app.use('/api/users', userRouter);
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion API",
      description: "Proyecto Backend Coderhouse - Se realiza la documentacion de las apis de product y cart"
    }

  },
  apis: [`./src/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs))
// Ruta para devolver la configuración actual
app.get('/api/config', (req, res) => {
  res.json({
    apiUrl: process.env.PORT
  });
});

/* app.get('/sessionSet', (req,res)=>{
  req.session.user = 'sol';
  req.session.age = 32;
  res.send('Session OK!')
}) */

server.listen(process.env.PORT, () => {
  console.log("## Server listen: ", process.env.PORT, 'Environment: ', process.env.MODE);
  //ON DATABASE
  DataBase.connect()
})

//InicialiCarzar el Socket en el servido
//on prendo socket - escuchador de eventos
/* io.on('connection', async (socket) => {
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

}) */