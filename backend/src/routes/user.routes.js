const express = require('express');
const { Router } = express;
// Middleware para verificar roles
const { isAdmin } = require('../middlewares/auth.middleware.js');
const router = new Router();

const { changeUserRole, getUsers } = require('../controllers/user.controller');

// Ruta para cambiar el rol del usuario
router.put('/premium/:uid',isAdmin, changeUserRole);

// Ruta para obtener todos los usuarios
router.get('/',isAdmin, getUsers);

module.exports = router;
