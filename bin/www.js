// const app =require('../server');
// const debug=require('debug')('research:server');
// const http=require('http')


// // get posrt form enviroment 

// const port=normalizePort(process.env.PORT||'1212');
// app.set(port)

// // Create and start an HTTP server
// const server = http.createServer(app);



// // listen port for http server
// server.listen(port,process.env.IPADDRESS)
// server.on('error',onError)
// server.on('listening',onListening)
// console.log("Ipaddress",process.env.IPADDRESS);

// // make function for nomalize the port

// function normalizePort(val) {
//     const port = parseInt(val, 10);
//     if (isNaN(port)) return val; // If not a number, return as is (could be a named pipe)
//     if (port >= 0) return port; // If port number is valid, return it
//     return false; // Otherwise, return false
// }

// /**
//  * Event listener for HTTP server "error" event.
//  */

// function onError(error) {
//     if (error.syscall !== 'listen') {
//       throw error;
//     }
  
//     var bind = typeof port === 'string'
//       ? 'Pipe ' + port
//       : 'Port ' + port;
  
//     // handle specific listen errors with friendly messages
//     switch (error.code) {
//       case 'EACCES':
//         console.error(bind + ' requires elevated privileges');
//         process.exit(1);
//       case 'EADDRINUSE':
//         console.error(bind + ' is already in use');
//         process.exit(1);
//       default:
//         throw error;
//     }
//   }
  
//   /**
//    * Event listener for HTTP server "listening" event.
//    */
  
//   function onListening() {
//     var addr = server.address();
//     var bind = typeof addr === 'string'
//       ? 'pipe ' + addr
//       : 'port ' + addr.port;
//     console.log('Listening on  ' + bind);
//     debug('Listening on ' + bind);
//   }




/**
 * Module dependencies.
 */

var app = require('../server');
var debug = require('debug')('medical-test:server');
var http = require('http');
const socketIo = require('socket.io'); // Correct import for socket.io
const socketController = require('../app/v1/controllers/socketController');
// Import socketController

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3030');
console.log(port,'from port')
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 * 164.90.138.14:3030
 * 192.168.10.168
 */

server.listen(port, process.env.IPADDRESS || "10.0.60.205");


// Handle server errors and listen events
server.on('error', onError);
server.on('listening', onListening);



/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
  debug('Listening on ' + bind);
}

// Add socket.io to the server
const io = socketIo(server, {
  cors: {
    origin: '*'  // You can specify allowed origins here
  }
});

// Global `io` so that it can be accessed anywhere in your app
global.io = io;

// Call the socket controller to handle socket events
socketController(io);

