const express = require('express');
const app = express();
 
app.use(express.json());

const products = require('./routes/product');
const auth = require('./routes/auth');
const errorMiddleware = require('./middlewares/error');

app.use('/api/v1/',products);
app.use('/api/v1/',auth);

app.use(errorMiddleware)

module.exports = app;