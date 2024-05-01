const express = require('express');
const { Router } = express;
const routerSession = new Router()

// Ruta para obtener el usuario actual
routerSession.get('/current', async (req, res) => {
    console.log("req.user",req.user)
    try {
        // Verifica si el usuario está autenticado
        if (!req.user) {
            return res.status(401).json({ message: 'No hay sesión activa' });
        }

        let sessionUser = req.session.usuario;
        let user = req.user
        if(sessionUser._id == user._id){
            // Devuelve el usuario actual en la respuesta
            res.json({
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "age": user.age,
                "cart": user.cart,
                "role": user.role
            });
        }else{
            // Si el usuario no se encuentra en la sesión, devuelve un error
            return res.status(404).json({ message: 'Usuario no encontrado en la sesión' });
        }

    } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = routerSession;
