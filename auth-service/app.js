const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const client = require('prom-client');
const mongoclient = new MongoClient(process.env.MONGO_URI || 'mongodb://mongo:27017');
const app = express();
app.use(bodyParser.json());

let users;

mongoclient.connect().then(() => {
  users = mongoclient.db('taskdb').collection('users');
});
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.post('/signup', async (req, res) => {
  const u = req.body;
  await users.insertOne(u);
  res.status(201).json({msg:'ok'});
});

app.listen(3000, '0.0.0.0');
