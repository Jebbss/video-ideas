const express = require('express');
const path = require('path');
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

//handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//public folder
app.use(express.static(path.join(__dirname, 'public')));

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

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// use routes
app.use('/ideas', ideas);
app.use('/users', users);
