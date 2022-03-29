const jwt = require('jsonwebtoken');

// middle ware for user authentication

module.exports.validateToken = (req , res , next)=>{
    try {
        const token = req.header('authorization');
        const tokenArray = token.split(' ');
        const finalToken = tokenArray[1];
        const decodeToken = jwt.verify(finalToken ,'secret');
        req.userInfo = decodeToken;
        req.token = finalToken
        next();
    } catch (error) {
        res.json({
            status: 401,
            message : "invalid Token"
        });
    }
}
