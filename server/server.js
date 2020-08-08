
require('./config/config');

const express = require('express')
const bodyParser = require('body-parser');

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())



 
app.get('/user', function (req, res) {
  res.json('get users')
});

app.post('/user', function (req, res) {
  let body = req.body;
  if(body.name === undefined){
    res.status(400).json({
      ok: false,
      message: 'name is required'
    })
  }else {
    res.json({
      body
    });
  }
});

app.put('/user/:id', function (req, res) {
  let id  = req.params.id;
  res.json({
    id: id
  })
});

app.delete('/user', function (req, res) {
  res.json('delete users')
});
 
app.listen(process.env.PORT, () => {
  console.log('escuchando puerto:', 3000);
})