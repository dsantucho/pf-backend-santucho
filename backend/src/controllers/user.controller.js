const User = require('../modules/user.model');
const Cart = require('../dao/CartDao')

const changeUserRole = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Verificar si el usuario tiene un carrito, si no, crear uno nuevo
        if (!user.cart) {
            let newCart = new Cart();
            user.cart = await newCart.createCart();
        }

        // Alternar el rol entre 'user' y 'premium'
        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();

        res.status(200).json({ message: `Rol del usuario actualizado a ${user.role}` });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    changeUserRole,
    getUsers
};