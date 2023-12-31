// -------- Servidor Express ---------
const express = require("express");
const ProductManager = require("./ProductManager.js");

const PORT = 8080;
const app = express(); // creo la app

const product = new ProductManager(); //instancio productManager

app.get('/', (req, res) => {
    res.json({ message: 'Hola desde el servidor Express' });
});
app.get('/products', async (req, res) => {
    try {
        // Obtener el límite de resultados desde los query parameters
        // el 10 le indica al parseInt su base
        const limit = parseInt(req.query.limit, 10) || undefined;

        // Obtener los productos desde el ProductManager
        const products = await product.getProducts();

        // Aplicar el límite si está definido
        const limitedProducts = limit ? products.slice(0, limit) : products;

        // Devolver los productos en formato JSON
        res.json(limitedProducts);
    } catch (error) {
        // Manejar cualquier error y devolver un mensaje de error en formato JSON
        res.status(500).json({ error: error.message });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        // Obtener el product Id desde req.params
        const productId = req.params.pid;

        // Obtener el producto desde el ProductManager
        const productRes = await product.getProductById(productId);

        // Devolver el producto en formato JSON
        res.json(productRes);
    } catch (error) {
        // Manejar cualquier error y devolver un mensaje de error en formato JSON
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log("Puerto arriba en consola: ", PORT);
})