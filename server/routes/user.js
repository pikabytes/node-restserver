const express = require('express');
const bcryp = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');

const app = express();
const bodyParser = require('body-parser');
const { constant } = require('underscore');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());


app.get('/user', function (req, res) {
  let from = Number(req.query.from) || 0;
  let limit = Number(req.query.limit) || 5;
  let status = {status: true}
  User.find(status, 'name email status google role')
    .skip(from)
    .limit(limit)
    .exec( (err, users) => {
      if(err){
        return res.status(400).json({
          ok: false,
          err
        })
      }else{
        User.count(status,(err, count)=>{
          res.json({
            ok: true,
            total: count,
            users
          });
        });
      }
    })


});

app.post('/user', function (req, res) {
  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcryp.hashSync(body.password, 10),
    role: body.role
  });

  user.save( (error, userdb) => {
    if(error){
      res.status(400).json({
        ok: false,
        error
      });
    } else {
      // userdb.password = null;

      res.json({
        ok: true,
        user: userdb
      });
    }
  });
});

app.put('/user/:id', function (req, res) {
  let id  = req.params.id;
  let body = _.pick(req.body, ['name','email','img','role','status'] );

  User.findByIdAndUpdate(id, body,{new: true, runValidators: true}, (err, userdb) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    } else {
      res.json({
        ok: true,
        user: userdb
      });
    }
  });
  
});

app.delete('/user/:id', function (req, res) {
  let id = req.params.id;

  let changeStatus = {status: false};
  User.findByIdAndUpdate(id, changeStatus,{new: true}, (err, userRemoved) =>{
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }
    if(!userRemoved){
      return res.status(400).json({
        ok: false,
        err:{
          message: 'User not found.'
        }
      });
    }
    res.json({
      ok: true,
      user: userRemoved
    });
    
  })

});


module.exports = app;