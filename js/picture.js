'use strict';
(function () {
  // Отрисовывает картинку
  var renderPicture = function (item) {
    var template = document.querySelector('#picture');

    var picture = template.content.querySelector('.picture').cloneNode(true);
    var pictureImg = picture.querySelector('.picture__img');
    var pictureComments = picture.querySelector('.picture__comments');
    var pictureLikes = picture.querySelector('.picture__likes');

    pictureImg.src = item.url;
    pictureComments.textContent = item.comments.length;
    pictureLikes.textContent = item.likes;

    picture.addEventListener('click', function () {
      window.pictureClickHandler(item);
    });

    return picture;
  };

  // отрисовыет картинку
  window.renderPictures = function (data) {
    var fragment = document.createDocumentFragment();
    data.forEach(function (item) {
      fragment.appendChild(renderPicture(item));
    });
    window.pictures.appendChild(fragment);
  };

  // Функция удаляет картинки
  window.removeAllPictures = function () {
    var pictures = document.querySelectorAll('.picture');
    pictures.forEach(function (picture) {
      picture.remove();
    });
  };

})();
