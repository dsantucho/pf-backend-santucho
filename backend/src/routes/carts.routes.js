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

module.exports = routerCart;