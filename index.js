const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


//  middleware 
app.use(cors())
app.use(express.json())





// coffeeStore
// evEQgUk9XNrcfInX


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ms-creator.yqb9vtj.mongodb.net/?retryWrites=true&w=majority&appName=ms-creator`;
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollection = client.db('coffeeCollection').collection('coffee')

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();

            const result = await cursor.toArray();
            // console.log(result);
            res.send(result)
        })

        app.post('/coffee', async (req, res) => {
            const body = req.body;
            console.log(body);
            const result = await coffeeCollection.insertOne(body)
            res.send(result)
        })
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateCoffee = req.body;
            const Coffee = {
                $set: {
                    name: updateCoffee.name,
                    supplier: updateCoffee.supplier,
                    taste: updateCoffee.taste,
                    category: updateCoffee.category,
                    details: updateCoffee.details,
                    photo: updateCoffee.photo,
                    chef: updateCoffee.chef
                }
            }
            const result = await coffeeCollection.updateOne(filter,Coffee,options)
            res.send(result)
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Coffee server create now')
})

app.listen(port, () => {
    console.log('Coffee server create port', port);
})