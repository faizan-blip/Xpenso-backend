const mongoose = require('mongoose')

// login / signup
const Auth = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    message:{
        type:String
    },
    userToken:{
        type:String
    }
})
module.exports = mongoose.model("Auth" , Auth)