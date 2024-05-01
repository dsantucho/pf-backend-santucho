const fs = require('fs').promises;
const ProductManager = require("./ProductManager.js")

class Carts {
    constructor() {
        this.filePath = './src/dao/carts.json';
        this.carts = [];
        this.init();
    }

    async init() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            console.log('Error al cargar carritos desde el archivo:', error.message);
        }
    }
    //READ FILE
    async loadCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.carts = JSON.parse(data);
            return this.carts;

        } catch (error) {
            // Si el archivo no existe o hay algún otro error, se asume un array vacío.
            this.carts = [];
            return this.carts;
        }
    }
    //escribe el file de carrito
    async saveCarts() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error al guardar carritos en el archivo:', error.message);
        }
    }
    //devolver todos mis carritos
    async getCarts() {
        return await this.loadCarts();
    }
    //crear carrito
    async createCart() {
        const id = this.generateUniqueId();
        const newCart = {
            id,
            products: [],
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return id;
    }
    //obtener carrito por id
    async getCartById(cartId) {
        this.carts = await this.loadCarts();
        const cart = this.carts.find((c) => c.id === cartId);
        if (!cart) {
            throw new Error('Error: Carrito no encontrado');
        }
        return cart;
    }
    //agregar producto al carrito
    async addProductToCart(cartId, productId) {
        //voy a traer products para validar que el productsID exista
        const productManager = new ProductManager();
        const productExists = await productManager.getProductById(productId).then(() => true).catch(() => false);

        if (!productExists) {
            throw new Error('Error: Producto no encontrado');
        }
        // hasta aca chequeo que el productID exita en el file
        
        const cart = await this.getCartById(cartId); //traigo el carrito
        const existingProduct = cart.products.find((p) => p.product === productId);

        if (existingProduct) {
            // Si el producto ya existe en el carrito, incrementar la cantidad
            existingProduct.quantity += 1;
        } else {
            // Si el producto no existe, agregarlo al carrito con cantidad 1
            cart.products.push({
                product: productId,
                quantity: 1,
            });
        }

        await this.saveCarts(); //save escribe el file
        return cartId
    }

    //TODO: Cambiar el deprecado. Función para generar un id único  
    generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }
}
module.exports = Carts;