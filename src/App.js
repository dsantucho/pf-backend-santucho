//import routerProd from "./routes/product.routes.js";
// -------- Servidor Express ---------
const express = require("express");
const routerProd = require("./routes/product.routes.js");
const routerCart = require("./routes/carts.routes.js")
/* const __dirname = require("./path.js")
const path = require("path"); */

const PORT = 8080;
const app = express(); // creo la app
//Middelwares
app.use(express.json()) //enviar y recibir archivos JSON
app.use(express.urlencoded({extended:true})) //permitir extensiones en la url

//Routes
app.use('/api/products/', routerProd)
app.use('/api/carts/', routerCart)

app.listen(PORT, () => {
    console.log("Puerto arriba en consola: ", PORT);
})
//----- Tests -----
/* 
Test 0 - http://localhost:8080/ Server Express arriba mensaje
Test1 -  http://localhost:8080/products sin query, eso debe devolver todos los 10 productos.
Test2 -  http://localhost:8080/products?limit=5 , eso debe devolver sólo los primeros 5 de los 10 productos.
Test3 -  http://localhost:8080/products/2, eso debe devolver sólo el producto con id=2.
Test4 -  http://localhost:8080/products/34123123, al no existir el id del producto, debe devolver un objeto con un error indicando que el producto no existe.
*/