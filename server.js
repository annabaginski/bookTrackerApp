// DECLARE ALL VARIABLES AND REQUIRE MODULES

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { response } = require('express');

// SET UP DATABASE CONNECTION

const MongoClient = require('mongodb').MongoClient;
const PORT = 8000;
require('dotenv').config();

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'BookList'

MongoClient.connect(dbConnectionStr, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName);
    })
    .catch(err => {
        console.log(err);
    })

// SET UP MIDDLEWARE

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());

//GETS

app.get('/', async (req,res) => {

    const booksList = await db.collection('booksAdded').find().toArray();

    res.render('index.ejs', {
        books: booksList
    });
})

//POST

app.post('/', function(req,res) {
    db.collection('booksAdded').insertOne({title: req.body.bookTitle, author: req.body.bookAuthor})
    .then(result => {
        console.log('Book Added')
        res.redirect('/')
    })
    .catch(error => console.error(error))
})

//UPDATE TO BOOK COMPLETED

app.put('/completed', function(req,res) {
    db.collection('booksAdded').updateOne({title: req.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// DELETE

app.delete('/deleteBook', (req,res) => {
    console.log(req.body.itemFromJS);
    db.collection('booksAdded').deleteOne({
        'title': req.body.itemFromJS })
    .then(result => {
        console.log('Book Deleted')
        res.json('Book Deleted')
    })
    .catch(error => console.error(error))
})









//Server Connection

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// process.env.PORT ||