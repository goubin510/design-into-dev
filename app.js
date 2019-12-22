// Instanciation
var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	path = require('path'),
	unirest = require('unirest'),
	analysis = require('./scripts/analysis'),

	app = express(),
	port = process.env.PORT || 3000,
	Schema = mongoose.Schema;

// body parser set up
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongoose connection set up
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://Writer:Writer123@ds239928.mlab.com:39928/heroku_kflqvm92', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

var InfoSchema = new Schema({
  description: {
    type: String,
    required: 'Kindly enter the description of the spent'
  },
  amount: {
  	type: Number,
  	required: 'Set an amount please'
  },
  date: {
  	type: Date,
  	default: Date.now
  },
  category: {
  	type: String,
  },
  identificationStr: {
  	type: String,
  	required: 'Please set a passphrase'
  }
});
var Info = mongoose.model('Info', InfoSchema);

// Info.deleteMany({}, function(err, info) {
// 	if (err)
// 		res.send(err);
// 	console.log()
// 	console.log('Infos successfully deleted');
// });

// Endpoints
app.get('/', function(req, res) {
	res.send('C Live !')
})
app.get('/home', function(req, res) {

	res.sendFile(path.join(__dirname + '/index.html'))
})

app.post('/', function (req, res) {
	Info.find(req.body, function(err, info) {
		if (err)
			res.send(err);
			res.json(info);
	});
})

app.get('/raw', function (req, res) {
	Info.find({}, function(err, info) {
		if (err)
			res.send(err);
			res.json(info);
	});
})

app.post('/data', function(req, res) {
   	var insert = new Info(req.body);
	insert.save(function(err, info) {
	 	if (err)
	 		res.send(JSON.stringify(err));
	 		res.json(JSON.stringify(info));
	});
})

// Redirection & launch app

app.use(function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port, function () {
	console.log(new Date)
  	console.log("server running on : http://localhost:" + port)
})