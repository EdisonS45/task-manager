require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const client = require('prom-client');

const app = express();
app.use(bodyParser.json());

const mongoClient = new MongoClient(process.env.MONGO_URI || 'mongodb://mongo:27017');
let users;

mongoClient.connect()
  .then(() => {
    users = mongoClient.db('taskdb').collection('users');
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error(' MongoDB Connection Error:', err));


const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const signupCounter = new client.Counter({
  name: 'http_requests_signup_total',
  help: 'Total number of /signup requests received',
});

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests received',
  labelNames: ['method', 'route', 'status'],
});

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });
  });
  next();
});


app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.post('/signup', async (req, res) => {
  try {
    const user = req.body;
    await users.insertOne(user);
    signupCounter.inc(); 
    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    console.error(' Error in /signup:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Auth Service Running 🚀' });
});

app.listen(3000, '0.0.0.0', () => {
  console.log(' Auth Service running on port 3000');
});
