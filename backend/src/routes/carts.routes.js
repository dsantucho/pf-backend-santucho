const express = require('express');
const CartsDao = require ('../dao/CartDao.js')
const {
    createCart,
    getCarts,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    removeAllProductsFromCart,
    updateCart,
    updateProductQuantity,
    purchaseCart
} = require('../controllers/cart.controller');

const { Router } = express

const routerCart = new Router()
const cart = new CartsDao();

// Ruta para crear un nuevo carrito
/* routerCart.post('/', async (req, res) => {
    try {

        const cartId = await cart.createCart();
 
        res.status(201).send({
            msj:'Cart Creada',
            data:cartId
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); */

routerCart.post('/', createCart);

// Ruta para listar los productos de un carrito
/* routerCart.get('/', async (req, res) => {
    try {
        const cartRes = await cart.getCarts();
        res.json(cartRes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); */
routerCart.get('/', getCarts);

/* routerCart.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartRes = await cart.getCartById(cartId);
        res.json(cartRes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); */
routerCart.get('/:cid', getCartById);
routerCart.post('/:cid/product/:pid', addProductToCart);
routerCart.delete('/:cid/product/:pid', removeProductFromCart);
routerCart.delete('/:cid', removeAllProductsFromCart);
routerCart.put('/:cid', updateCart);
routerCart.put('/:cid/products/:pid', updateProductQuantity);
routerCart.post('/:cid/purchase', purchaseCart);
// Ruta para agregar un producto a un carrito
/* routerCart.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const updatedCart = await cart.addProductToCart(cartId, productId);
        res.json({ message: 'Producto agregado al carrito', data: updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); */

//DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
/* routerCart.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const deleteProduct = await cart.removeProductFromCart(cartId, productId);
        res.json({ message: 'Producto removido del carrito', data: deleteProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); */

//DELETE api/carts/:cid deberá eliminar todos los productos del carrito 
/* routerCart.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const deleteAllProduct = await cart.removeAllProductsFromCart(cartId);
        res.json({ message: 'Se eliminaro todos los productos del carrito', data: deleteAllProduct});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 */
// PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
//quiero pisar los productos con otros nuevos
/* routerCart.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const productsArray = req.body;
    try {
        const updateCart = await cart.updateCart(cartId,productsArray);
        res.json({ message: 'Se actualizo all products', data: updateCart});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); */

//PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
/* routerCart.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const newQuantity = req.body.quantity;
    const productId = req.params.pid;

    try {
        const updateQuantity = await cart.updateProductQuantity(cartId, productId, newQuantity);
        res.json({ message: 'Se actualizo el quantity', data: updateQuantity});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); */

// Ruta para finalizar el proceso de compra del carrito
/* routerCart.post('/:cid/purchase', async (req, res) => {
    const cartId = req.params.cid;
    const userEmail = req.user.email;
    try {
        const purchaseResult = await cart.purchaseCart(cartId, userEmail);

        if (purchaseResult.error) {
            // Si hubo un error durante la compra, devolver el error
            return res.status(400).json({ error: purchaseResult.error });
        }

        // Enviar respuesta de éxito
        res.json({ 
            message: purchaseResult.message,
            data: purchaseResult.data
         });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); */

module.exports = routerCart;