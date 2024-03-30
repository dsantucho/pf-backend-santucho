const mongoose = require('mongoose');

module.exports = {
    connect: ()=>{
        return mongoose.connect("mongodb+srv://dsantucho:coder123456@proyectofinalbk.syalrvk.mongodb.net/ecommerce")
        .then(()=>{
            console.log("Base de datos conectada")
        }).catch((err)=>{
            console.log(err)
        })
    }
}