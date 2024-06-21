const CustomError = require('../utils/errors/CustomError');
const EErrors = require('../utils/errors/EErrors');
const { generateProductErrorInfoSP } = require('../utils/errors/Info');
const ProductManager = require('../dao/ProductDao.js');
//BD
const Products = require('../modules/product.model.js');
const User = require("../modules/user.model.js")
const nodemailer = require("nodemailer");
const transporter = require('../config/email/mailing');

const product = new ProductManager(); //instancio productManager

const getAllProducts = async (req, res) => {
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
            limit: limitQuery,
            page: pageQuery
        }

        let resultPaginate = await Products.paginate(query, options)
        res.json({
            status: 'success',
            payload: resultPaginate.docs,
            totalPages: resultPaginate.totalPages,
            prevPage: resultPaginate.prevPage,
            nextPage: resultPaginate.nextPage,
            page: resultPaginate.page,
            hasPrevPage: resultPaginate.hasPrevPage,
            hasNextPage: resultPaginate.hasNextPage,

            prevLink: resultPaginate.prevPage ? `/api/products?page=${resultPaginate.prevPage}&limit=${limitQuery}&sort=${sortQuery}&status=${statusQuery}&category=${categoryQuery}` : null,
            nextLink: resultPaginate.nextPage ? `/api/products?page=${resultPaginate.nextPage}&limit=${limitQuery}&sort=${sortQuery}&status=${statusQuery}&category=${categoryQuery}` : null,

            totalItems: resultPaginate.totalDocs,
            currentPage: resultPaginate.page,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
}
const postAddProduct = async (req, res) => {
    const { title, price, code, stock, category } = req.body;

    try {
        let owner = req.user._id; // siempre guardo el id del owner para luego hacer un populate
/*         // Verificar si el usuario es premium
        if (req.user && req.user.role === 'premium') {
            // Si es premium, el propietario será su ID
            owner = req.user._id;
        } else {
            // Si no es premium, el propietario será 'ADMIN' por defecto
            owner = 'admin';
        } */

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
const updateProduct = async (req, res) => {
    const productId = req.params.pid;
    const dataReplace = req.body;

    try {
        const conf = await product.updateProduct(productId, dataReplace);
        console.log('CONF: ', conf)
        if (conf instanceof Error) {
            throw conf;
        }
        res.status(200).send(conf);
    } catch (err) {
        res.status(404).send(err);
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }

        const owner = await User.findById(product.owner); // Suponiendo que tienes un modelo User y product.owner es el ID del usuario

        if (req.user.role === 'admin' || (req.user.role === 'premium' && product.owner.toString() === req.user._id.toString())) {
            const conf = await Products.deleteOne({ _id: productId });
            if (conf.deletedCount != 0) {
                if (owner.role === 'premium') {
                    // Enviar correo electrónico al propietario
                    const mailOptions = {
                        from: "soledadsantucho@gmail.com",
                        to: owner.email,
                        subject: "Producto Eliminado",
                        text: `Tu producto "${product.title}" ha sido eliminado del catálogo.`,
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log("Error al enviar el correo:", error);
                        } else {
                            console.log("Correo enviado:", info.response);
                        }
                    });
                }
                return res.status(200).send("Producto eliminado");
            }
        } else {
            return res.status(403).send("No tiene permiso para eliminar este producto");
        }
    } catch (err) {
        return res.status(500).send("Error interno del servidor");
    }
}

const updateProductImage = async (req, res) => {
    const productId = req.params.pid; // Obtener el ID del producto desde los parámetros de la URL
    const imagePath = req.file.path; // Ruta del archivo subido

    try {
        const product = await Products.findById(productId);
        console.log(product)

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        product.image = imagePath; // Suponiendo que tienes un campo 'image' en tu modelo de producto
        await product.save();

        res.status(200).json({ message: 'Imagen del producto actualizada', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllProducts, postAddProduct, updateProduct, deleteProduct, updateProductImage };