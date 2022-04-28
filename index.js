const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const app = express()
const port = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7rdtd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    await client.connect()
    const usersCollection = client.db('foodExpress').collection('users')

    app.get('/user', async (req, res) => {
      const query = {}
      const cursor = usersCollection.find(query)
      const users = await cursor.toArray()
      res.send(users)
    })

    app.get('/user/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await usersCollection.findOne(query)
      res.send(result)
    })

    app.post('/user', async (req, res) => {
      console.log('Request', req.body)
      const newUser = req.body
      const result = await usersCollection.insertOne(newUser)
      res.send(result)
    })

    app.put('/user/:id', async (req, res) => {
      const id = req.params.id
      const updatedUser = req.body
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updatedDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      }
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      )
      res.send(result)
    })

    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })
  } finally {
    // await client.close()
  }
}

run().catch(console.dir)

app.listen(port, () => {
  console.log('Listening on post', port)
})
