const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
console.log(process.env.DB_USER);
app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yuvpr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err);
    const bookCollection = client.db("bookshopdb").collection("books");
    const orderCollection = client.db("bookshopdb").collection("orders");

    app.get('/book', (req, res) => {
        bookCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })

    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        console.log(newBook);
        bookCollection.insertOne(newBook)
            .then(result => {
                console.log("inserted count", result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/bookBy/:id', (req, res) => {
        bookCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, items) => {
                res.send(items);
            })
    })
    app.get('/orders', (req, res) => {
        //console.log(req.query.email);
        orderCollection.find({email: req.query.email})
        .toArray((err, items) => {
            res.send(items);
        })
    })

    app.get('/manageBook' , (req, res) => {
        bookCollection.find({})
        .toArray((err, items) => {
            res.send(items);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order= req.body;
        orderCollection.insertOne(order)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        })
    })
    app.delete('/delete/:id', (req, res) => {
        bookCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            console.log(result)
        })
    })
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})