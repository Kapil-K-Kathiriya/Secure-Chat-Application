const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer((req, res) => {
  // Respond with a 200 OK status for all OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle your other HTTP requests here if needed
  // ...

});

const io = socketIo(server, {
  cors: {
    origin: 'http://127.0.0.1:5500', // Replace with your client-side origin
    methods: ['GET', 'POST']
  }
});

const users = {}; // Store user names by socket ID

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  //if any new user joins, let other users connected to the server know!
  socket.on('new-user-joined', (name) => {
    // console.log("New User", name)
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  //if someone sends a message, broadcast it to other people
  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

// if someone leaves the chat, let other to know 
  socket.on('disconnect', (message) => {
    socket.broadcast.emit('left', users[socket.id] );
    delete users[socket.id];    
  });
});

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});
