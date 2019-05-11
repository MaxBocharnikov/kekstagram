'use strict';
(function () {
  window.load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    var url = 'https://js.dump.academy/kekstagram/data';
    xhr.timeout = 10000;
    xhr.responseType = 'json';
    xhr.open('GET', url);

    xhr.addEventListener('load', function () {
      if (xhr.status !== 200) {
        onError('Что то пошло не так.');
        return;
      }
      onSuccess(xhr.response);
    });

    xhr.addEventListener('error', function () {
      onError('Проблемы с сетью.');
    });

    xhr.addEventListener('timeout', function () {
      onError('Превышен лимит ожидания.');
    });

    xhr.send();
  };

  window.send = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    var url = 'https://js.dump.academy/kekstagram';
    xhr.timeout = 30000;
    xhr.open('POST', url);
    xhr.addEventListener('load', function () {
      if (xhr.status !== 200) {
        onError('Что то пошло не так');
      } else {
        onSuccess();
      }
    });

    xhr.addEventListener('error', function () {
      onError('Проблемы с сетью');
    });

    xhr.addEventListener('timeout', function () {
      onError('Превышен лимит ожидания');
    });

    xhr.send(data);
  };

})();
