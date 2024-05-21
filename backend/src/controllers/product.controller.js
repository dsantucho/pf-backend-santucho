const CustomError = require('../utils/errors/CustomError');
const EErrors = require('../utils/errors/EErrors');
const {generateProductErrorInfoSP} = require('../utils/errors/Info');
const ProductManager = require('../dao/ProductDao.js');
//BD
const Products = require('../modules/product.model.js')

const product = new ProductManager(); //instancio productManager

const  getAllProducts = async (req,res)=>{
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
    
            prevLink: resultPaginate.prevPage ? `/api/products?page=${resultPaginate.prevPage}&limit=${limitQuery}&sort=${sortQuery}&status=${statusQuery}&category=${categoryQuery }` : null,
            nextLink: resultPaginate.nextPage ? `/api/products?page=${resultPaginate.nextPage}&limit=${limitQuery}&sort=${sortQuery}&status=${statusQuery}&category=${categoryQuery }` : null,
            
            totalItems: resultPaginate.totalDocs,
            currentPage: resultPaginate.page,   
          });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
}

const postAddProduct_viejo = async(req, res) =>{
    const {title, price, code, stock, category} = req.body

    //costumError
    if(!title || !price || !code || !stock || !category){
        CustomError.createError({
            name: "Product creation Error",
            cause: generateProductErrorInfoSP({ title, price, code, stock, category }),
            message: "Error tratando de crear el producto",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
    //si todo sale bien
    const conf = await product.addProduct(req.body);
    res.status(201).json(conf);

}

const postAddProduct = async (req, res) => {
    const { title, price, code, stock, category } = req.body;

    try {
        let owner;
        // Verificar si el usuario es premium
        if (req.user && req.user.role === 'premium') {
            // Si es premium, el propietario será su ID
            owner = req.user._id;
        } else {
            // Si no es premium, el propietario será 'ADMIN' por defecto
            owner = 'admin';
        }

        // Verificar si faltan datos
        if (!title || !price || !code || !stock || !category) {
            throw CustomError.createError({
                name: "Product creation Error",
                cause: generateProductErrorInfoSP({ title, price, code, stock, category }),
                message: "Error tratando de crear el producto",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }

        // Crear el producto con el propietario adecuado
        const conf = await product.addProduct({ ...req.body, owner });
        res.status(201).json(conf);
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error
        res.status(500).json({ error: error.message });
    }
}
module.exports = {getAllProducts, postAddProduct}