const ProductManager = require('../dao/ProductDao.js');
const express = require('express');
//const mongoosePaginate = require('mongoose-paginate-v2');
//BD
const Products = require('../modules/product.model.js')
//middelware
const {isAdmin, isUser, isAuthenticated} = require('../middlewares/auth.middleware.js')
//FAKER
const { generateProducts } = require('../mocks/products.mocks.js')

const { Router } = express

const routerProd = new Router()
const product = new ProductManager(); //instancio productManager

//CRUD de productos
//La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior
routerProd.get('/',isAuthenticated, async (req, res) => {
    try {
        // Obtener el límite de resultados desde los query parameters
        // el 10 le indica al parseInt su base
        const limitQuery = parseInt(req.query.limit, 10) || 10;
        const pageQuery = parseInt(req.query.page, 10) || 1;
        const sortQuery = req.query.sort || 'asc';
        const categoryQuery = req.query.category || '';
        const statusQuery = req.query.status || true;

        const query = {
            ...(categoryQuery ? { category: categoryQuery } : {}),
          };

        let options = {
            status: statusQuery,
            sort: { price: sortQuery },
            limit:limitQuery, 
            page:pageQuery 
        }

        let resultPaginate = await Products.paginate(query,options)
        res.json({
            status: 'success',
            payload: resultPaginate.docs,
            totalPages: resultPaginate.totalPages,
            prevPage: resultPaginate.prevPage,
            nextPage: resultPaginate.nextPage,
            page: resultPaginate.page,
            hasPrevPage: resultPaginate.hasPrevPage,
            hasNextPage: resultPaginate.hasNextPage,
            //esto no esta funcionando bien
    
            prevLink: resultPaginate.prevPage ? `/api/products?page=${resultPaginate.prevPage}&limit=${limitQuery}&sort=${sortQuery}&status=${statusQuery}&category=${categoryQuery }` : null,
            nextLink: resultPaginate.nextPage ? `/api/products?page=${resultPaginate.nextPage}&limit=${limitQuery}&sort=${sortQuery}&status=${statusQuery}&category=${categoryQuery }` : null,
            
            totalItems: resultPaginate.totalDocs,
            currentPage: resultPaginate.page,   
          });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
});

//MOCK FAKER
routerProd.get('/mockingproducts', async (req, res) => {
    try {
        const productsMock = [];
        for (let i = 0; i < 100; i++) {
            const product = generateProducts(); // Genera un producto usando Faker
            productsMock.push(product); // Agrega el producto al array
        }
        res.json({ status: 'success', payload: productsMock });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
  });

//La ruta GET /:pid deberá traer sólo el producto con el id proporcionado
routerProd.get('/:pid',isAuthenticated, async (req, res) => {
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
routerProd.post('/',isAdmin, async (req, res) => {
    try {
        const conf = await product.addProduct(req.body);
        res.status(201).json(conf);
    } catch (err) {
        return res.status(500).json({ error: error.message });
    }

})

//DONE La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
routerProd.put('/:pid',isAuthenticated, async (req, res) => {
    const productId = req.params.pid; //tomo el id
    const dataReplace = req.body //data a hacer update
    try {
        const conf = await product.updateProduct({ _id: productId }, dataReplace);
        res.status(200).send(conf)
    } catch (err) {
        res.status(404).send(err)
    }
})

//DONE La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. 
routerProd.delete('/:pid',isAdmin, async (req, res) => {
    const productId = req.params.pid;
    try {
        const conf = await product.deleteProduct({ _id: productId });
        if (conf.deletedCount != 0) {
            res.status(200).send("Producto eliminado")
        }
    } catch (err) {
        res.status(404).send(err)
    }
})



module.exports = routerProd;

