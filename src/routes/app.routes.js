const express = require('express')
const {Router} = express

const router = new Router()


router.get('/products', async (req, res)=>{
  // Renderizar la vista home.handlebars y pasarle la lista de productos
  res.render('products',{});
}) 

router.get('/realtimeProducts', async (req, res)=>{
  // Renderizar la vista home.handlebars y pasarle la lista de productos
  res.render('realtimeProducts',{});
}) 

module.exports = router