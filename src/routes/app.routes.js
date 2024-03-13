const express = require('express')
const {Router} = express

const router = new Router()
const path = require('path');

// Obtener la ruta absoluta del directorio actual
const absolutePath = path.resolve(__dirname, '..', '404.html');

/* function auth (req,res){
  let suma = 10
  if (suma ==10){
    next()
  }else{
    res.send ('No tiene acceso')
  }
} */




router.get('/products', async (req, res)=>{
  const email = req.query.email;
  const role = req.query.role;
  // Renderizar la vista home.handlebars y pasarle la lista de productos
  res.render('products',{email, role });
}) 
router.get('/carts/:cid', async (req, res)=>{
  const cartId = req.params.cid;
  // Renderizar la vista cart.handlebars  de mi carrito
  res.render('cart',{cartId});
}) 

router.get('/realtimeProducts', async (req, res)=>{
  // Renderizar la vista home.handlebars y pasarle la lista de productos
  res.render('realtimeProducts',{});
}) 
//login vista
router.get('/login-view', async(req,res)=>{
  res.render('login')
})
//registro vista
router.get('/register-view', async(req,res)=>{
  res.render('register')
})
/* router.get('/profile-view',auth, async(req,res)=>{
  res.render('profile')
}) */

/* router.get('*', async(req,res)=>{
  res.status(400).sendFile(absolutePath);
  //res.sendFile(path [, options] [, fn])
}) */

module.exports = router