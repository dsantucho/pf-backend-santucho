const express = require('express')
const {Router} = express

const router = new Router()


router.get('/products', async (req, res)=>{
  // Renderizar la vista home.handlebars y pasarle la lista de productos
  res.render('products',{});
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

module.exports = router