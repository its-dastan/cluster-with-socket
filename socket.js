const blogs = require('./fakeBlogPosts');

const globalConnection = [];

const Socket = {
  async init(server) {
    try {
      // Enable the socket server
      const io = require('socket.io')(server);
      io.on('connection', async (socket) => {
        globalConnection.push(socket);
        console.log(socket.id);
        // console.log('A new user joined');
        console.log(globalConnection.length);
        // socket.disconnect()

        // Turn on the sockets
        socket.on('global', async () => {
          setInterval(async () => {
            // Emit the message from the server
            io.emit('globalUpdate', blogs);
          }, 5000);
        });
      });
    } catch (error) {
      console.log('socket server error', error);
      return { error };
    }
  },
};

module.exports = Socket;
