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
        try {
            let respBD = await CartsModel.find(); //este find denberia usar el populate
            return respBD
        } catch (err) {
            return err
        }
    }

    //crear carrito
    async createCart() {
        console.log('reached cart');
        try {
            let createCart = await CartsModel.create({});
            return createCart;
        } catch (err) {
            return err;
        }
    }
    //obtener carrito por id
    async getCartById(cartId) {
        try {
            let resultBD = await CartsModel.findById(cartId).populate('products.product');
            return resultBD;
        } catch (err) {
            return err
        }
    }

    //agregar producto al carrito
    async addProductToCart(cartId, productId) {
        let cart;
        try {
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
                await CartsModel.updateOne({ _id: cart._id }, cart);
            } else {
                // Si el producto no existe, agregarlo al carrito con cantidad 1
                cart.products.push({
                    product: productId,
                    quantity: 1,
                });
                await CartsModel.updateOne({ _id: cart._id }, cart)
            }


        } catch (err) {
            console.log(err);
            return err
        }

        return await this.getCartById(cartId);
    }
    // TASK
    //DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
    // Eliminar un producto específico del carrito
    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex((p) => p.product._id.equals(productId));

            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                await CartsModel.updateOne({ _id: cart._id }, cart);
            }
            return await this.getCartById(cartId)
        } catch (err) {
            console.log(err);
            return err;
        }
    }
    //DELETE api/carts/:cid deberá eliminar todos los productos del carrito 
    // Eliminar todos los productos del carrito
    async removeAllProductsFromCart(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            cart.products = [];
            await CartsModel.updateOne({ _id: cart._id }, cart);
            return await this.getCartById(cartId)
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    // PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
    // Actualizar el carrito con un arreglo de productos
    async updateCart(cartId, productsArray) {
        try {
            let cart = await this.removeAllProductsFromCart(cartId)
            cart = await this.getCartById(cartId);
             // Iterar sobre cada objeto en productsArray
            for (const productObj of  productsArray) {
                const productId = productObj.product._id;
                await this.addProductToCart(cartId,productId)
            }
            return await this.getCartById(cartId);
        } catch (err) {
            console.log(err);
            return err;
        }
    }
    //PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
  // Actualizar la cantidad de ejemplares de un producto en el carrito
  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await this.getCartById(cartId);
      const productIndex = cart.products.findIndex((p) => p.product._id.equals(productId));

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;
        await CartsModel.updateOne({ _id: cart._id }, cart);
      }
      return await this.getCartById(cartId);
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
module.exports = Carts;