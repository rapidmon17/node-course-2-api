const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require:true,
        minlength:4,
        trim:true,
        unique:true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email address'
        }

    },
    password: {
        type: String,
        minlength:6,
        required:true
    },
    tokens: [{
        access:{
            type: String,
            required:true
        },
        token:{
            type: String,
            required:true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

    user.tokens = user.tokens.concat({access, token});

    return user.save().then(() => {
        return token;
    })
};
var userModel = mongoose.model('User', UserSchema);

module.exports={userModel};