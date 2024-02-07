const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    product: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true,
        default:1
    }
})

const CartSchema = new mongoose.Schema({
    products:{
        type: [ProductSchema],
    }
})

const Cart = mongoose.model('carts',CartSchema);
module.exports = Cart;