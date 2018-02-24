const {SHA256} = require('crypto-js');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123434';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) =>{
        console.log(hash);
    })
});

var hashedPassword = '$2a$10$uUW3Uv0Tv8gh87E5QfRBeeYRvOr1qVj9UGhxN8BgzaQsE9Ype6sgm';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
})

// var data = {
//     id:10
// };

// var token = jwt.sign(data, 'secret');

// console.log(token);

// var decoded = jwt.verify(token, 'secret');
// console.log(decoded);


// var msg = 'I am a user number 3';
// var hash = SHA256(msg).toString();

// console.log(`Message: ${msg}`);
// console.log(`Hash of msg ${hash}`);

// var data ={
//     id:4
// };

// var token ={
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secretWord').toString()
// }


// var resultHash = SHA256(JSON.stringify(token.data)+'secretWord').toString();

// if (resultHash == token.hash){
//     console.log('the real deal');
// } else {
//     console.log('counterfeit');
// }