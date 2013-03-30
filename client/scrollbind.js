
//! create a function to bind scroll of clients
(function (exports) {
  var scrollBinder = function(param) {
    var wsServerURL = param.wsServerURL;
    var window = param.window || $(window);
    var body = param.body || $('body');
    var createIndicators = param.createIndicators || false;
    var indicatorMaster = param.indicatorMaster || undefined;
    var indicatorSlave = param.indicatorSlave || undefined;
    var self = this;
    var ws;
    var isUnderControl;

    // set user scroll hook.
    $(window).scroll(function() {
      var pos = $(this).scrollTop();
      onScroll(pos);
    });

    if (createIndicators) {
      var indicator = $('<div></div>');
      indicator
        .css({
          position: 'fixed',
          top: '0px',
          right: '0px',
        });
      if (!indicatorMaster) {
        indicatorMaster = $('<span>master</span>')
          .css({
            'background-color': '#ffaa99',
          })
          .appendTo(indicator);
      }
      if (!indicatorSlave) {
        indicatorSlave = $('<span>slave</span>')
          .css({
            'background-color': '#99aaff',
          })
          .appendTo(indicator);
      }
      indicator.find('span')
          .css({
            padding: '1ex 1ex',
          });
      body.append(indicator);
    }

    var setIndicator = function(master) {
      if (master) {
        indicatorSlave && indicatorSlave.hide();
        indicatorMaster && indicatorMaster.show();
      } else {
        indicatorMaster && indicatorMaster.hide();
        indicatorSlave && indicatorSlave.show();
      }
    }

    // set and unset remote controlled scrolling.
    var setIsUnderControl = function(on) {
      if (on) {
        console.log('under control');
        isUnderControl = true;
      } else {
        console.log('not under control');
        isUnderControl = false;
      }
      indicator && setIndicator(!on);
    };

    //! initialize connection and start scrollbind.
    this.start = function(newWsServerURL) {
      this.stop();
      wsServerURL = newWsServerURL || wsServerURL;
      setIsUnderControl(true);

      console.log('init scrollbind');
      console.log('connecting to: '+wsServerURL);
      self.ws = new WebSocket(wsServerURL);
      self.ws.onmessage = function(e) {
        console.log('ws.recv:');
        console.log(e.data);

        if (isUnderControl) {
          onReceiveScroll(e.data);
        }
      };
    };

    //! close connection.
    this.stop = function() {
      if (self.ws && self.ws.readyStage == WebSocket.constructor.OPEN) {
        console.log('closing ws connection');
        self.ws.close();
      }
    };

    //! be a master
    this.setMasterMode = function(isMaster) {
      setIsUnderControl(!isMaster);
      console.log('now I am '+(isMaster?'the master':'a slave'));
    };

    //! get if I am a master
    this.isMasterMode = function() {
      return !isUnderControl;
    }

    // user scroll. if we are the master, send command to control slaves.
    var onScroll = function(pos) {
      if (isUnderControl) {
        // console.log('sending nothing becaus we are under control');
      } else {
        console.log('on self scroll:'+pos);
        console.log('sending scroll to server');
        if (self.ws && self.ws.readyStage == WebSocket.constructor.OPEN) {
          self.ws.send(pos);
        }
      }
    };

    // received scroll. if we are not the master, follow it.
    var onReceiveScroll = function(pos) {
      if (isUnderControl) {
        console.log('on scroll recv:'+pos);
        body.scrollTop(pos);
      } else {
        console.log('remote scroll is not enabled');
      }
    };

    return this;
  }

  if (typeof module !== 'undefined' && exports === module.exports) {
      module.exports = scrollBinder;
  } else {
      exports.scrollBinder = scrollBinder;
  }
})(this);

