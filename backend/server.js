var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
var mongoose = require('mongoose');
var Comment = require('./api/models/commentModel');
var User = require('./api/models/userModel');
var bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Commentdb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/routes');
routes(app);

// var cors = require('cors')
// app.use(cors())

app.listen(port);

app.use(function (req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'});
});
