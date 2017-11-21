var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var routes = require('./routes/routes.js');

var app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);

//port
var port = 3001;

app.get('/', function(req, res) {
	res.send('Hello World');
});

app.listen(port, function() {
	console.log('app started on port: ', port);
});

