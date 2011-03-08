var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Entry = new Schema({
  user:String,
  text:String,
  timestamp:Date
});

var Chat = new Schema({
  title:String,
  entries:[Entry]
});

mongoose.model("Chat", Chat);

exports.findAll = function(callback){
  return mongoose.model("Chat").find({}, callback);
}

exports.findById = function(id, callback){
  return mongoose.model("Chat").findById(id, callback);
}

exports.addEntry = function(id, user, text, timestamp, callback) {
  exports.findById(id, function(err, chat) {
    var newEntry = {user:user, text:text, timestamp:timestamp};
    chat.entries.push(newEntry);
    chat.save(function(){
      callback(newEntry);
    });
  });
}

exports.create = function(title, entries, callback){
  var Chat = mongoose.model("Chat");
  var chat = new Chat();
  chat.title = title;
  chat.entries = entries;
  chat.save(callback);
}
