const jwt = require('jsonwebtoken');
const { User } = require('../models/dataSchema');

exports.Auth = async(req, res, next) => {
    try {
        const token = req.cookies.amazon;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ _id: verifyUser._id });
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send('false');
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send({ message: 'Invalid Admin Token' });
    }
};