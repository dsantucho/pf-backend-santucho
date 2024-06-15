const User = require('../modules/user.model');
const Cart = require('../dao/CartDao');
const transporter = require('../config/email/mailing')

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
const deleteInactiveUsers = async (req, res) => {
    try {
        // Definir el límite de inactividad (30 minutos para pruebas)
        //const inactivityLimit = new Date(Date.now() - 30 * 60 * 1000); // 30 minutos para pruebas
        const inactivityLimit = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 días en producción

        // Encontrar usuarios inactivos con roles 'user' o 'premium'
        const inactiveUsers = await User.find({ 
            last_connection: { $lt: inactivityLimit },
            role: { $in: ['user', 'premium'] }
        });

        // Enviar correos y eliminar usuarios
        for (const user of inactiveUsers) {
            await transporter.sendMail({
                from: 'soledadsantucho@gmail.com',
                to: user.email,
                subject: 'Cuenta eliminada por inactividad',
                text: `Hola ${user.first_name}, tu cuenta ha sido eliminada debido a inactividad prolongada.`
            });

            await User.deleteOne({ _id: user._id });
        }

        res.status(200).json({ message: 'Usuarios inactivos eliminados', count: inactiveUsers.length });
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


module.exports = {
    changeUserRole,
    getUsers,
    updateUserDocuments,
    updateUserProfileImage,
    deleteInactiveUsers,
    deleteUser
};