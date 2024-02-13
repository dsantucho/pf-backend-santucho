const express = require('express');
const Carts = require('../Carts.js');
//bd
//const CartsBd = require('../dao/db/models/cart.model.js')

const { Router } = express

const routerCart = new Router()
const cart = new Carts();

// Ruta para crear un nuevo carrito
routerCart.post('/', async (req, res) => {
    try {

        const cartId = await cart.createCart();
 
        res.status(201).send({
            msj:'Cart Creada',
            data:cartId
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para listar los productos de un carrito
routerCart.get('/', async (req, res) => {
    try {
        const cartRes = await cart.getCarts();
        res.json(cartRes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerCart.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartRes = await cart.getCartById(cartId);
        res.json(cartRes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para agregar un producto a un carrito
routerCart.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const updatedCart = await cart.addProductToCart(cartId, productId);
        res.json({ message: 'Producto agregado al carrito', data: updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = routerCart;