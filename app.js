const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

const port = 8080;
const dbName = 'mongodb://localhost/vidjot-dev';

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

app.listen(port, ()=>{
  console.log(`Server Started on port ${port}`);
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

//add an idea route
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});
