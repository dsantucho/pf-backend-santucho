const express = require('express')
const {Router} = express

const router = new Router()


router.get('/home', async (req, res)=>{
  // Renderizar la vista home.handlebars y pasarle la lista de productos
  res.render('home',{});
}) 

router.get('/realtimeProducts', async (req, res)=>{
  // Renderizar la vista home.handlebars y pasarle la lista de productos
  res.render('realtimeProducts',{});
}) 

module.exports = router