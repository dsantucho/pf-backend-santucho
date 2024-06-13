const User = require('../modules/user.model');

const updateUserDocuments = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);
        console.log('req.files = ',req.files)

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No se han subido archivos' });
        }

        // Verificar que todos los archivos tengan un nombre válido en req.body.documentName
        const validDocumentNames = ['identificacion', 'comprobante_domicilio', 'estado_cuenta', 'otros'];
        const invalidDocumentNames = [];

        req.files.forEach(file => {
            const documentName = req.body.documentName; // Suponiendo que el nombre del documento se envía en el cuerpo de la solicitud
            if (!validDocumentNames.includes(documentName)) {
                invalidDocumentNames.push(documentName);
            } else {
                user.documents.push({
                    name: documentName,
                    reference: file.path
                });
            }
        });

        if (invalidDocumentNames.length > 0) {
            return res.status(400).json({ message: `Nombre(s) de documento no válido(s): ${invalidDocumentNames.join(', ')}` });
        }

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