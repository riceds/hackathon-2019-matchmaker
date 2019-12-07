var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Battle = require('./api/models/battleModel'), 
  Connection = require('./api/models/connectionModel'), 
  Match = require('./api/models/matchModel'), 
  Player = require('./api/models/playerModel'), 
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/matchmaker'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/matchmakerRoute'); //importing route
routes(app); //register the route

app.listen(port);


console.log('matchmaker RESTful API server started on: ' + port);