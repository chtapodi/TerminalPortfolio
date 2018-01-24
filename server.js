// server.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var Gallery = require('express-photo-gallery');

//keep track of how times clients have clicked the button
var clickCount = 0;

var options = {
  title: 'Gallery'
};

app.use(express.static(__dirname + '/public'));


//redirect / to our index.html file
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/public/index.html');
});



io.on('connection', function(client) {
	//when the server receives clicked message, do this
    client.on('getFile', function(loc) {
      var file = fs.readFileSync(__dirname + '/public/'+ loc + '/dir.html', 'utf8')
		  io.emit('postFile', file);
    });

    client.on('readFile', function(loc) {
      var file = fs.readFileSync(__dirname + '/public/'+ loc + '/about.txt', 'utf8')
      io.emit('readOut', file);
      console.log(file);
    })

    client.on('hostGallery', function(loc) {
      console.log("gallery " + loc + ' at ' + loc + '/gallery')
      app.use('/gallery', Gallery(__dirname + '/public/' + loc +'/images/', options));


    })

});

//start our web server and socket.io server listening
server.listen(3000, function(){
  console.log('listening on *:3000');
});
