'use strict';
(function () {
  var ESC_CODE = 27;

  window.isEscClicked = function (keycode) {
    if (keycode === ESC_CODE) {
      return true;
    }
    return false;
  };

  window.getRandomNumber = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand
  };


})();
