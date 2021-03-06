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
  amex: {
  	type: Boolean,
  },
  identificationStr: {
  	type: String,
  	required: 'Please set a passphrase'
  }
});
var Info = mongoose.model('Info', InfoSchema);

// ------------------------------------------------------------------------

// Endpoints

// Info ------------------------
app.get('/', function(req, res) {
	res.send('C Live ! <br>' + 
		' <a href="/home">go to /home</>'
		)
})

// PRD ------------------------
app.get('/home', function(req, res) {

	res.sendFile(path.join(__dirname + '/index.html'))
})
app.get('/home/data/:id', function (req, res) {

	analysis.current(Info, res, req.params.id);
	
})
app.get('/home/details/:id', function (req, res) {
	
	analysis.list(Info, res, req.params.id)

})
app.get('/home/csv/:id/:month', function (req, res) {
	
	analysis.csv(Info, res, req.params.id, req.params.month)

})
app.post('/home/data', function(req, res) {
   	var insert = new Info(req.body);
	insert.save(function(err, info) {
	 	if (err)
	 		res.send(JSON.stringify(err));
	 		res.json(JSON.stringify(info));
	});
})

// Test ------------------------
app.get('/data/raw', function (req, res) {
	Info.find({}, function(err, info) {
		if (err)
			res.send(err);
			res.json(info);
	});
})
app.get('/data/report', function (req, res) {
	Info.aggregate( [ {"$group" : {_id:"$identificationStr", count:{$sum:1}}} ], 
		function(err, info) {
			if(err)
				res.send(err);
				res.json(info);
				
		})
})
app.get('/home/data/rmTest', function (req, res) {
	Info.deleteMany({identificationStr: "test"}, function(err, info) {
		if (err)
			res.send(JSON.stringify(err));
			res.send(JSON.stringify(info));
	});
})

// DEV` ------------------------
app.get('/home/test', function (req, res) {
	var json = {};

	analysis.current(Info, res);
})

// ------------------------------------------------------------------------

// Redirection & launch app

app.use(function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port, function () {
	console.log(new Date)
  	console.log("server running on : http://localhost:" + port)
})