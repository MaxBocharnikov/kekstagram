'use strict';
(function () {
  var ESC_CODE = 27;

  window.isEscClicked = function (keycode) {
    if (keycode === ESC_CODE) {
      return true;
    }
    return false;
  };


})();
