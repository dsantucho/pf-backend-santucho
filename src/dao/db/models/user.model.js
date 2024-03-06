const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true
        },
        password: {
            type: String,
            //require: true
        },
        rol: {
            type: String,
            require: true,
            enum: ['User', 'admin']
        }
    },
    {
        timestamps:true,
        strict:false
    }
);

const User = mongoose.model('user', UserSchema);
module.exports = User;