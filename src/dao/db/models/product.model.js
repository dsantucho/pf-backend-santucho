const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    thumbnails: {
        type: String,
    },
    code: {
        type: String,
        require: true,
        unique: true
    },
    stock: {
        type: String,
        require: true,
        default:5
    },
    status: {
        type: Boolean,
        default:true
    },
    category: {
        type: String,
        require: true,
        enum: ['Hogar', 'Tecnologia', 'Cocina','Higiene']
    },
})

const Product = mongoose.model('product',ProductSchema);
module.exports = Product;