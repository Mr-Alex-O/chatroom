$(document).ready(function() {
    var socket = io();
    var $input = $('input');
    var $messages = $('#messages');
    var $totalUsers = $('#totalUsers');
    var $onlineUsers = $('#onlineUsers');
    var $typingUsers = $('#typingUsers');


    var addMessage = function(message) {
        $messages.append('<div>' + message + '</div>');
    };


    var updateUserCount = function(userCount) {
        console.log('User Count: ' + userCount);
        $totalUsers.text('Total User(s) online: ' + userCount);
    }

    //current online users
    var usersOnline = function(onlineUsers) {
        $onlineUsers.empty();
        onlineUsers.forEach(function(user) {
            $onlineUsers.append('<button>' + user + '</button>');
        });

        updateUserCount(onlineUsers.length);
    };

    var userTyping = function(typingUsers) {
        $typingUsers.empty();
        typingUsers.forEach(function(user) {
            $typingUsers.append(user + ' is typing.   ');
        });


    };

    $input.on('keydown', function(event) {
        var message = $input.val();

        if (event.keyCode != 13) {
            if (message.length == 0) {
                socket.emit('typingFinish');
            }
            else {
                socket.emit('typingStart');
            }
            return;
        }

        socket.emit('message', message);
        $input.val('');
        socket.emit('typingFinish');
    });


    socket.on('connect', function(data) {
        var nickname = prompt('What is your name?');
        socket.emit('join', nickname);
    });

    socket.on('typing', userTyping);
    socket.on('message', addMessage);
    socket.on('onlineUser', usersOnline);

});
