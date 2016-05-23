// require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// initialize variables
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

// middleware
// use body-parser to parse json
app.use(bodyParser.json());


// routes
// GET home
app.get('/', function(req, res) {
  res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res) {
  res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo;

  todos.forEach(function(todo) {
    if (todoId === todo.id) {
      console.log("found it!");
      matchedTodo = todo;
    }
  });

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

// POST /todos
app.post('/todos', function(req, res) {
  var body = req.body;

  // add id field and increment id number
  body.id = todoNextId;
  todoNextId++;
  // add completed property
  body.completed = false;
  // push body into array
  todos.push(body);

  console.log('**New Todo Added**');
  console.log('id: ' + body.id);
  console.log('description: ' + body.description);
  console.log('completed: ' + body.completed);
  res.json(body);
});

// start server
app.listen(PORT, function() {
  console.log('Express listening on port ' + PORT + '...');
});
