const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser= require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

// Create Redis clients
let client = redis.createClient();

client.on('connect', () => {
  console.log('Redis connected');
});

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

// To use CSS files, ('static files')
app.use(express.static(path.join(__dirname, 'views')));

// Search page
app.get('/', (req, res, next) => {
  res.render('searchusers');
});

// Search processing
// This is a POST request, instead of GET, so that we can use req.body instead of req.params
app.post('/user/search', (req, res, next) => {
  let id = req.body.id;

  client.hgetall(id, (err, obj) => {
    if (!obj) {
      res.render('searchusers', {
        error: 'User does not exist'
      });
    } else {
      obj.id = id;
      res.render('details', {
        user: obj,
      });
    }
  });
});

// Add user page
app.get('/user/add', (req, res, next) => {
  res.render('adduser');
});

// Process Add User page
app.post('/user/add', (req, res, next) => {
  let { id, first_name, last_name, email, phone } = req.body;
  console.log('req body inside user/add/', req.body);

  client.hmset(id, [
    'first_name', first_name,
    'last_name', last_name,
    'email', email,
    'phone', phone,
  ], (err, reply) => {
    if (err) {
      console.log("Error is ", err);
    }
    console.log(reply);
    res.redirect('/');
  });
});

// Delete User
app.delete('/user/delete/:id', (req, res, next) => {
  client.del(req.params.id);
  console.log("successfull deleted client id ", req.params.id);
  res.redirect('/');
});

app.listen(port, () => {
  console.log('server started on port ', port);
});