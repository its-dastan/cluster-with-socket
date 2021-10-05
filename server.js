require('dotenv').config();
const app = require('./app');
const http = require('http');
const cluster = require('cluster');
const os = require('os');
const Socket = require('./socket');

if (cluster.isMaster) {
  const numWorkers = os.cpus().length;
  console.log('Master cluster setting up ' + numWorkers + ' workers');

  const server = require('http').createServer();
  const io = require('socket.io')(server);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log('worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      'Worker ' +
        worker.process.pid +
        ' died with code: ' +
        code +
        ' and signal: ' +
        signal
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  const port = process.env.PORT || 4000;

  const server = http.createServer(app);

  // Start the socket server
  const io = Socket.init(server);

  server.listen(port, () => {
    console.log(`server running at port ${port}...`);
  });
}
