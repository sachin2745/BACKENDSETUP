const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const userRoutes = require('./routes/userRoutes'); 
const utilRouter = require('./routes/util');

const app = express();

app.use(cors());

app.use('/api', userRoutes);
app.use('/util', utilRouter);


// Middleware to parse JSON request bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connection to the database
const connectDB = require("./config/db.js")


// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "static/uploads")));


app.get('/', (req, res) => {
    return res.json("From Backenddd Side");
})



app.listen(8001, () => {
    console.log("Server is running on port 8001");
})