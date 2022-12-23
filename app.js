const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

// DB congig
const db = require('./config/database')

const app = express();

const port = process.env.PORT || 8080;

app.listen(port, ()=>{
  console.log(`Server Started on port ${port}`);
});

// connect to mongoose
mongoose.connect(db.mongoURI, {})
.then(() => console.log('MongoDB connected'))
.catch( err => console.log(err));

//handlebars middleware
app.engine('handlebars', engine({
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
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//global vars
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
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

// passport congig
require('./config/passport')(passport);
