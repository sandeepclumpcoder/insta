const dbConnection = require('../mongoConnection/connectionOfMongo');

// Create otp collection___________________________

module.exports.createOtp = (data) => {
    return new Promise(async (resolve, reject) => {
        let db = await dbConnection.connection();
        db.collection('otp1').insertOne(data , (err, result) => {
            if (err) {
                let errorInfo = {
                    err: err,
                    message: "DB query error"
                }
                reject(errorInfo);
            } else {
                resolve(result);
            }
        });
    })
}

// Get User by otp___________________________

module.exports.checkValidOtp = (otp) => {
    return new Promise(async (resolve, reject) => {
        let db = await dbConnection.connection();
        db.collection('otp1').findOne({code:otp},(err, result) => {
            if (err) {
                let errorInfo = {
                    err: err,
                    message: "DB query error"
                }
                console.log("err",err);
                reject(errorInfo);
            } else {
                resolve(result);
                console.log("result");
            }
        });
    })
}