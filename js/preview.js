'use strict';
(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  var socialCaption = bigPicture.querySelector('.social__caption');
  var likes = bigPicture.querySelector('.likes-count');
  var commentsList = bigPicture.querySelector('.social__comments');
  var pictureCloseButton = bigPicture.querySelector('#picture-cancel');

  var commentCount; // Кол-во отрисованных комментариев
  var maxCommentCount; // Макс кол-во отбражаемых комментариев
  var commentLoader = bigPicture.querySelector('.comments-loader');

  var picture;

  // При нажатии на мал. картинки, открываем ее подробную карточку
  window.pictureClickHandler = function (data) {
    picture = data;
    commentCount = 0;
    maxCommentCount = 5;
    bigPicture.classList.remove('hidden');
    bigPictureImg.src = picture.url;
    bigPictureImg.alt = picture.description;
    socialCaption.textContent = picture.description;
    likes.textContent = picture.likes;
    showComments(picture.comments);

    pictureCloseButton.addEventListener('click', closePicture);
    window.addEventListener('keydown', onEscPress);
  };
  // Отрисовываем комментарии
  var showComments = function (comments) {
    var fragment = document.createDocumentFragment();
    for (var i = commentCount; i < comments.length; i++) {
      if (i === maxCommentCount) {
        commentCount += 5;
        maxCommentCount += 5;
        break;
      }
      fragment.appendChild(renderComment(comments[i]));
    }
    commentsList.appendChild(fragment);
    showCommentCount(i, comments);
    if (comments.length === i) {
      commentLoader.classList.add('hidden');
    }
  };
  // Отрисовываем один комментарий
  var renderComment = function (comment) {
    var template = document.querySelector('#socialComment');
    var socialComment = template.content.querySelector('.social__comment').cloneNode(true);
    var socialPicture = socialComment.querySelector('.social__picture');
    var socialText = socialComment.querySelector('.social__text');

    socialPicture.src = comment.avatar;
    socialText.textContent = comment.message;

    return socialComment;
  };

  var showCommentCount = function (index, comments) {
    var commentsCount = bigPicture.querySelector('.comments-count');
    var allComments = bigPicture.querySelector('.comments-count--all');

    commentsCount.textContent = index;
    allComments.textContent = comments.length;
  };

  var removeAllComments = function () {
    while (commentsList.lastChild) {
      commentsList.removeChild(commentsList.lastChild);
    }
  };

  var closePicture = function () {
    bigPicture.classList.add('hidden');
    commentLoader.classList.remove('hidden');
    removeAllComments();
    pictureCloseButton.removeEventListener('click', closePicture);
    window.removeEventListener('keydown', onEscPress);
  };

  var onEscPress = function (e) {
    if (window.isEscClicked(e.keyCode)) {
      closePicture();
    }
  };

  commentLoader.addEventListener('click', function () {
    showComments(picture.comments);
  });

})();
