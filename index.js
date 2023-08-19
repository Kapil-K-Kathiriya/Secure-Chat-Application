//Node server which will handel socket io connections
const io = require('socket.io')(8000)//intialisation of socket in port 8000
const user ={}
io.on('connection', function(socket){//io.on is instancse of socket, able to handle multiple request, like if more than one people joined the app it will notify all connected people
    socket.on('new-user-joined',function(name){//socket.on run only for single user, so it can handle onyl one request at a time 
        user[socket.id] = name; //socket.id is key of individual user, and we set name of user
        socket.broadcast.emit('user-joined',name)//it inform all other user epect user it self that x person join chat
    })

    socket.on('send',function(message){
        socket.broadcast.emit('receive',{message:message,name:user[socket.id]})//if someone send any msg it will broadcast to all other one
        

    })
})