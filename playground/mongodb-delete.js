const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').deleteMany({
    //     text: 'Something to do'
    // }).then((result) => {
    //     console.log(result);
    // })

    db.collection('Todos').deleteOne({
        completed:false
    }).then((result)=> {
        console.log(result);
    })
    client.close();
});