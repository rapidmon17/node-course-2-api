const _ = require('lodash');

const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

//dynamically obtain port number in case of local vs heroku
const port = process.env.PORT || 3000;

//Parser for JSON (middleware)
app.use(bodyParser.json());

//Endpoint to return current user, using authenticate middleware
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


// //Endpoint to return current user
// app.get('/users/me', (req, res) => {
//     var token = req.header('x-auth');

//     User.findByToken(token).then((user) => {
//         if(!user) {
//             return Promise.reject();
//         }
//         res.send(user);
//     }).catch((e) => {
//         res.status(401).send();
//     });
// });

//Endpoint to create new Todo object
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    console.log(req.body);

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
})

//Endpoint to login a user
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then(user =>{
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((e) => {
        res.status(400).send();
    })
})

//Endpoint to logout a user
app.delete('/users/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

//Endpoint to create a new user object.
app.post('/user', (req, res) => {
    var body = _.pick(req.body,['email', 'password']);
    var user = new User(body);
    console.log(JSON.stringify(user));

    user.save().then(() => {
       return user.generateAuthToken();
        
    }).then((token) => {
        console.log(`this is the token ${token}`);
        res.header('x-auth',token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
})

//Endpoint to get the list of Todos
app.get('/todos', (req, res) =>{
    Todo.find().then((todos) => {
        res.send({todos})
    }, (e) => {
        res.status(400).send(e);
    })
})

//Endpoint to delete a Todo Object
app.delete('/todos', (req, res) =>{
    Todo.remove().then((result) => {
        if(result.n == 0)
            res.send("No object to delete");
        else {
            res.send("Object deleted");
        }
    }, (e) =>{
        res.status(400).send(e);
    });
});

//Endpoint to update a specific Todo object
app.patch('/todos/:id', (req, res)=> {
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {
        $set: body
    },
    {
        new:true
    }
    ).then((todo)=>{
        if(!todo){
            return res.status(404).send();
    }
    res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});


//Server listening for requests on port
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};