const express = require('express');
require('dotenv').config()
const app = express();
const cors=require('cors');
const port= process.env.PORT || 5000;   

// middleware

app.use(
  cors({
    origin: ["http://localhost:5173", "https://picklestaste.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());


const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI

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


    // Get the database and collection on which to run the operation
    const picklesCollection=client.db("picklestasteDb").collection("allpickles");
    const reviewsCollection=client.db("picklestasteDb").collection("reviews");
    const usersCollection=client.db("picklestasteDb").collection("allUsers");
    const ordersCollection=client.db("picklestasteDb").collection("allOrders");
    const cartsCollection=client.db("picklestasteDb").collection("allCarts");

    // Data Collection 
    app.get('/pickles',async(req,res)=>{
      const allPickles=await picklesCollection.find().toArray();
      res.json(allPickles)
    })

    // Reviews Collection
    app.get('/reviews',async(req,res)=>{
      const allReviews=await reviewsCollection.find().toArray();
      res.json(allReviews)
    })

    // Carts Collection
    app.get('/carts',async(req,res)=>{
      const email =req.query.email;
      const query={userEmail:email}
      const allCarts=await cartsCollection.find(query).toArray();
      res.json(allCarts)
    })

    app.post('/carts',async(req,res)=>{
      const newCart=req.body;
      const result = await cartsCollection.insertOne(newCart);
      res.send(result)
    })

    app.delete('/carts/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await cartsCollection.deleteOne(query);
      res.send(result)
    })

    // Orders Collection 
    app.get('/orders',async(req,res)=>{
      const email =req.query.email;
      const query={userEmail:email}
      const allOrders=await ordersCollection.find(query).toArray();
      res.json(allOrders)
    })

    app.post('/orders',async(req,res)=>{
      const newOrder=req.body;
      const result = await ordersCollection.insertOne(newOrder);
      res.send(result)
    })
    
    // Users Collection
    app.get('/users',async(req,res)=>{
      const allUsers=await usersCollection.find().toArray();
      res.json(allUsers)
    })
    app.post('/users',async(req,res)=>{
      const newUser=req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Pickles Taste Server is Running')
})

app.listen(port,()=>{
    console.log(
        `Server is running on port ${port}`
    );
})
