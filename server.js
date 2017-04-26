var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var userCount = 0;
var onlineUsers = [];
var typingUsers = [];

io.on('connection', function(socket) {

    var updateOnlineUsers = function() {
        socket.broadcast.emit('onlineUser', onlineUsers);
        socket.emit('onlineUser', onlineUsers);
    };

    socket.on('typingStart', function() {
        
        if (typingUsers.indexOf(socket.nickname) == -1) {
            typingUsers.push(socket.nickname);
            socket.broadcast.emit('typing', typingUsers);
        }
    });
    
    socket.on('typingFinish', function(){
        var index = typingUsers.indexOf(socket.nickname);
        
         if (index > -1) {
            typingUsers.splice(index, 1);
            socket.broadcast.emit('typing', typingUsers);
        }
    });

    socket.on('message', function(message) {
        message = socket.nickname + ': ' + message;
        socket.broadcast.emit('message', message);
        socket.emit('message', message);
    });

    socket.on('join', function(name) {
        socket.nickname = name;
        socket.online = true;

        //User online emitter
        onlineUsers.push(name);
        updateOnlineUsers();

        //Creating the names and welcome message
        console.log(socket.nickname + ' has entered the chatroom');
        socket.broadcast.emit('message', socket.nickname + ' has entered the chatroom.');
        socket.emit('message', socket.nickname + ' has entered the chatroom.');
    });

    socket.on('disconnect', function() {

        var index = onlineUsers.indexOf(socket.nickname);
        onlineUsers.splice(index, 1);
        updateOnlineUsers();

        console.log(socket.nickname + ' has left the chatroom');
        socket.broadcast.emit('message', socket.nickname + ' has left the chatroom.');
    })
});


server.listen(process.env.PORT || 8080);
