const express = require('express');
const { Router } = express;
// Middleware para verificar roles
const { isAdmin, isAuthenticated } = require('../middlewares/auth.middleware.js');
const upload = require('../config/multerConfig.js'); 
const router = new Router();

const { changeUserRole, getUsers, updateUserDocuments, updateUserProfileImage } = require('../controllers/user.controller');

// Ruta para cambiar el rol del usuario
router.put('/premium/:uid', isAuthenticated, isAdmin, changeUserRole);

// Ruta para obtener todos los usuarios
router.get('/', isAdmin, getUsers);

// Ruta para actualizar la imagen de perfil
router.post('/profile/image/:uid', isAuthenticated, upload.single('profileImage'), updateUserProfileImage);

module.exports = router;