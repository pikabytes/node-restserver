require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(require('./routes/user'));



mongoose.connect(process.env.URLDB,
  {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true}, 
  (err, resp) =>{
    if( err ) throw err;
    else console.log('data base online');
});
 
app.listen(process.env.PORT, () => {
  console.log('escuchando puerto:', 3000);
})