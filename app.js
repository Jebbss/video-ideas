const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

const port = 8080;
const dbName = 'mongodb://localhost/vidjot-dev';

app.listen(port, ()=>{
  console.log(`Server Started on port ${port}`);
});

// connect to mongoose
mongoose.connect(dbName, {})
.then(() => console.log('MongoDB connected'))
.catch( err => console.log(err));

// load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method override middleware
app.use(methodOverride('_method'));

//middleware for express-session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

//flash middleware
app.use(flash());

//global vars
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

//about route
app.get('/about', (req, res) => {
  res.render('about');
});

//see ideas route
app.get('/ideas', (req,res) => {
  Idea.find({})
  .sort({date:'desc'})
  .then( ideas => {
    res.render('ideas/index', {
      ideas:ideas
    });
  });
});

//add an idea route
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//edit ideas
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id:req.params.id
  })
  .then(idea => {
      res.render('ideas/edit',{
        idea:idea
      });
  })

});

//catch post request from /ideas
app.post('/ideas', (req, res) => {
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
      details: req.body.details
    }
    new Idea(newUser)
    .save()
    .then( idea => {
      req.flash('success_msg', 'Idea added');
      res.redirect('/ideas');
    });
  }
});

app.put('/ideas/:id', (req, res) => {
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
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
  .then( () => {
    req.flash('success_msg', 'Idea removed');
    res.redirect('/ideas')
  });
});
