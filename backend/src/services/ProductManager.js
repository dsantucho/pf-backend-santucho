//clase “ProductManager” que gestione un conjunto de productos.
const fs = require('fs').promises;
//BD
const Products = require('../models/db/models/product.model')

class ProductManager {

    constructor() {
        this.products = [];
    }

// -- GET ALL PRODUCTS Devolver todos mis productos --
    async getProducts() {
        try{
            let respBD = await Products.find();
            return respBD
        }catch (err){
            return err
        }
    }
// --  ADD producto --
    async addProduct(body) {
        try{
            let newProduct = await Products.create(body)
             return newProduct
         }catch (err){
             return err
         }
    }
//-- GET BY ID -- 
    async getProductById(idSearch) {
        try {
            // Obtener el producto usando BD
            const productRes = await Products.findById(idSearch);
            return productRes // Devolver el producto 
        } catch (error) {
            // Manejar cualquier error y devolver un mensaje de error en formato JSON
            return error
        }
    }
// -- UPDATE un producto segun su ID [no se modifica] --
    async updateProduct(id, updatedFields) {
        try{
            const result = await Products.updateOne(id,updatedFields)
            return await this.getProductById(id);
        }catch(err){
            return err
        }
    }
// -- DELETE --
    async deleteProduct(id) {
        try{
            const result = await Products.deleteOne(id)
            return result
        }catch(err){
            return err
        }
    }
}
module.exports = ProductManager;