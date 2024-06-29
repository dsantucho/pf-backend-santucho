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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts',
            required: true
        },
        role: {
            type: String,
            require: true,
            default: 'user',
            enum: ['user', 'admin', 'premium']
        },
        //esto es para el resert pasword
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: Date
        },
        documents: [
            {
                name: {
                    type: String,
                    required: true,
                    enum: ['identificacion', 'comprobante_domicilio', 'estado_cuenta', 'otros']
                },
                reference: {
                    type: String,
                    required: true
                }
            }
        ],
        profileImage: {
            type: String 
        },
        last_connection: {
            type: Date
        }
    },
    {
        timestamps: true,
        strict: false
    }
);

const User = mongoose.model('user', UserSchema);
module.exports = User;