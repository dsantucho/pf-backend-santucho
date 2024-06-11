const User = require('../modules/user.model');
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
module.exports = {
    updateUserDocuments
};