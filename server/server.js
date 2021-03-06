require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//enable public folder
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, resp) => {
        if (err) throw err;
        else console.log('data base online');
    });

app.listen(process.env.PORT, () => {
    console.log('escuchando puerto:', 3000);
})