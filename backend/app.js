const express = require('express');
const app = express();
var cookieParser = require('cookie-parser')
 
app.use(express.json());
app.use(cookieParser());

const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const errorMiddleware = require('./middlewares/error');

app.use('/api/v1/',products);
app.use('/api/v1/',auth);
app.use('/api/v1/',order);


app.use(errorMiddleware)

module.exports = app;