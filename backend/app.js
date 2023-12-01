const express = require('express');
const app = express();
 
app.use(express.json());

const products = require('./routes/product');
const errorMiddleware = require('./middlewares/error');

app.use('/api/v1/',products)

app.use(errorMiddleware)

module.exports = app;