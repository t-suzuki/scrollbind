scrollbind
==========

scrollbind is a client-side JavaScript with a Node.js WebSocket server to
share scroll between browsers. Currently this is just a test project
for getting familiar with WebSocket, and not intended for realistic
situations.

Getting Started
---------------

### Prerequisites

* Node.js (0.10.2)
* Web browser supporting WebSocket (Safari, Chrome, etc.)

### Install

First, clone the repository.
```bash
$ git clone https://github.com/t-suzuki/scrollbind.git
$ cd scrollbind
```

Then, install jQuery and Node.js WebSocket.
```bash
$ sh ./install.sh
```

### Run server
```bash
$ cd server
$ node broadcast_server.js
# -> the server starts listening port 8080.
```

### Open test page in a web browser
Open two or more browser windows.
```bash
# in the same machine
$ open http://127.0.0.1:8080/
# in another machine
$ open http://YOURSERVERADDRESS:8080/
```

### Bind & scroll
1. click "master mode" in one browser
2. scroll in the master mode browser
3. all the other slave browser followes to the master browser.
