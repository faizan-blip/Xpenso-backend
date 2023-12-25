const express = require('express')
const app = express()
const cors = require('cors')
require("dotenv").config()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
const path = require('./routes/expense')
app.use('/api' , path)

// const fileUpload = require('express-fileupload')
// app.use(fileUpload({
//     useTempFiles : true,
//     tempFileDir : '/tmp/'
// }));


const connect = require('./config/database')


const cloudinary = require('./config/cloudinary')
cloudinary.cloudinaryConnect();
connect();

app.listen(PORT , ()=>{
    console.log(`App running in ${PORT}`);
})
