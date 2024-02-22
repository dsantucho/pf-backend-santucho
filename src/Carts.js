const fs = require('fs').promises;
const ProductManager = require("./ProductManager.js")
//BD
const CartsModel = require("./dao/db/models/cart.model.js")

class Carts {
    constructor() {
        this.carts = [];
    }

    //devolver todos mis carritos
    async getCarts() {
        try{
            let respBD = await CartsModel.find();
            return respBD
        }catch (err){
            return err
        }
    }

    //crear carrito
    async createCart() {
        console.log('reached cart');
        try{
            let createCart = await CartsModel.create({});
            return createCart;
        }catch(err){
            return err;
        }
    }
    //obtener carrito por id
    async getCartById(cartId) {
        try{
            let resultBD = await CartsModel.findById(cartId).populate('products.product');            
            return resultBD;
        }catch (err){
            return err
        }
    }

    //agregar producto al carrito
    async addProductToCart(cartId, productId) {
        let cart;
        try{
            //voy a traer products para validar que el productsID exista
            const productManager = new ProductManager();
            const productExists = await productManager.getProductById(productId).then(() => true).catch(() => false);
            if (!productExists) {
                throw new Error('Error: Producto no encontrado');
            }
            cart = await this.getCartById(cartId); //traigo el carrito
            //const existingProduct = cart.products.find((p) => p.product._id === productId);
            const isProductInCart = cart.products.some(e => e.product._id.equals(productId));
            console.log(`is product in cart: ${isProductInCart}`)
            if (isProductInCart) {
                // Si el producto ya existe en el carrito, incrementar la cantidad
                cart.products.find(e => e.product._id.equals(productId)).quantity += 1;
                console.log(cart);
                await CartsModel.updateOne({_id: cart._id}, cart);
            } else {
                // Si el producto no existe, agregarlo al carrito con cantidad 1
                cart.products.push({
                    product: productId,
                    quantity: 1,
                });
                await CartsModel.updateOne({_id: cart._id}, cart)
            }


        }catch(err){
            console.log(err);
            return err
        }

        return await this.getCartById(cartId);
    }

}
module.exports = Carts;