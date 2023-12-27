const express = require('express')
const router = express.Router()
const passport = require('passport');

const {createBudget,updateBudget ,getBudget,createExpense,editExpense,deleteExpense,calculateTotalExpense,getExpense} = require('../controllers/Expense')
const {signup , login,forgotpassword ,resetpassword,sendmessage} = require('../controllers/Auth')
// const {fileupload} = require('../controllers/fileUpload')
const mailsender = require('../controllers/mailsender')
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google authentication callback route
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin' }),
  (req, res) => {
    // Successful authentication, redirect or respond as needed
    res.redirect('/dashboard');
  }
);

// router.post("/createCategory" , createCategory)
// router.get("/getCategory" , getCategory)
// router.delete("/deleteCategory/:id" ,deleteCategory)
router.delete("/deleteExpense/:id" ,deleteExpense)
router.post("/createBudget" ,createBudget)
router.post("/createExpense" ,createExpense)
router.put("/updateBudget/:id" ,updateBudget)
router.put("/editExpense/:id" ,editExpense)
router.get("/getExpense" ,getExpense)
router.get("/getBudget" ,getBudget)
router.post("/signup", signup)
router.post("/login", login)
router.post("/forgotpassword/:token", forgotpassword)
router.post('/resetpassword/:id/:token', resetpassword);
// router.post('/imageUpload' , fileupload)
router.post('/mailsender' , mailsender)
router.post('/calculateTotalExpense' , calculateTotalExpense)
router.post('/sendmessage' , sendmessage)

module.exports = router