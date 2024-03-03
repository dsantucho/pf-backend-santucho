const express = require('express')
const {Router} = express

const router = new Router()

/* function auth (req,res){
  let suma = 10
  if (suma ==10){
    next()
  }else{
    res.send ('No tiene acceso')
  }
} */


router.get('/products', async (req, res)=>{
  const username = req.query.username;
  const rol = req.query.rol;
  // Renderizar la vista home.handlebars y pasarle la lista de productos
  res.render('products',{username, rol });
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

module.exports = router