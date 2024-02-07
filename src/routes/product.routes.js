const ProductManager = require("../ProductManager.js");
const express = require('express')
//BD
const Products = require('../dao/db/models/product.model.js')

const { Router  } = express

const routerProd = new Router()
const product = new ProductManager(); //instancio productManager

//CRUD de productos
//La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior
routerProd.get('/',async(req,res)=>{
    try {
        // Obtener el límite de resultados desde los query parameters
        // el 10 le indica al parseInt su base
        const limit = parseInt(req.query.limit, 10) || undefined;

        // Obtener los productos desde el ProductManager
        const products = await product.getProducts();

        // Aplicar el límite si está definido
        const limitedProducts = limit ? products.slice(0, limit) : products;

        // Devolver los productos en formato JSON
        res.json(limitedProducts);
    } catch (error) {
        // Manejar cualquier error y devolver un mensaje de error en formato JSON
        res.status(500).json({ error: error.message });
    }
})

//La ruta GET /:pid deberá traer sólo el producto con el id proporcionado
routerProd.get('/:pid', async (req, res)=>{
    try {
        // Obtener el product Id desde req.params
        const productId = req.params.pid;

        // Obtener el producto desde el ProductManager
        const productRes = await product.getProductById(productId);

        // Devolver el producto en formato JSON
        res.json(productRes);
    } catch (error) {
        // Manejar cualquier error y devolver un mensaje de error en formato JSON
        res.status(500).json({ error: error.message });
    }
})

/* La ruta raíz POST / deberá agregar un nuevo producto con los campos:

 */
//DONE
routerProd.post('/', async (req, res)=>{
    const conf = await product.addProduct(req.body);
    if (conf){
        res.status(201).send("Producto Creado")
    }else{
        res.status(400).send("Producto ya existente y/o  Todos los campos son obligatorios, excepto thumbnails")
    }

})

//DONE La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
routerProd.put('/:pid', async (req, res)=>{
    const productId = req.params.pid; //tomo el id
    const dataReplace = req.body //data a hacer update
    const conf = await product.updateProduct({_id:productId},dataReplace);
    console.log(conf)
    if (conf){
        res.status(200).send("Producto actualizado OK")
    }else{
        res.status(404).send("Producto no encontrado")
    }

})

//DONE La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. 
routerProd.delete('/:pid', async (req, res)=>{
    const productId = req.params.pid;
    const conf = await product.deleteProduct({_id:productId});
    console.log(conf)
    if (conf.deletedCount != 0){
        res.status(200).send("Producto eliminado")
    }else{
        res.status(404).send("Producto no encontrado")
    }
})

module.exports = routerProd;

