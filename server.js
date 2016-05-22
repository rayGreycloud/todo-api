var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

// seed data
var todos = [{
  id: 1,
  description: 'Pick up Daniel from school',
  completed: false,
}, {
  id: 2,
  description: 'Go to Fred Meyer\'s for groceries',
  completed: false,
}, {
  id: 3,
  description: 'Register Daniel for summer camp',
  completed: true,
}];

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


// start server
app.listen(PORT, function() {
  console.log('Express listening on port ' + PORT + '...');
});
