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
        default:500
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
    owner: {
        /*type: mongoose.Schema.Types.Mixed: El tipo Mixed permite que el campo owner acepte valores de diferentes tipos. En este caso, permite tanto un ObjectId (que es el tipo utilizado para referenciar documentos en MongoDB) como una cadena de texto ('admin'). */
        type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
        required: true,
        validate: {
            validator: function(value) {
                return mongoose.Types.ObjectId.isValid(value) || value === 'admin';
            },
            message: props => `${props.value} is not a valid owner!`
        }
    }
})
ProductSchema.plugin(mongoPaginate);
const Product = mongoose.model('product',ProductSchema);
module.exports = Product;