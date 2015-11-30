
;(function() {
  var toArray = function(arr) {  
    return Array.prototype.slice.call(arr);
  };

  var getScrollMax = function(elm) {
    return (elm.scrollHeight-elm.offsetHeight);
  };
  var getScrollRate = function(elm) {
    return (elm.scrollTop) / getScrollMax(elm);
  };

  syncroll = function(query) {
    var elements = document.querySelectorAll(query);
    elements = toArray(elements);

    // set event
    elements.forEach(function(elm) {
      var others = elements.filter(function(other) {
        return elm !== other;
      });

      // scroll end イベントを作成
      var delay = 200;
      var timer = null;
      elm.addEventListener('scroll', function() {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(function() {
          // create scroll end event
          var e = document.createEvent("HTMLEvents");
          e.initEvent('scrollend', true, false);
          this.dispatchEvent(e);
        }.bind(this), delay);
      });

      elm.addEventListener('scroll', function() {
        if (this.__lock) { return ; }

        var rate = getScrollRate(elm);
        others.forEach(function(other) {
          // lock
          other.__lock = true;
          // sync scroll
          var max = getScrollMax(other);
          other.scrollTop = max*rate;
        });
      }, false);

      elm.addEventListener('scrollend', function() {
        // unlock
        this.__lock = false;
      });
    });
  };

  window.syncroll = syncroll;
})();
