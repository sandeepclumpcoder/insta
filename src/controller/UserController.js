require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const userModel = require("../model/userModel");
const otpModel = require("../model/otpModel");
const mongo = require("mongodb");
const { body, validationResult } = require('express-validator');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const JWT_SECRET = process.env.SECRET_KEY;
const saltRounds = 10;


class UserController {

    constructor() { }

    // Sign Up By User API___________________________ 

    createUser = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.statusCode = 400;
            return res.json({ errors: errors.array() });
        }
        try {
            const email = req.body.email;
            let user = await userModel.checkEmail(email);
            if (user) {
                res.statusCode = 400
                res.json({
                    error:
                        "Sorry a user with same credentials already exist. please try with an unique credentials",
                });
            } else {
                // password encryption

                const salt = bcrypt.genSaltSync(saltRounds);
                const securePass = bcrypt.hashSync(req.body.password, salt);
                const userData = {
                    name: req.body.name,
                    mobile: req.body.mobile,
                    email: req.body.email,
                    password: securePass,
                }
                await userModel.createUser(userData)

                // Code to create otp

                let otpCode = Math.floor(1000 + Math.random() * 9000);
                let otpData = {
                    email: req.body.email,
                    code: otpCode,
                    expireIn: new Date().getTime() + 300 * 1000,
                };
                // Code To send Otp to Mobile

                client.messages
                    .create({
                        body:
                            "Hey " +
                            userData.name +
                            "," +
                            " Your Otp for Verification is " +
                            otpCode,
                        from: "+17312062213",
                        to: "+91" + userData.mobile,
                    })
                    .then((message) => console.log(message.sid));

                await otpModel.createOtp(otpData);
                res.statusCode = 200;
                res.json({
                    message: "Otp sent to your mobile number ",
                    mobile: userData.mobile,
                });
            }
        } catch (error) {
            res.status(500).send("Internal Server Error:" + error.message);
        }
    }

    // User Login API____________________________

    usersLogin = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                })
            }
            const email = req.body.email;
            const password = req.body.password;
            let user = await userModel.getUserByEmail(email);
            if (!user) {
                res.statusCode = 400;
                res.json({ message: "please try to login with correct credentials" })
            } else {
                const comparePass = await bcrypt.compare(password, user.password);
                if (!comparePass) {
                    res.statusCode = 400;
                    res.json({ error: "Please Enter Valid Password" });
                } else {
                    let data = {
                        user: {
                            id: user.id
                        }
                    }
                    const token = jwt.sign(data, JWT_SECRET);
                    res.statusCode = 200;
                    res.json({ token, message: "SuccessFully Logged In" });
                }
            }
        } catch (error) {
            console.log('users login error', error);
            res.status(500).send("Internal Server Error:" + error.message);
        }
    }

    // Search User By Name____________________________

    searchByName = async (req, res) => {
        try {
            const regex = new RegExp(req.params.name, 'i');
            let result = await userModel.searchUser(regex);
            if (result && result.length > 0) {
                let response = {
                    result: result
                }
                res.statusCode = 200;
                res.json(response);
            } else {
                let errInfo = {
                    message: "Data not found"
                }
                res.statusCode = 400;
                res.json(errInfo);
            }
        } catch (error) {
            console.log("error", error);
            res.status(500).send("Internal Server Error:" + error.message);
        }
    }

    // Forget-Password API________________________________

    forgetPassword = async (req, res) => {
        try {
            const email = req.body.email;
            let userData = await userModel.checkEmail(email);
            if (!userData) {
                res.statusCode = 400;
                res.json({
                    error: "Please Enter Valid email ID"
                });
            } else {
                // Code to create otp

                let otpCode = Math.floor(1000 + Math.random() * 9000);
                let otpData = {
                    email: req.body.email,
                    code: otpCode,
                    expireIn: new Date().getTime() + 900 * 1000,
                };
                // Code To send Otp to Mobile
                client.messages
                    .create({
                        body:
                            "Hey " +
                            userData.name +
                            "," +
                            " Your Otp for Verification is " +
                            otpCode,
                        from: "+17312062213",
                        to: "+91" + userData.mobile,
                    })
                    .then((message) => console.log(message.sid));
                await otpModel.createOtp(otpData);
                res.statusCode = 200;
                res.json({
                    message: "Otp sent to your mobile number ",
                    mobile: userData.mobile,
                });
            }
        } catch (error) {
            console.log("error", error);
            res.status(500).send("Internal Server Error:" + error.message);
        }
    }

    // Otp verification API___________________________

    otpVerification = async (req, res) => {
        try {
            const code = req.body.code;
            let otp = await otpModel.checkValidOtp(code);
            console.log("otp", otp);
            if (!otp) {
                res.statusCode = 400;
                res.json({ error: "Invalid otp" })
            } else {
                let currentTime = new Date().getTime();
                let diff = parseInt(otp.expireIn) - parseInt(currentTime);
                if (diff < 0) {
                    res.statusCode = 400;
                    res.json({
                        error: "Otp expired"
                    });
                } else {
                    const email = otp.email;
                    let user = await userModel.getUserByEmail(email);
                    console.log("user", user);
                    const data = {
                        user: {
                            id: user._id,
                        },
                    };
                    console.log("data", data);
                    let authToken = jwt.sign(data, JWT_SECRET, { expiresIn: "2h" });
                    res.json({
                        success: "true",
                        authToken
                    })
                }
            }
        } catch (error) {
            console.log("otp verification error");
            res.status(500).send("Internal Server Error:" + error.message);
        }
    }

    // Reset-password API_____________________________

    resetPassword = async (req, res) => {
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.statusCode = 400;
                res.json({ errors: errors.array() });
            }

            // Password encryption by bcryptjs

            const salt = bcrypt.genSaltSync(saltRounds);
            const securePass = bcrypt.hashSync(req.body.password, salt);
            let password = securePass;
            let userId = req.user.id;
            userId = mongo.ObjectId(userId);
            await userModel.updatePasswordById(userId, password);
            res.json({ success: true, message: "Password Changed Sucessfully" });
        } catch (error) {
            console.log("reset-password", error);
            res.status(500).send("Internal Server Error:" + error.message);
        }
    }

}

module.exports = new UserController();