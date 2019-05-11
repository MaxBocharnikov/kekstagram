'use strict';
(function () {
  var loader = document.querySelector('.loader-overlay');
  window.showLoader = function () {
    loader.classList.remove('hidden');
  };

  window.hideLoader = function () {
    loader.classList.add('hidden');
  };
})();
