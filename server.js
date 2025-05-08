
require('dotenv').config();

require('./helpers/notificationScheduler');

const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const logger=require('morgan')
const path = require('path');

// Importing routers
const routers = require('./app/v1/routers/index');



// database connection setup

const {connectToDatabase}=require('./config/database')

// initial the express app
const app=express()


// connect to database

connectToDatabase();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS setup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Routes setup
app.use('/api/v1', routers);


// Test route
app.get('/api/v1/test', (req, res) => {
    res.send('I am responding!');
  });

  app.use(function(req, res, next) {
    next(res.status(404).json("your request method is wrong"));
});

// Error handler
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error'
    });
  });

  

  module.exports=app