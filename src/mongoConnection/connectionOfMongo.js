const mongoClient = require('mongodb').MongoClient;
const mongourl = 'mongodb://127.0.0.1:27017/'

const dbName = 'database1'

// Code to connect Mongodb____________________________

module.exports.connection = async () => {
    return new Promise((resolve, reject) => {
        mongoClient.connect(mongourl, (error, client) => {
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