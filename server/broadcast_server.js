var WebSocket = require('websocket').server,
    http      = require('http'),
    fs        = require('fs'),
    path      = require('path'),
    url       = require('url'),
    staticFilesPath = path.join(process.cwd(), '../client'),
    wsServer,
    httpServer;

var exists_or_not = function(filepath, onexists, onnotexist) {
  fs.exists(filepath, function (exists) {
    if (exists) {
      onexists && onexists();
    } else {
      onnotexist && onnotexist();
    }
  });
};

// http server for static files.
httpServer = http.createServer(function(request, response) {
  console.log('http request: ' + request.url);
  var uri = url.parse(request.url).pathname;
  var filename = path.join(staticFilesPath, uri);

  var notfound = function() {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('404 Page Not Found\n');
    response.end();
  };

  var sendcontents = function(filename) {
    console.log('sending: '+ filename);
    fs.readFile(filename, 'binary', function(error, file) {
      if (error) {
        response.writeHead(500, {'Content-Type': 'text/plain'});
        response.write(error + '\n');
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, 'binary');
      response.end();
    });
  };

  exists_or_not(filename, function () {
    if (fs.statSync(filename).isDirectory()) {
      filename = path.join(filename, 'index.html');
      exists_or_not(filename, sendcontents.bind(null, filename), notfound);
    } else {
      // plain file
      sendcontents(filename);
    }
  }, notfound);

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

