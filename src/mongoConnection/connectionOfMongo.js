const mongoClient = require('mongodb').MongoClient;
const mongoUrl = process.env.MONGO_URL
const dbName = 'database1'

// Code to connect Mongodb____________________________

module.exports.connection = (callback) => {
    mongoClient.connect(mongoUrl, (error, client) => {
        if (error) {
            console.log("Unable to connect with Database", error);
            error.status = 500;
            error.message = "Server Down";
            throw error;
        } else {
            const db = client.db(dbName);
            callback(db);
        }
    });
}