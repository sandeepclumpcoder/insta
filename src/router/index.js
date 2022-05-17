const express = require('express');
const app = express();
const UserController = require('../controller/UserController');
const { body, validationResult } = require('express-validator');
const fatchUser = require("../middleware/verifyUser");

// Sign Up Page For Create User

app.post('/signup', [
    body("email", "Please Enter a valid Email").isEmail(),
    body("name", "Please Enter a valid Name").isLength({ min: 3 }),
    body("mobile", "Please Enter a valid Number").isLength({
        min: 10,
        max: 10,
    }),
    body("password", "Password must be atleast 5 characters").isLength({
        min: 5,
    }),
], UserController.createUser);

// users login API

app.post('/login', [
    body("email", "Please enter valid email id").isEmail(),
    body("password", "Password Can Not be Blank").exists()
], UserController.usersLogin);


app.get('/search/:name', UserController.searchByName);

app.post('/forget-password', UserController.forgetPassword);

app.post('/otp-verification', UserController.otpVerification);

app.post('/reset-password', fatchUser, [
    body("password", "password minimun length is 4 character").isLength({
        min: 4
    })
], UserController.resetPassword);

// app.post('/user-bio' , UserController.addBio);

module.exports = app;