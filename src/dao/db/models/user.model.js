const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            require: true
        },
        last_name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            unique: true, // Hace que el email sea único
        },
        age: {
            type: Number
        },
        password: {
            type: String,
            //require: true
        },
        //cart:Id con referencia a Carts
        cart: {
            type: String
        },
        //role:String(default:’user’) */
        role: {
            type: String,
            require: true,
            default: 'user',
            enum: ['user', 'admin']
        }
    },
    {
        timestamps: true,
        strict: false
    }
);

const User = mongoose.model('user', UserSchema);
module.exports = User;