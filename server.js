//Backend js
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const { urlencoded } = require('express');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder 
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat Bot';

//Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Welcome current user
        socket.emit('message', formatMessage(botName, 'Добро пожаловать в чат!'));

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the CHAT!`));
        //Разница межу emit и broadcast.emit  в том, что просто emit покажет сообщение только тому пользователю,который подключается, а broadcast.emit всем кроме того, кто подключился, а io.emit продемонстрирует сообщение вообще всем пользователям

        //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //Listen for chatMessage 
    socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Run when a user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){ //если еще остались пользователи в этом чате
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

            //Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }

    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));