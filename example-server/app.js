const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const River = require('./models/river')
const bodyParser = require('body-parser')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require('./routes');
routes(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })