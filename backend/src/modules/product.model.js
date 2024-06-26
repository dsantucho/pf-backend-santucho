const mongoose = require('mongoose');
const mongoPaginate = require('mongoose-paginate-v2')

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
        default: 500
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        require: true,
        enum: ['Hogar', 'Tecnologia', 'Cocina', 'Higiene']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})
ProductSchema.plugin(mongoPaginate);
// Middleware para realizar el populate automáticamente
ProductSchema.pre('findOne', function () {
    this.populate('owner', 'email role');
});

ProductSchema.pre('find', function () {
    this.populate('owner', 'email role');
});
const Product = mongoose.model('product', ProductSchema);
module.exports = Product;