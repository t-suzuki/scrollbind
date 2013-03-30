
//! create a function to bind scroll of clients
(function (window) {
  $.scrollBind = function(param) {
    var wsServerURL = param.wsServerURL;
    var window = param.window;
    var body = param.body;
    var duration = param.duration || 500;
    var self = this;

    // init connection
    var ws = new WebSocket(wsServerURL);
    ws.onmessage = function(e) {
      console.log('ws.recv:');
      console.log(e.data);

      self.onReceiveScroll(e.data);
    };

    // init scroll detection
    $(window).scroll(function() {
      var pos = $(this).scrollTop();
      self.onScroll(pos);
    });

    this.start = function() {
    };

    this.onScroll = function(pos) {
      console.log('on self scroll:'+pos);
      ws.send(pos);
    };

    this.onReceiveScroll = function(pos) {
      console.log('on scroll recv:'+pos);
      body.stop().animate({scrollTop: pos}, duration);
    }

    return this;
  };
})(window);

