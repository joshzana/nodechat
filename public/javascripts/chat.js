var socket = new io.Socket();
socket.connect();
socket.on('connect', function(){
  
})

var appendData = function(entryData) {
  var entry = $("<li/>")
  .append(entryData.timestamp + " - " + entryData.user + " says " + entryData.text)
  .appendTo($("#entries"));
  
  $("#entries").listview("refresh");
};

socket.on('message', function(entryData){
	appendData(entryData);
})

socket.on('disconnect', function(){ 

})

$(document).ready(function(){
  $("#chatSubmit").click(function(){
    var newData = {
         id: $("#entries").data("id"),
         user: "foo",
         text: $("#chatEntry").val(),
         timestamp: new Date()
       };
    
    socket.send(newData);
    appendData(newData);
  });  
});