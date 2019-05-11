'use strict';
(function () {
  window.pictures = document.querySelector('.pictures');
  var filter = document.querySelector('.img-filters');
  var filterButtons = filter.querySelectorAll('.img-filters__button');

  // все хорошо
  var onDataLoad = function (data) {
    window.loadedData = data;
    window.hideLoader();
    window.renderPictures(window.loadedData);
    showFilterBlock();
  };
  // ошибка
  var onError = function (errorMessage) {
    window.hideLoader();
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


  var showFilterBlock = function () {
    filter.classList.remove('img-filters--inactive');
  };

  // Фильтр new
  var filterAsNew = function (clonedData) {
    var randomPictures = [];
    for (var i = 0; i < 10; i++) {
      var index = window.getRandomNumber(0, clonedData.length - 1);
      randomPictures.push(clonedData[index]);
      clonedData.splice(index, 1);
    }
    window.renderPictures(randomPictures);
  };

  // Фильтр обсуждаемых
  var filterAsdiscussed = function (clonedData) {
    var sortedByCommnets = clonedData.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    window.renderPictures(sortedByCommnets);
  };

  // Обработчик события на клик каждого фильтра
  var filterButtonClickHandler = function (button) {
    button.addEventListener('click', function (e) {
      removeFilterButtonsActive();
      button.classList.add('img-filters__button--active'); // добавляем нажатой кнопке класс active
      var id = e.target.id; // id нажатой кнопки
      window.removeAllPictures(); // Удаляем все пикчи на странице
      var clonedData = window.loadedData.slice(); // клонируем массив JSONов с пикчами

      if (id === 'filter-new') {
        filterAsNew(clonedData);
      } else if (id === 'filter-discussed') {
        filterAsdiscussed(clonedData);
      } else {
        window.renderPictures(window.loadedData);
      }
    });
  };

  // Удаляет у всех кнопок фильтра класс active
  var removeFilterButtonsActive = function () {
    filterButtons.forEach(function (button) {
      if (button.classList.contains('img-filters__button--active')) {
        button.classList.remove('img-filters__button--active');
      }
    });
  };

  filterButtons.forEach(function (button) {
    filterButtonClickHandler(button);
  });

})();
