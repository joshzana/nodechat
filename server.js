
/**
 * Module dependencies.
 */

var express = require('express'),
    app = module.exports = express.createServer(),
    mongoose = require('mongoose'),
    io = require('socket.io'),
    socket = null;

// Configuration

app.configure(function(){
	app.use(express.logger());
  app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  console.log('dev mode');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  db = mongoose.connect('mongodb://localhost/nodechat');
});

app.configure('production', function(){
  console.log('prod mode');
  app.use(express.errorHandler()); 
	db = mongoose.connect('mongodb://localhost/nodechat-prod');
});

app.configure('test', function() {
  console.log('test mode');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  db = mongoose.connect('mongodb://localhost/nodechat-test');
});

var model = require('./model.js');

// Routes

app.get('/', function(req, res){
 res.render('index', {
      locals: {
        title: 'Welcome to node'
      }
    });
});

// list
app.get("/chats", function(req, res){
  model.findAll(function(err, chats) {
     res.render("chats/index.jade", {
       locals: {
         chats:chats,
         count: chats.length
       }
     });
  });
});

// new action
app.get("/chats/new", function(req, res){
    model.create("test chat", [], function(chat) {
    	res.redirect("/chats/" + chat.id);
    });
});

// test
app.get("/test", function(req, res){
  
  for (var i = 0, j = 0; i < 20; i++) {
    model.create("test " + i, 
    [{
      user: "user " + i,
      timestamp: new Date(),
      text: "This is some text"
    },
    {
      user: "another user " + i,
      timestamp: new Date(),
      text: "This is some other text"
    }], function(){
      if (++j == 20) {
        res.redirect("/chats");
      }
    });
  }
});

// read
app.get("/chats/:id", function(req, res){
  model.findById(req.params.id, function(err, chat) {
     res.render('chats/chat.jade', {
       locals: {
         chat:chat
       }
     });
  });
});


// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  
  socket = io.listen(app);
  
  socket.on('connection', function(client){
    // new client is here!
    client.on('message', function(message){
      model.addEntry(message.id, message.user, message.text, message.timestamp, function(entry) {
        console.log("broadcasting " + JSON.stringify(entry));
        client.broadcast(entry); // broadcast not working?
    });

    })
    client.on('disconnect', function(){
      
    })
  });
  
  console.log("Express server listening on port %d", app.address().port)
}
