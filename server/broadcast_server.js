var WebSocket = require('websocket').server,
    http      = require('http'),
    Dgram     = require('dgram'),
    wsServer,
    httpServer;

// Create HTTP Server
httpServer = http.createServer(function(request, response) {
  console.log('http');
  response.writeHead(404, {"Content-Type": 'text/plain'});
  response.write('Page Not Found.');
  response.end();
});
httpServer.listen(8080);

// Create WebSocket Server
wsServer = new WebSocket({
  httpServer:            httpServer,
  autoAcceptConnections: true
});

// WebSocket events
wsServer.on('connect', function(connection) {
  console.log('WebSocket connected.');
  connection.on('message', function(msg) {
    console.log('WebSocket message.');
    console.log(msg);
    wsServer.broadcast(msg.utf8Data);
  })
});
