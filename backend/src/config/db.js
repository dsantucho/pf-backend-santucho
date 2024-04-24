const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

module.exports = {
    connect: ()=>{
        return mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("Base de datos conectada")
            console.log('ENV: ', process.env.MONGO_UR)
        }).catch((err)=>{
            console.log(err)
        })
    }
}

