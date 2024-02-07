const express = require('express');
const Carts = require('../dao/FileSystem/Carts.js');
//bd
const CartsBd = require('../dao/db/models/cart.model.js')

const { Router } = express

const routerCart = new Router()
const cart = new Carts();
// -------------- CON BD ---------------------
//POST
routerCart.post('/bd/addCart', async (req, res) => {
    try {
        const cartId = await CartsBd.create(red.body);
        res.status(201).send({
            msj:'Cart Creada',
            data:cartId
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// -------------SIN BD----------------------
// Ruta para crear un nuevo carrito
routerCart.post('/', async (req, res) => {
    try {
        const cartId = await cart.createCart();
        res.json({ message: 'Carrito creado', cartId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para listar los productos de un carrito
routerCart.get('/:cid', async (req, res) => {

    try {
        const cartId = req.params.cid;
        const cartRes = await cart.getCartById(cartId);
        res.json(cartRes.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para agregar un producto a un carrito
routerCart.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await cart.addProductToCart(cartId, productId);
        res.json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = routerCart;