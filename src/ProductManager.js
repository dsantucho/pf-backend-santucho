//clase “ProductManager” que gestione un conjunto de productos.
const fs = require('fs').promises;

class ProductManager {

    constructor() {
        this.filePath = './src/products.json';
        this.products = [];
        this.init(); // me tengo que asegurar que se inicie para poder leer del archivo 
    }

    async init() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.log("Error al cargar productos desde el archivo:", error.message);
        }
    }
    //READ FILE
    async loadProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.products = JSON.parse(data);
            return this.products;

        } catch (error) {
            // Si el archivo no existe o hay algún otro error, se asume un array vacío.
            console.log("el read sale por vacio []")
            this.products = [];
            return this.products;
        }
    }
    //WRITE FILE
    async saveProducts() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error al guardar productos en el archivo:', error.message);
        }
    }

    //Devolver todos mis productos
    async getProducts() {
        return await this.loadProducts();
    }
    //ADD producto
    async addProduct({
        title,
        description,
        price,
        code,
        stock,
        category,
        thumbnails,
    }) {

        // Validar que todos los campos obligatorios estén presentes
        if (!title || !description || !price || !code || !stock || !category) {
            return console.log('Error: Todos los campos son obligatorios, excepto thumbnails');
        }
        // Verificar si el CODE ya existe. It returns true if, in the array, it finds an element for which the provided function returns true; otherwise it returns false. It doesn't modify the array.
        const codeExists = this.products.some((product) => product.code === code);
        if (codeExists) {
            return console.log('Error id duplicado: Código de producto duplicado');
        }

        // Generar un id único (puedes utilizar alguna librería para generar ids, como uuid)
        const id = this.generateUniqueId();

        // Crear el objeto de producto
        const newProduct = {
            id,
            title,
            description,
            price,
            code,
            stock,
            status: true, // Añadir campo status con valor true por defecto
            category,
            thumbnails: thumbnails || [], // Añadir campo thumbnails con valor por defecto []

        };

        // Agregar el producto al array de productos
        this.products.push(newProduct);
        // guarda en el file
        await this.saveProducts();
        // Devolver el id del producto recién agregado
        return id;
    }

    async getProductById(idSearch) {
        this.products = await this.loadProducts();
        const product = this.products.find((p) => p.id === idSearch);
        if (!product) {
            //return console.log('Error: Producto no encontrado');
            throw new Error('Error: Producto no encontrado');
        }
        return product;
    }
    //UPDATE un producto segun su ID [no se modifica]
    async updateProduct(id, updatedFields) {
        const products = await this.loadProducts();
        const index = products.findIndex((p) => p.id === id);

        if (index === -1) {
            throw new Error('Error: Producto no encontrado');
        }

        // Obtener el producto existente [quiero hacer update de los atributos especificos]
        const existingProduct = this.products[index];

        // Actualizar el producto manteniendo el mismo ID
        this.products[index] = {
            id,
            ...existingProduct,  // Mantener los valores existentes
            ...updatedFields,   // Sobrescribir los valores proporcionados
        };

        await this.saveProducts();
        return id;
    }

    async deleteProduct(id) {
        const products = await this.loadProducts();
        const index = products.findIndex((p) => p.id === id);

        if (index === -1) {
            throw new Error('Error al deleteProduct: Producto no encontrado');
        }

        // Eliminar el producto del array desde el index elimina 1 
        this.products.splice(index, 1);

        await this.saveProducts();
        return id;
    }

    //TODO: Cambiar el deprecado. Función para generar un id único  
    generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }
}
module.exports = ProductManager;