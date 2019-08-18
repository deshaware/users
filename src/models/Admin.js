const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../config/keys').secret;
const validator = require('validator');


const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength : [40,"Too many characters"],
        trim:true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    password:{
        type:String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
},{timestamps:true});

// Whenever returning json doc
adminSchema.methods.toJSON = function () {
    const admin = this;
    const adminObj = admin.toObject()
    delete adminObj.password
    delete adminObj.tokens
    return adminObj
}


adminSchema.methods.generateAuthToken = async function(){
    const admin = this;
    const token = await jwt.sign({_id:admin._id.toString()},secret);
    admin.tokens = admin.tokens.concat({token});
    await admin.save()
    return token
}

// Hash the plain text password before saving
adminSchema.pre('save', async function (next){
    const admin = this;
    const emailCount = await mongoose.models.Admin.countDocuments({email: admin.email  });
    if(emailCount>1)
        throw new Error(`Admin with email ${admin.email} already exist`)
    if(admin.isModified("password")){
        admin.password = await bcrypt.hash(admin.password,8);
    }
});

// for login purpose only, auth can't do stuff, hence static method
adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email })
    if (!admin) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return admin
}

// // unique does not work, hence working on 
// adminSchema.path('email').validate( async (value,done) => {
//     const emailCount = await mongoose.models.User.countDocuments({email: value });
//     console.log(emailCount)
//     return !emailCount;
//   }, 'Email already exists');


module.exports = User = mongoose.model('Admin',adminSchema);