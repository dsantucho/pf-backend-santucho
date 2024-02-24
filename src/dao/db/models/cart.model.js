const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default:1
    }
})

const CartSchema = new mongoose.Schema({
    products:{
        type: [ProductSchema],
    }
})
//midelware
CartSchema.pre('findOne', function(){
    this.populate('products.product')
})
CartSchema.pre('find', function(){
    this.populate('products.product')
})
const Cart = mongoose.model('carts',CartSchema);
module.exports = Cart;