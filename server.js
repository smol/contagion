(function(){
	var express = require('express');
	var app = express();
	var server = require('http').Server(app);
	var io = require('socket.io')(server);

	var mongoose = require('mongoose');
	var morgan = require('morgan');
	var body_parser = require('body-parser');
	var method_override = require('method-override');


	mongoose.connect('mongodb://localhost/contagion');

	app.use(express.static(__dirname + '/front/build'));
	app.use(morgan('dev'));
	app.use(body_parser.urlencoded({'extended' : 'true'}));
	app.use(body_parser.json());
	app.use(body_parser.json({ type : 'application/vnd.api+json' }));
	app.use(method_override());

	app.listen(8080);
	console.log('App listening on port 8080');

	// io.on('connection', function(socket){
	// 	socket.emit('news', {hello : 'world'});
	// 	socket.on('other', function(data){
	// 		console.log('data', data);
	// 	});
	// });

	// var user = mongoose.model('User', { name : String });
	// var test = new user({name : 'test'});
	// test.save(function(err){
	// 	if (err)
	// 		console.log('meow');
	// });


	app.get('/', function(req, res) {
		res.sendFile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
})();
