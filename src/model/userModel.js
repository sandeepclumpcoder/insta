const dbConnection = require('../mongoConnection/connectionOfMongo');

//check valid User_____________________________

module.exports.checkEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        await dbConnection.connection(function (db) {
            db.collection('users1').findOne({ email }, (err, result) => {
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
        });
    })
}

// Insert Users Data______________________________

module.exports.createUser = (userData) => {
    return new Promise(async (resolve, reject) => {
        await dbConnection.connection(function (db) {
            db.collection('users1').insertOne(userData, (err, result) => {
                if (err) {
                    let errorInfo = {
                        err: err,
                        message: "DB query error"
                    }
                    reject(errorInfo);
                } else {
                    resolve(true);
                }
            });
        })
    })
}

// Get user by email  ______________________________________

module.exports.getUserByEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        await dbConnection.connection(function (db) {
            db.collection('users1').findOne({ email: userEmail }, (error, result) => {
                if (error) {
                    let response = {
                        error: error,
                        message: 'db query error'
                    };
                    reject(response);
                } else {
                    resolve(result);
                }
            });
        });
    });
}

// Search User By Name_____________________________________

module.exports.searchUser = (regex) => {
    return new Promise(async (resolve, reject) => {
        await dbConnection.connection(function (db) {
            db.collection('users1').find({ name: regex }).toArray((error, result) => {
                if (error) {
                    let response = {
                        error: error,
                        message: 'db query error'
                    };
                    reject(response);
                } else {
                    resolve(result);
                }
            });
        });
    });
}

// Reset password by id__________________________________

module.exports.updatePasswordById = (userId, password) => {
    return new Promise(async (resolve, reject) => {
        await dbConnection.connection(function (db) {
            db.collection('users1').updateOne({ "_id": userId }, { $set: { password: password } }, (error, result) => {
                if (error) {
                    let response = {
                        error: error,
                        message: 'db query error'
                    };
                    console.log("error", error)
                    reject(response);
                } else {
                    resolve(result);
                    console.log("result", result)
                }
            });
        });
    });
}
