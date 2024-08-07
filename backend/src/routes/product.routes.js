const ProductManager = require('../dao/ProductDao.js');
const express = require('express');
//const mongoosePaginate = require('mongoose-paginate-v2');
//BD
const Products = require('../modules/product.model.js')
//middelware
const { isAdmin, isUser, isAuthenticated, isPremium, isAdminOrPremium } = require('../middlewares/auth.middleware.js');
//const {middleware} = require('../utils/errors/middlewares/index.js')
//FAKER
const { generateProducts } = require('../mocks/products.mocks.js')
const { getAllProducts, postAddProduct, updateProduct, deleteProduct, updateProductImage } = require('../controllers/product.controller.js');
const upload = require('../config/multerConfig');

const { Router } = express
const routerProd = new Router()
const product = new ProductManager(); //instancio productManager
routerProd.use(require('../utils/errors/middlewares/index.js')); // usa el middleware directamente

//CRUD de productos
//La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior
routerProd.get('/', isAuthenticated, getAllProducts);

//MOCK FAKER
routerProd.get('/mockingproducts', async (req, res) => {
    try {
        const productsMock = [];
        for (let i = 0; i < 100; i++) {
            const product = generateProducts(); // Genera un producto usando Faker
            productsMock.push(product); // Agrega el producto al array
        }
        res.json({ status: 'success', payload: productsMock });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

//La ruta GET /:pid deberá traer sólo el producto con el id proporcionado
routerProd.get('/:pid', isAuthenticated, async (req, res) => {
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
})

//DONE
routerProd.post('/', isAdminOrPremium, postAddProduct);

//DONE La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
routerProd.put('/:pid', isAdminOrPremium, updateProduct);

//La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. 
routerProd.delete('/:pid', isAdminOrPremium, deleteProduct)

// Ruta para actualizar la imagen del producto
routerProd.post('/image/:pid', isAdminOrPremium, upload.single('productImage'), updateProductImage);

module.exports = routerProd;

