// require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');

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
  var queryParams = req.query;
  var filteredTodos = todos;
  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {completed: true});
  } else if (queryParams.hasOwnProperty('completed')
  && queryParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {completed: false});
  }
  res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

// POST /todos
app.post('/todos', function(req, res) {
  // eliminate extra fields
  var body = _.pick(req.body, ['description', 'completed']);

  // valid input fields
  if (!_.isBoolean(body.completed) || !_.isString(body.description)
  || body.description.trim().length === 0) {
    return res.status(400).send();
  }

  // trim body description
  body.description = body.description.trim();

  // add id field and increment id number
  body.id = todoNextId;
  todoNextId++;
  // add completed property
  //body.completed = false;
  // push body into array
  todos.push(body);

  console.log('**New Todo Added**');
  console.log('id: ' + body.id);
  console.log('description: ' + body.description);
  console.log('completed: ' + body.completed);
  res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  if (!matchedTodo) {
    res.status(404).json({"error": "no todo found with that id"});
  } else {
      todos = _.without(todos, matchedTodo);
      res.json(matchedTodo);
  }
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  var body = _.pick(req.body, ['description', 'completed']);
  var validAttributes = {};

  if (!matchedTodo) {
    return res.status(404).send();
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if (body.hasOwnProperty('description') && _.isString(body.description)
  && (body.description.trim().length > 0)) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')){
    return res.status(400).send();
  }
  // update todo attributes
  _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);
});


// start server
app.listen(PORT, function() {
  console.log('Express listening on port ' + PORT + '...');
});
