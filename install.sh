#!/bin/sh

## install jQuery
echo 'installing jQuery'
wget http://code.jquery.com/jquery-1.9.1.min.js -O ./client/jquery-1.9.1.min.js || (echo 'failed to install jQuery.'; exit -1) || exit -1

## install websocket
which npm > /dev/null
if [ $? -ne 0 ]; then
  echo 'npm missng.'
  exit -1;
fi

echo 'installing WebSocket-Node'
cd ./server/
npm install websocket || (echo 'failed to install WebSocket-Node.'; exit -1) || exit -1

