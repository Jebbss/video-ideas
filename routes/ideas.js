const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const {ensureAuthenticated} = require('../helpers/auth')


// load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//add an idea route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

//edit ideas
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id:req.params.id
  })
  .then(idea => {
      if(idea.user != req.user.id) {
        req.flash('error_msg', 'Not authorized');
        res.redirect('/ideas');
      } else {
        res.render('ideas/edit',{
          idea:idea
        });
      }
  })

});

//see ideas route
router.get('/', ensureAuthenticated, (req,res) => {
  Idea.find({user: req.user.id})
  .sort({date:'desc'})
  .then( ideas => {
    res.render('ideas/index', {
      ideas:ideas
    });
  });
});

//catch post request from /ideas
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];
  if(!req.body.title) {
    errors.push({text: 'Please add title'})
  }
  if(!req.body.details) {
    errors.push({text: 'Please add details'})
  }
  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }
  else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newUser)
    .save()
    .then( idea => {
      req.flash('success_msg', 'Idea added');
      res.redirect('/ideas');
    });
  }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then (idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then( idea => {
      req.flash('success_msg', 'Idea updated');
      res.redirect('/ideas')
    })
  });
});

//delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({_id: req.params.id})
  .then( () => {
    req.flash('success_msg', 'Idea removed');
    res.redirect('/ideas')
  });
});

//see ideas route
router.get('/ideas', ensureAuthenticated, (req,res) => {
  Idea.find({})
  .sort({date:'desc'})
  .then( ideas => {
    res.render('ideas/index', {
      ideas:ideas
    });
  });
});

module.exports = router;
