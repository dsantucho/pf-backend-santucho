const express = require('express')
const {Router} = express
//middelware
const {isAdmin, isUser, isAuthenticated} = require('../middlewares/auth.middleware.js')


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

/* router.get('/realtimeProducts', async (req, res)=>{
  // Renderizar la vista home.handlebars y pasarle la lista de productos
  res.render('realtimeProducts',{});
})  */
//admin-view
router.get('/admin-view', isAdmin, async(req,res)=>{
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
  res.render('profile', {email: req.user.email})
})

// Agrega la ruta para la página de acceso denegado
router.get('/access-denied', (req, res) => {
  res.sendFile(__dirname + '/views/denied.html');
});


module.exports = router