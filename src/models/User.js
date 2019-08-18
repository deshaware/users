const mongoose = require('mongoose');
const validator = require('validator')
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        maxlength : [40,"Too many characters"],
        trim:true
    },
    lastName:{
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
    age:{
        type:Number,
        validate(value){
            if(!validator.isFloat(value) || !validator.isAlphanumeric(value)){
                throw new Error("Invalid Age")
            }
            if(value < 0 && value > 100){
                throw new Error("Invalid Age")
            }
        }
    },
    profession:{
        type:String,
        lowercase:true,
        trim:true
    },
    hobby:{
        type:String,
        lowercase:true,
        trim:true
    },


},{timestamps:true});

// Whenever returning json doc
userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject()
    return userObj
}

module.exports = User = mongoose.model('User',userSchema);