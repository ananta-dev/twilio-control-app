const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

app.use(cors());
app.use(bodyParser.json());
dotenv.config();

const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const PORT = process.env.PORT || 3001;

let db;

// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri = process.env.CONNECTION_URL;
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverApi: ServerApiVersion.v1,
// });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object

//     client.close();
// });

MongoClient.connect(
    process.env.CONNECTION_URL,
    { useUnifiedTopology: true },
    async (err, client) => {
        if (err) throw err;

        db = client.db("todos");

        // await db.collection("todos").deleteMany();

        // await db.collection("todos").insertMany([
        //     { done: true, desc: "write code" },
        //     { done: true, desc: "fix bug" },
        //     { done: false, desc: "profit" },
        // ]);
    }
);

app.get("/", (req, res) => {
    // res.json({ test: "Did this work?" });
    res.send(`Hello to Twilio Control API.
            Server Running on port: ${PORT}.`);
});

app.get("/todos", async (req, res) => {
    const todos = await db.collection("todos").find().toArray();
    res.json(todos);
});

app.post("/todos", async (req, res) => {
    await db.collection("todos").insertOne(req.body);
    res.json("posted");
});

app.delete("/todos/:id", async (req, res) => {
    await db.collection("todos").deleteOne({ _id: ObjectId(req.params.id) });
    res.json("deleted");
});

app.put("/todos/:id", async (req, res) => {
    await db
        .collection("todos")
        .replaceOne({ _id: ObjectId(req.params.id) }, req.body);
    res.json("Put / Updated");
});

app.listen(process.env.PORT, () => {
    console.log(`Server Running on port: ${PORT}`);
});
