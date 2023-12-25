const mongoose = require('mongoose')
const ExpenseSchema = new mongoose.Schema({
    value:{
        type:Number,
        // required:true
    },
    label:{
        type:String,
        // required:true
    },
    createdAt:{
        type:Date,
            required:true,
            default:Date.now(),
    },
    updatedAt:{
        type:Date,
    },
    userToken:{
        type:String
    }
})

module.exports = mongoose.model("expenseschema" , ExpenseSchema)
