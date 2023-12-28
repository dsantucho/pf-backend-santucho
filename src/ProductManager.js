//clase “ProductManager” que gestione un conjunto de productos.

const fs = require('fs').promises;

class ProductManager {

    constructor() {
        this.filePath = 'fileSystem.json';
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
    async addProduct({ title, description, price, thumbnail, code, stock }) {
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
            thumbnail,
            code,
            stock,
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
      }

    //TODO: Cambiar el deprecado. Función para generar un id único  
    generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

// ----------- prueba --------------

(async () => {
    const productManager = new ProductManager();

    console.log("ORIGINAL = ", await productManager.getProducts());
    
    let productId; //necesito que este afuera para poder tomarlo luego y usar en search
    let productId2 = '00000'; //id que no existe

    //TEST ADD PRODUTC OK
    try{
        productId = await productManager.addProduct({
            title: 'producto prueba',
            description: 'Este es un producto prueba',
            price: 200,
            thumbnail: 'Sin imagen',
            code: 'abc123',
            stock: 25,
        });
        console.log(`ADD producto ${productId} = `, await productManager.getProducts());
        console.log("productID = ", productId);
    }catch(error){
        console.error(error.message)
    }

    //ADD NO OK - CODE EXISTENTE
    try {
        // Intentar agregar un producto con el mismo código (debería arrojar un error)
        await productManager.addProduct({
            title: 'producto prueba',
            description: 'Este es un producto prueba',
            price: 200,
            thumbnail: 'Sin imagen',
            code: 'abc123',
            stock: 25,
        });
    } catch (error) {
        console.error(error.message);
    }
    
    //BUSCO POR ID OK 
    try {
        const result = await productManager.getProductById(productId);
        console.log("GET BY ID:", result);
    } catch (error) {
        console.error(error.message);
    }
    // BUSCO POR ID NO OK
    try {
        const result = await productManager.getProductById('6w4hh9manss');
        console.log("GET BY ID:", result);
    } catch (error) {
        console.error(error.message);
    }
    // ------ test UPDATE ------
    //1 - No modificar el ID nunca: "no se modifican campos aqui"
    try{
        await productManager.updateProduct(productId, {}); // No se modifican campos
        console.log("1 - No modificar el ID nunca: ", await productManager.getProductById(productId));
    }catch (error) {
        console.error(error.message);
    }
    
    //Modificar 1 campo y el resto queda como estaba:
    try{
        await productManager.updateProduct(productId, { price: 666 }); // Se modifica el precio, el resto queda igual
        console.log("2 - Modificar 1 campo 'PRICE' y el resto queda como estaba: ", await productManager.getProductById(productId));
    }catch (error) {
        console.error(error.message);
    }
    
    //Modificar n campos y los que no se modifican quedan como están
    try{
        await productManager.updateProduct(productId, { price: 300, description: 'Nueva descripción' });
        console.log("3 - Modificar 'PRICE' & 'DESCRIPTION' campos y resto como esta: ", await productManager.getProductById(productId));
    }catch (error) {
        console.error(error.message);
    }
    
    //Modificar TODOS los campos (excepto el ID)
    try{
        await productManager.updateProduct(productId, {
            title: 'Nuevo título',
            description: 'Nueva descripción',
            price: 400,
            thumbnail: 'Nueva imagen',
            stock: 30,
          });
          console.log("4 - Modificar TODOS los campos (excepto el ID): ", await productManager.getProductById(productId));
    }catch (error) {
        console.error(error.message);
    }
    // UPDATE producto con ID no exite '6w4hh9mann'
    try {
        await productManager.updateProduct('6w4hh9mann', {});
        console.log("NUNCA SALE POR AQUI EL ID NO EXISTE");
    } catch (error) {
        console.error("5 - EL ID BUSCADO NO EXISTE: ",error.message);
    } 
    // ---- TEST DELETE --- 
    //id incorrecto
    try {
        await productManager.deleteProduct(productId2); // Supongo que `productId` es el ID de un producto existente
        console.log(`Producto con ID ${productId2} eliminado.`);
        console.log("Productos después de eliminar:", await productManager.getProducts());
      } catch (error) {
        console.error(error.message);
      }
    //id correcto
    try {
        await productManager.deleteProduct(productId); 
        console.log(`Producto con ID ${productId} eliminado.`);
        console.log("Productos después de eliminar:", await productManager.getProducts());
      } catch (error) {
        console.error(error.message);
      }
})();