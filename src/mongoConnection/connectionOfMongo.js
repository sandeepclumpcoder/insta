const mongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://127.0.0.1:27017/'

const dbName = 'database1'

// Code to connect Mongodb____________________________

module.exports.connection = () => {
    return new Promise((resolve, reject) => {
        mongoClient.connect(mongoUrl, (error, client) => {
            if (error) {
                let response = {
                    error: error,
                    message: "DB connection error"
                }
                console.log("error",error);
                reject(response)
            } else {
                let db = client.db(dbName);
                resolve(db);
            }
        });
    });
}