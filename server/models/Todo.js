
var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
    text: {
        type: String,
        required:true,
        minlength:2,
        trim:true
    },
        completed: {
            type: Boolean
        },
        completedAt: {
            type: Number
        }
});

module.exports ={
    Todo
}
