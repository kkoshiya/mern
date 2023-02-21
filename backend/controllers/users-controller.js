const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');


const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch(err) {
        const error = new HttpError(
            err, 500
        );
        return next(error);
    }

    res.json({users: users.map(user => user.toObject({getters:true}))});
};

const signup = async (req, res, next) => {    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return next(
           new HttpError('invalid inputs, check data'+ errors, 422)
       ); 
    }
    const {name, email, password, image} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email})
    } catch(err) {
        const error = new HttpError(
            'Sign up failed, please try again', 500
        );
        return next(error);
    };

    if (existingUser) {
        const error = new HttpError(
            'User exists already', 422
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        console.log(err);
    }

    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            err,
            500
        );
        return next(error)
    };

    let token; 
    try {
        token = jwt.sign(
            {userId:createdUser.id, email: createdUser.email}, 
            'supersecret_dont_share', 
            {expiresIn: '1hr'}
        );
    } catch(err) {console.log(err)}

    res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token});
};


const login = async (req, res, next) => {

    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email})
    } catch(err) {
        const error = new HttpError(
            'Log in failed, please try again', 500
        );
        return next(error);
    };

    if (!existingUser) {
        const error = new HttpError(
            'Invalid credentials', 401
        );
        return next(error);
    };

    let isValidPassword; 
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch(err){console.log(err)};

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid Creds', 401
        );
        return next(error);
    }

    let token; 
    try {
        token = jwt.sign(
            {userId:existingUser.id, email: existingUser.email}, 
            'supersecret_dont_share', 
            {expiresIn: '1hr'}
        );
    } catch(err) {console.log(err)}

    res.json({userId: existingUser.id, email: existingUser.email, token: token});

};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;