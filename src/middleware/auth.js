const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const secret = require('../config/keys').secret;
const _ = require('lodash');

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if(!token) throw new Error("Admin not authenticated")
        const decode = jwt.verify(token,secret);
        const Admin = await Admin.findOne({_id: decode._id, 'tokens.token':token })
        if(!Admin){
            throw new Error("Unauthorized")
        }
        req.token = token
        req.Admin = Admin
        next()
    } catch (error) {
        res.status(401).send({error:error.message})
    }
};
module.exports = auth;