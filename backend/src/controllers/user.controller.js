const User = require('../modules/user.model');
const Cart = require('../dao/CartDao');

/* const changeUserRole = async (req, res) => {
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
} */

const changeUserRole = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el usuario quiere cambiar a premium
        if (user.role === 'user') {
            // Verificar que todos los documentos requeridos estén presentes
            const requiredDocuments = ['identificacion', 'comprobante_domicilio', 'estado_cuenta'];
            const uploadedDocuments = user.documents.map(doc => doc.name);
            const missingDocuments = requiredDocuments.filter(doc => !uploadedDocuments.includes(doc));

            if (missingDocuments.length > 0) {
                return res.status(400).json({ 
                    message: 'El usuario no ha terminado de procesar su documentación',
                    missingDocuments: missingDocuments
                });
            }

            // Verificar si el usuario tiene un carrito, si no, crear uno nuevo
            if (!user.cart) {
                let newCart = new Cart();
                user.cart = await newCart.createCart();
            }

            // Actualizar el rol del usuario a premium
            user.role = 'premium';
        } else {
            // Cambiar el rol de premium a user (si lo deseas)
            user.role = 'user';
        }

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
const updateUserDocuments = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Agregar los documentos subidos al campo 'documents' del usuario
        req.files.forEach(file => {
            user.documents.push({ name: file.originalname, reference: file.path });
        });

        await user.save();

        res.status(200).json({ message: 'Documentos actualizados', documents: user.documents });
    } catch (error) {
        console.error('Error al actualizar los documentos del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const updateUserProfileImage = async (req, res) => {
    console.log('req.baseUrl: ', req.baseUrl)
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.log('req.file: ',req.file)
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo' });
        }
        console.log('req.file.path: ', req.file.path)
        user.profileImage = req.file.path;
        await user.save();

        res.status(200).json({ message: 'Imagen de perfil actualizada', profileImage: user.profileImage });
    } catch (error) {
        console.error('Error al actualizar la imagen de perfil:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


module.exports = {
    changeUserRole,
    getUsers,
    updateUserDocuments,
    updateUserProfileImage
};