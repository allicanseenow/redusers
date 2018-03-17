const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser= require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

// Set Port
const port = 3000;

// Init app
const app = express();

// View Engine
// Default layout is a file named: "main.handlebars"
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// methodOverride: allows DELETE request
app.use(methodOverride('_method'));

app.get('/', (req, res, next) => {
  res.render('searchusers');
});

app.listen(port, () => {
  console.log('server started on port ', port);
})