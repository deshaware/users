const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const secret = require('../config/keys').secret;
const _ = require('lodash');

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if(!token) throw new Error("Admin not authenticated")
        const decode = jwt.verify(token,secret);
        const admin = await Admin.findOne({_id: decode._id, 'tokens.token':token })
        if(!admin){
            throw new Error("Unauthorized")
        }
        req.token = token
        req.admin = admin
        next()
    } catch (error) {
        res.status(401).send({error:error.message})
    }
};
module.exports = auth;