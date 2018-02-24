const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

//User object schema
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

//Mongoose middleware to salt password before a user is added
UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

//Method to override JSON object we send back
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

//Generating the token for a new user
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

    user.tokens = user.tokens.concat({access, token});

    return user.save().then(() => {
        return token;
    });
};

//Deleting the token from a user
UserSchema.methods.removeToken = function (token) {
    var user = this;
    
    return user.update({
        $pull: {
            tokens: {token}
        }
    })
}

//Static method to find a user by Token
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token,'abc123');

    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();}); //Longer version
        return Promise.reject();
        
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
};

//Static method to find user by credentials
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve, reject) =>{
            bcrypt.compare(password, user.password, (err, res)=>{
                if(res){
                    resolve(user);
                } else {
                    reject();
                }
            })
        })
    })
};

//mapping User object to userModel
var User = mongoose.model('User', UserSchema);

module.exports={User};