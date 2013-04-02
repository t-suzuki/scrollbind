
//! create a function to bind scroll of clients
(function (exports) {
  var scrollBinder = function(param) {
    var wsServerURL = param.wsServerURL;
    var window = param.window || $(window);
    var createIndicators = param.createIndicators || false;
    this._body = param.body || $('body');
    this._indicatorMaster = param.indicatorMaster || undefined;
    this._indicatorSlave = param.indicatorSlave || undefined;
    this._isMaster = false;
    this._onOpen  = param.onOpen || undefined;

    var self = this;

    // set user scroll hook.
    $(window).scroll(function() {
      var pos = $(this).scrollTop();
      self.onScroll(pos);
    });

    if (createIndicators) {
      var indicator = $('<div></div>');
      indicator
        .css({
          position: 'fixed',
          top: '0px',
          right: '0px',
        });
      if (!this._indicatorMaster) {
        this._indicatorMaster = $('<span>master</span>')
          .css({
            'background-color': '#ffaa99',
          })
          .appendTo(indicator);
      }
      if (!this._indicatorSlave) {
        this._indicatorSlave = $('<span>slave</span>')
          .css({
            'background-color': '#99aaff',
          })
          .appendTo(indicator);
      }
      indicator.find('span')
          .css({
            padding: '1ex 1ex',
          });
      this._body.append(indicator);
      this._indicator = indicator;
    }


    return this;
  }

  scrollBinder.prototype._updateIndicator = function() {
    if (this._isMaster) {
      this._indicatorSlave && this._indicatorSlave.hide();
      this._indicatorMaster && this._indicatorMaster.show();
    } else {
      this._indicatorMaster && this._indicatorMaster.hide();
      this._indicatorSlave && this._indicatorSlave.show();
    }
  }

  //! initialize connection and start scrollbind.
  scrollBinder.prototype.start = function(newWsServerURL) {
    this.stop();
    wsServerURL = newWsServerURL || wsServerURL;

    console.log('init scrollbind');
    console.log('connecting to: '+wsServerURL);
    var self = this;
    this.ws = new WebSocket(wsServerURL);
    this.ws.onmessage = function(e) {
      if (this._isMaster) {
        // console.log('ignoring');
      } else {
        console.log('ws.recv:');
        console.log(e.data);
        self.onReceiveScroll(e.data);
      }
    };
    if (this._onOpen) {
      this.ws.onopen = this._onOpen;
    }

    this.setMasterMode(false);
  };

  //! close connection.
  scrollBinder.prototype.stop = function() {
    if (this.ws && this.ws.readyStage == WebSocket.constructor.OPEN) {
      console.log('closing ws connection');
      this.ws.close();
    }
  };

  //! be a master/slave
  scrollBinder.prototype.setMasterMode = function(on) {
    if (on) {
      console.log('master mode');
      this._isMaster = true;
    } else {
      console.log('slave mode');
      this._isMaster = false;
    }
    this._indicator && this._updateIndicator(on);
  };

  //! get if I am a master
  scrollBinder.prototype._isMasterMode = function() {
    return this._isMaster;
  }

  // user scroll. if we are the master, send command to control slaves.
  scrollBinder.prototype.onScroll = function(pos) {
    if (this._isMaster) {
      console.log('on self scroll:'+pos);
      console.log('sending scroll to server');
      if (this.ws && this.ws.readyStage == WebSocket.constructor.OPEN) {
        this.ws.send(pos);
      }
    } else {
      // console.log('sending nothing becaus we are under control');
    }
  };

  // received scroll. if we are not the master, follow it.
  scrollBinder.prototype.onReceiveScroll = function(pos) {
      if (this._isMaster) {
        console.log('remote scroll is not enabled');
      } else {
        console.log('on scroll recv:'+pos);
        this._body.scrollTop(pos);
      }
  }

  if (typeof module !== 'undefined' && exports === module.exports) {
      module.exports = scrollBinder;
  } else {
      exports.scrollBinder = scrollBinder;
  }
})(this);

