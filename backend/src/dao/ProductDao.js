//import {productModel} from '../modules/product.model.js'

//clase “ProductManager” que gestione un conjunto de productos.
const fs = require('fs').promises;
//BD
const Products = require('../modules/product.model.js')

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
async updateProduct(_id, updatedFields) {
    try {
        const productExist =  await this.getProductById(_id)
        console.log("PRODUCTO DAO EXISTE = ", productExist)
        const result = await Products.updateOne(_id, updatedFields);
        if (result.nModified === 1) {
            // Si se modificó correctamente, devolver el producto actualizado
            return await this.getProductById(_id);
        } else {
            // Si no se modificó ningún documento, devolver un mensaje de error
            throw new Error('El producto no fue encontrado o no se modificó correctamente.');
        }
    } catch (err) {
        // Manejar errores de MongoDB
        return err;
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