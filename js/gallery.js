'use strict';
(function () {
  window.pictures = document.querySelector('.pictures');
  // все хорошо
  var onDataLoad = function (data) {
    window.renderPictures(data);
  };
  // ошибка
  var onError = function (errorMessage) {
    var template = document.querySelector('#error-picture');
    var error = template.content.querySelector('.error').cloneNode(true);
    var errorTitle = error.querySelector('.error__title');
    var errorButton = error.querySelector('.error__button');
    errorTitle.textContent = errorMessage;
    errorButton.addEventListener('click', function () {
      error.remove();
      window.load(onDataLoad, onError);
    });
    window.pictures.appendChild(error);
  };
  // загружаем данные из сервера
  window.load(onDataLoad, onError);

})();
