const express = require('express');
const { Router } = express;
// Middleware para verificar roles
const { isAdmin, isAuthenticated } = require('../middlewares/auth.middleware.js');
const upload = require('../config/multerConfig.js'); 
const { updateUserDocuments } = require('../controllers/document.controller.js')
const routerDocuments = new Router()

// Ruta para actualizar los documentos del usuario
routerDocuments.post('/:uid', isAuthenticated, upload.array('documents', 10), updateUserDocuments);
module.exports = routerDocuments;