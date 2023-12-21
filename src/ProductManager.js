//clase “ProductManager” que gestione un conjunto de productos.
class ProductManager {
    
    constructor() {
       this.products = [];
     }

  //Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
    getProducts() {
      return this.products;
    }
  
    addProduct({ title, description, price, thumbnail, code, stock }) {
      // Verificar si el CODE ya existe. It returns true if, in the array, it finds an element for which the provided function returns true; otherwise it returns false. It doesn't modify the array.
      const codeExists = this.products.some((product) => product.code === code);
      if (codeExists) {
        //throw new Error('Error: Código de producto duplicado');
        //console.log(codeExists);
        return console.log('Error: Código de producto duplicado');
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
  
      // Devolver el id del producto recién agregado
      return id;
    }
  
    getProductById(productId) {
      const product = this.products.find((p) => p.id === productId);
      if (!product) {
        //throw new Error('Error: Producto no encontrado');
        return console.log('Error: Producto no encontrado');
      }
      return product;
    }
  
    // Función para generar un id único (puedes usar una librería como uuid para esto)
    generateUniqueId() {
      return Math.random().toString(36).substr(2, 9);
    }
  }

  // ---- prueba -----

  // Crear una instancia de ProductManager
  const productManager = new ProductManager();
  
  // Obtener productos (debería devolver [])
  console.log(productManager.getProducts());
  
  // Agregar un producto
  const productId = productManager.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
  });
  const productId2 = productManager.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: '12344',
    stock: 25,
  });
  
  // Obtener productos (debería devolver el producto recién agregado)
  console.log(productManager.getProducts());
  
  // 2 Agregar un producto
  const productId3 = productManager.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
  });
  
  // Obtener un producto por su id (debería devolver el producto recién agregado)
  console.log(productManager.getProductById(productId));
  