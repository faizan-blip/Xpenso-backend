const mongoose = require('mongoose')
// expense
const budgetschema = new mongoose.Schema({
    value:{
        type:Number,
        // required:true
    },
    createdAt:{
        type:Date,
            // required:true,
            default:Date.now(),
    },
    updatedAt:{
        type:Date,
    },
    userToken:{
        type:String
    }
})

module.exports = mongoose.model("budgetschema" , budgetschema)
