// Library Management System: Role: Admin, Student, Teacher

// [X] we need to encrypt the password before storing inside the database - decrypt password using a secret key
// [X] make the apis protected - security layer 2
// [] authorise the APIs - data is restricted to every user - jwt token! (json web token) - security layer 3
// [X] error handling / exception handling
// Pagination and filtering at an API level - 40000 posts - NO, 40, 40, 40..... reached rock bottom of the number 40,000
// soft delete and hard delete
// [X] middleware
// file uploading
// validations
// Websockets!

// google and understand the difference between authentication and authorization

const express = require('express'); // npm install express

// import mongoose package - has functions required to perform operations in mongodb starting all the way connecting to the cluser to making changes in the data
const mongoose = require('mongoose'); // npm install mongoose

const app = express();

// middleware
app.use(express.json());

const port = 4000

const mongoUrl = "mongodb+srv://consultingleera:SY1RX8KXb8cwP8Bu@cluster0.frz9sdy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// Connect to MongoDB
mongoose.connect(mongoUrl, {});

// Event listeners for MongoDB connection
mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB successfully");
})

const userRoutes = require('./routes/userRoute')

app.use('/api', userRoutes)

// listen on port 8080 and start my server
app.listen(port, () => {
    console.log("My server has started on the port " + port)
})
