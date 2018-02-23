var mongoose = require('mongoose');

var userModel = mongoose.model('User', {
    email: {
        type: String,
        require:true,
        minlength:4,
        trim:true
    },
    password: {
        type: String,
        minlength:6,
        required:true
    }
});

module.exports={userModel};