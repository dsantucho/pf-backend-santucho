const CartsDao = require('../dao/CartDao.js');
const cart = new CartsDao();

const createCart = async (req, res) => {
    try {
        const cartId = await cart.createCart();
        res.status(201).send({
            msj: 'Cart Creada',
            data: cartId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCarts = async (req, res) => {
    try {
        const cartRes = await cart.getCarts();
        res.json(cartRes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartRes = await cart.getCartById(cartId);
        res.json(cartRes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        const updatedCart = await cart.addProductToCart(cartId, productId, quantity);
        res.json({ message: 'Producto agregado al carrito', data: updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeProductFromCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const deleteProduct = await cart.removeProductFromCart(cartId, productId);
        res.json({ message: 'Producto removido del carrito', data: deleteProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeAllProductsFromCart = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const deleteAllProduct = await cart.removeAllProductsFromCart(cartId);
        res.json({ message: 'Se eliminaron todos los productos del carrito', data: deleteAllProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCart = async (req, res) => {
    const cartId = req.params.cid;
    const productsArray = req.body;
    try {
        const updateCart = await cart.updateCart(cartId, productsArray);
        res.json({ message: 'Se actualizó el carrito', data: updateCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProductQuantity = async (req, res) => {
    const cartId = req.params.cid;
    const newQuantity = req.body.quantity;
    const productId = req.params.pid;

    try {
        const updateQuantity = await cart.updateProductQuantity(cartId, productId, newQuantity);
        res.json({ message: 'Se actualizó la cantidad', data: updateQuantity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    const userEmail = req.user.email;
    try {
        const purchaseResult = await cart.purchaseCart(cartId, userEmail);

        if (purchaseResult.error) {
            return res.status(400).json({ error: purchaseResult.error });
        }

        res.json({ 
            message: purchaseResult.message,
            data: purchaseResult.data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; */
const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    const { userId, userEmail, amount } = req.body;

    try {
        const purchaseResult = await cart.purchaseCart(cartId, userEmail, amount, userId);

        if (purchaseResult.error) {
            return res.status(400).json({ error: purchaseResult.error });
        }

        res.json({ 
            message: purchaseResult.message,
            data: purchaseResult.data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCart,
    getCarts,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    removeAllProductsFromCart,
    updateCart,
    updateProductQuantity,
    purchaseCart
};
