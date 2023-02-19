const { validationResult } = require('express-validator');



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

    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password,
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
    }

    res.status(201).json({user: createdUser.toObject({getters:true})});
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

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Invalid credentials', 401
        );
        return next(error);
    }

    res.json({message: 'logged in!', user: existingUser.toObject({getters:true})})

};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;