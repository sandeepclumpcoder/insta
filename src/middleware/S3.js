const AWS = require('aws-sdk');

class S3 {
    constructor() { }

    uploadFile = (file) => {
        return new Promise(async (resolve, reject) => {
            let s3bucket = new AWS.S3({
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRETACCESS_KEY,
                Bucket: process.env.S3_BUCKET_NAME
            });
            s3bucket.createBucket(function () {
                var params = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    ACL: 'public-read',
                    Key: 'image container/'+file.name,
                    Body: file.data
                };
                s3bucket.upload(params, function (err, data) {
                    if (data) {
                        resolve(data.Location);
                    } else {
                        reject(err)
                    }
                });
            });
        });
    }
};

module.exports = new S3();