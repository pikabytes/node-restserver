const e = require('express');
const express = require('express');

let {tokenVerification, adminRoleVerification} = require('../middlewares/authentication');


let app = express();

let Category = require('../models/category');

// show all categories
app.get('/category', tokenVerification, (req, res) => {
  Category.find({})
  .populate('users', 'name email')
  .exec((err, categories) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      categories
    })

  })


});

// show all categories by id
app.get('/category/:id', (req, res) => {
  let id = req.params.id;
  Category.findById(id, (err, categoryDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!categoryDB){
      return res.status(500).json({
        ok: false,
        err: {
          message: 'Id was not found.'
        }
      });
    }

    res.json({
      ok: true,
      category: categoryDB
    });

  });
});

// create new category
app.post('/category', tokenVerification, (req, res) => {
  let body = req.body;

  let category = new Category({
    description: body.description,
    user: req.user._id
  });

  category.save((err, categoryDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if(!categoryDB){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      category: categoryDB
    });


  })



});

// update category
app.put('/category/:id', (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let updateCategory = {
    description: body.description
  }

  Category.findByIdAndUpdate(id, updateCategory, {new: true, runValidators: true}, (err, categoriaDB) =>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      category: categoriaDB
    });


  });
})

// delete category
app.delete('/category/:id', [tokenVerification, adminRoleVerification] , (req, res) => {
  let id = req.params.id;
  Category.findByIdAndRemove(id, (err, categoriaDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Id does not exist'
        }
      })
    }

    res.json({
      ok: true,
      message: 'Category was deleted.'
    })

  })

})

module.exports = app;
