// Instanciation
var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	path = require('path'),

	app = express(),
	port = process.env.PORT || 8080,
	Schema = mongoose.Schema;



// Mongoose connection set up
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://Writer:3WdpnAqvDvGZb6BA@onlinedata-xzwiw.mongodb.net/OnlineData', { useUnifiedTopology: true}, {useNewUrlParser: true });

var InfoSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the intel',
    unique: true
  }
});
var Info = mongoose.model('Info', InfoSchema);


// Endpoints
app.get('/', function(req, res) {
	res.send('Working !')
})
app.get('/home', function(req, res) {

	res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/:data', function (req, res) {
  	// res.send(req.params.data)

  	var Obj = {name: req.params.data};
  	var insert = new Info(Obj);
		insert.save(function(err, info) {
			if (err)
				res.send(err);
				res.json(info);
		});
})

app.use(function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port, function () {
  	console.log("server running on : http://localhost:" + port)
})