const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI || 'mongodb://mongo:27017');
const app = express();
app.use(bodyParser.json());

let users;

client.connect().then(() => {
  users = client.db('taskdb').collection('users');
});

app.post('/signup', async (req, res) => {
  const u = req.body;
  await users.insertOne(u);
  res.status(201).json({msg:'ok'});
});

app.listen(3000, '0.0.0.0');
