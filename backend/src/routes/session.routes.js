const express = require('express');
const { Router } = express;
const routerSession = new Router();
const User = require('../modules/user.model'); 

// Ruta para obtener el usuario actual
routerSession.get('/current', async (req, res) => {
    try {
        // Verifica si el usuario está autenticado
        if (!req.user) {
            return res.status(401).json({ message: 'No hay sesión activa' });
        }

        // Obtener el usuario desde la base de datos para asegurarse de que los datos estén actualizados
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar la sesión del usuario con los datos más recientes
        req.session.usuario = user;

        // Devuelve el usuario actual en la respuesta
        res.json({
            "_id": user._id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "age": user.age,
            "cart": user.cart,
            "role": user.role,
            "last_connection": user.last_connection,
            "documents": user.documents,
            "profileImage": user.profileImage
        });
    } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = routerSession;
