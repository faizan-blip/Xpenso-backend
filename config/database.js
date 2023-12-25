const mongoose = require('mongoose');

require("dotenv").config()

const connect = ()=>{
 
   mongoose.connect(process.env.MONGODB_URL , {
    useNewUrlParser:true,
    useUnifiedTopology:true
   }).then(()=>{
    console.log("MongoDb connected Successfully!!");
   }).catch((err)=>{
    console.log(err.message);
    process.exit(1)
   })

}

module.exports = connect