const express = require('express');
const app = express();
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const cors = require('cors');
const routesUrls = require('./routes/routes');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_ACCESS,
    ()=>console.log("Database Connected"))
app.listen(4000,()=>console.log("Server is up and running!"));
app.use(body_parser.json());

app.use(body_parser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())
app.use('/app',routesUrls);