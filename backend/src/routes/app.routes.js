const express = require('express');
const {Router} = express;

//middelware
const {isAdmin, isUser, isAuthenticated, isAdminOrPremium} = require('../middlewares/auth.middleware.js')


const router = new Router()
const path = require('path');

// Obtener la ruta absoluta del directorio actual
const absolutePath = path.resolve(__dirname, '..', '404.html');

router.get('/products',isAuthenticated, async (req, res)=>{
  const email = req.query.email;
  const role = req.query.role;
  // Renderizar la vista home.handlebars y pasarle la lista de productos
  res.render('products',{email, role });
}) 
router.get('/carts/:cid',isAuthenticated, async (req, res)=>{
  const cartId = req.params.cid;
  // Renderizar la vista cart.handlebars  de mi carrito
  res.render('cart',{cartId});
}) 

// Ruta para la vista de administración de usuarios
router.get('/admin/users', isAuthenticated, isAdmin, (req, res) => {
  res.render('adminUsers');
});

/* router.get('/realtimeProducts', async (req, res)=>{
  // Renderizar la vista home.handlebars y pasarle la lista de productos
  res.render('realtimeProducts',{});
})  */
//admin-view
router.get('/admin-view', isAdminOrPremium, async(req,res)=>{
  res.render('adminView')
})
//login vista
router.get('/login-view', async(req,res)=>{
  res.render('login')
})
//registro vista
router.get('/register-view', async(req,res)=>{
  res.render('register')
})
router.get('/profile-view',isAuthenticated, async(req,res)=>{
  res.render('profile', {
    email: req.user.email,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  })
})
// Ruta de prueba para el logger
router.get('/loggerTest', (req, res) => {
  req.logger.debug('Este es un mensaje de debug');
  req.logger.info('Este es un mensaje de info');
  req.logger.warning('Este es un mensaje de warning');
  req.logger.error('Este es un mensaje de error');
  res.send('Mensajes de prueba enviados al logger');
});

// Agrega la ruta para la página de acceso denegado
router.get('/access-denied', (req, res) => {
  res.sendFile(__dirname + '/views/denied.html');
});


module.exports = router