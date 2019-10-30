// Instanciation
var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	path = require('path'),
	unirest = require('unirest'),

	app = express(),
	port = process.env.PORT || 3000,
	Schema = mongoose.Schema;

// body parser set up
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongoose connection set up
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://Writer:Writer123@ds239928.mlab.com:39928/heroku_kflqvm92', { useNewUrlParser: true, useCreateIndex: true });

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
	res.send('Working !')
})
app.get('/home', function(req, res) {

	res.sendFile(path.join(__dirname + '/index.html'))
})
app.get('/test', function(req, res) {

	res.sendFile(path.join(__dirname + '/test.html'))
})

app.post('/', function (req, res) {
	Info.find(req.body, function(err, info) {
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

app.use(function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port, function () {
  	console.log("server running on : http://localhost:" + port)
})


unirest.get('https://iotcf.iot-sap.cfapps.eu10.hana.ondemand.com/appcore-conf/Configuration')
.headers({'Cookie': 'JSESSIONID=s%3AlJ2K3AjeW3g2E4LXaczw0WsIpk1VTqhO.n9BZGRwKbAYdSKzjY44OlW1%2FKxx979lcl%2F3bYnvpbFM; __VCAP_ID__=dd2c69b8-85b0-446c-51f0-9daa'})
.end(function (response) {
  console.log(response.body);
});