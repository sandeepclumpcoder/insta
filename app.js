const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const joi = require('joi');
const jwt = require('jsonwebtoken');

const joiValidation = require('./src/joiValidator/validation');
const dbConnection = require('./src/mongoConnection/connectionOfMongo');
const userVerify = require('./src/middleware/verifyUser');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ALL User List

app.get('/api/v1/signup', async (req, res) => {
    try {
        let db = await dbConnection.connection();
        db.collection('users').find({}).toArray((err, result) => {
            if (err) {
                let errorInfo = {
                    err: err,
                    message: "DB query error"
                }
                throw errorInfo;
            } else {
                let response = {
                    Alluser: result,
                }
                res.statusCode = 200;
                res.json(response);
            }
        });
    } catch (error) {
        console.log(error, "sign up error");
    }
});


// Sign Up Page For Create User

app.post('/api/v1/signup',userVerify.validateToken,async (req, res) => {
    try {
        const schema = joi.object({
            fullName: joi.string().required(),
            email: joi.string().email().required(),
            mobile: joi.number().required(),
            password: joi.string().min(4).max(8).required()
        });
        await joiValidation.validationBodyReq(schema, req.body);
        const userData = {
            fullName: req.body.fullName,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password
        }
        let db = await dbConnection.connection();
        db.collection('users').insertOne(userData, (err, result) => {
            if (err) {
                let errorInfo = {
                    err: err,
                    message: "DB query error"
                }
                throw errorInfo;
            } else {
                let response = {
                    message: "successFullly created",
                    statusCode: 201
                }
                res.statusCode = 201;
                res.json(response);
            }
        });
    } catch (error) {
        console.log('sign up post error', error);
    }
});


app.get('/api/v1/login',(req, res) => {
    res.send('hello');
});

// users login API

app.post('/api/v1/login',async (req, res) => {
    try {
        const schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(4).max(8).required()
        });
        await joiValidation.validationBodyReq(schema, req.body);
        const userEmail = req.body.email;
        const password = req.body.password;
        let db = await dbConnection.connection();
        db.collection('users').findOne({ email: userEmail, password: password }, (error, user) => {
            if (error) {
                let response = {
                    error: error,
                    message: 'db query error'
                };
                throw response;
            } else {
                if (user) {
                    const token = jwt.sign(
                        {
                            email: user.email,
                            userId: user._id,
                        },
                        "secret",
                        {
                            expiresIn: "2h"
                        }
                    );
                    res.statusCode = 400;
                    let response = {
                        token: token,
                        user
                    };
                    res.json(response);
                } else {
                    res.statusCode = 400;
                    let response = {
                        message: "invalid credentials"
                    };
                    res.json(response);
                }
            }
        });
    } catch (error) {
        console.log('users login error', error);
    }
});

// For server starting

const port = 5000;

app.listen(port, () => {
    console.log('server started at', port);
});