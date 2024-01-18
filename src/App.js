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
