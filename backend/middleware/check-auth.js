// const HttpError = require("../models/http-error");
// const jtw = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         if (!token) {
//             const error = new HttpError('auth failed', 401);
//             return next(error);
//         };
//         const decodedtoken = jwt.verify(token, 'supersecret_dont_share');
//         req.userData = {userId: decodedtoken.userId}
//         next()
//     } catch (err) {console.log(err)}
// };

const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        console.log('hitting')
        console.log(token)
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed! auth middleware', 401);
    return next(error);
  }
};
