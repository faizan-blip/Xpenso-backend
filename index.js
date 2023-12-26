const express = require('express')
const app = express()
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
require("dotenv").config()

const PORT = process.env.PORT || 3000


const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type,Authorization',
  };
  
  // Apply CORS middleware to all routes
  app.use(cors(corsOptions));
app.use(express.json());

app.use(session({
    secret:process.env.GOOGLE_SECRET,
    resave:false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
const configurePassport = require('./config/Passport');

configurePassport()

const path = require('./routes/expense');
app.use('/api', path);



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
