'use strict';
(function () {
  var uploadFile = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.img-upload__overlay');

  var uploadForm = document.querySelector('.img-upload__form');
  var hashtagsField = uploadOverlay.querySelector('.text__hashtags');
  var submitButton = uploadOverlay.querySelector('#upload-submit');

  var uploadPreview = uploadOverlay.querySelector('.img-upload__preview');
  var effectItems = uploadOverlay.querySelectorAll('.effects__item label');
  var uploadCancel = uploadOverlay.querySelector('.img-upload__cancel');

  var effectLevel = document.querySelector('.effect-level');
  var effectLevelDepth = document.querySelector('.effect-level__depth')
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectPin = document.querySelector('.effect-level__pin');

  var currentEffectName; // текущее имя эффекта
  var PIN_MAX_DEEP = 453; // максимальная значение пина в пикселях

  //  мапа по фильтрам
  var effectNames = [
    'none',
    'chrome',
    'sepia',
    'marvin',
    'phobos',
    'heat'
  ];

  var scaleSmaller = uploadOverlay.querySelector('.scale__control--smaller');
  var scaleBigger = uploadOverlay.querySelector('.scale__control--bigger');
  var scaleValue = uploadOverlay.querySelector('.scale__control--value');

  // мапа по размерам
  var scaleMap = {
    min: 0,
    max: 100,
    step: 25
  };

  var openPreview = function () {
    uploadOverlay.classList.remove('hidden');
    uploadCancel.addEventListener('click', closePreview);
    window.addEventListener('keydown', onEscPress);
  };

  var closePreview = function () {
    uploadOverlay.classList.add('hidden');
    window.removeEventListener('keydown', onEscPress);
    uploadCancel.removeEventListener('click', closePreview);
    uploadFile.value = null;
  };

  var setEffectValue = function () {
    var effectPinLeft = (effectPin.offsetLeft / PIN_MAX_DEEP).toFixed(2); // переводит значение в проценты (от 0 до 1 )
    var effectValues = { // мапа по значениям, относительно от фильтра
      'none': '',
      'chrome': 'grayscale(' + effectPinLeft + ')',
      'sepia': 'sepia(' + effectPinLeft + ')',
      'marvin': 'invert(' + effectPinLeft * 100 + '%' + ')',
      'phobos': 'blur(' + effectPinLeft * 5 + 'px' + ')',
      'heat': 'brightness(' + effectPinLeft * 3 + ')'
    };
    uploadPreview.style.filter = effectValues[currentEffectName];
  };

  // На нажатие по одному из фильтров
  var effectItemClickHandler = function (item, effectName) {
    item.addEventListener('click', function () {
      uploadPreview.className = 'img-upload__preview';
      var effectClass = 'effects__preview--' + effectName;
      uploadPreview.classList.add(effectClass);
      currentEffectName = effectName;
      setEffectValue();
      checkFilterExistence();
    });
  };

  for (var i = 0; i < effectItems.length; i++) {
    effectItemClickHandler(effectItems[i], effectNames[i]);
  }

  var validateForm = function () {
    var maxHashLength = 20;
    var hashStr = hashtagsField.value;
    var hashArr = hashStr.split(' ');
    var isValid = hashArr.every(function (hash) {
      return hash.length < maxHashLength;
    });
    if (!isValid) {
      hashtagsField.setCustomValidity('Длина хештэга не должна превышать 20 символов');
    } else {
      hashtagsField.setCustomValidity('');
    }
  };

  var onEscPress = function (e) {
    if (window.isEscClicked(e.keyCode)) {
      closePreview();
    }
  };

  uploadFile.addEventListener('change', openPreview);


  submitButton.addEventListener('click', function () {
    validateForm();
  });

  // Перетаскивание фильтра
  var mouseDownHandler = function (downEvt) {
    var startX = downEvt.clientX;
    var mouseMoveHandler = function (moveEvt) {
      var shifted = moveEvt.clientX - startX;
      startX = moveEvt.clientX;
      effectPin.style.left = effectPin.offsetLeft + shifted + 'px';
      effectLevelDepth.style.width = effectPin.style.left;
      if (parseInt(effectPin.style.left, 10) > PIN_MAX_DEEP) {
        effectPin.style.left = PIN_MAX_DEEP + 'px';
      }

      if (parseInt(effectPin.style.left , 10) < 0) {
        effectPin.style.left = 0 + 'px';
      }
      setEffectValue();
    };

    var mouseUpHandler = function () {
      effectLevel.removeEventListener('mousemove', mouseMoveHandler);
      effectLevel.removeEventListener('mouseup', mouseUpHandler);
    }


    effectLevel.addEventListener('mousemove', mouseMoveHandler);
    effectLevel.addEventListener('mouseup', mouseUpHandler);
  };


  effectPin.addEventListener('mousedown', mouseDownHandler);


  // Уменьшить размер
  var reduceScale = function () {
    if (scaleValue.value !== '0%') {
      scaleValue.setAttribute('value', parseInt(scaleValue.value, 10) - scaleMap.step + '%');
    }
  };
  // Увеличить размер
  var increaseScale = function () {
    if (scaleValue.value !== '100%') {
      scaleValue.setAttribute('value', parseInt(scaleValue.value, 10) + scaleMap.step + '%');
    }
  };
  // Изменить размер превью
  var changePreviewSize = function () {
    uploadPreview.style.transform = 'scale(' + parseInt(scaleValue.value, 10) / 100 + ')';
  };
  scaleSmaller.addEventListener('click', function () {
    reduceScale();
    changePreviewSize();
  });

  scaleBigger.addEventListener('click', function () {
    increaseScale();
    changePreviewSize();
  });

  // Проверка, выбран ли фильтр; Если нет - скрываем ползунок насыщенности
  var checkFilterExistence = function () {
    if (uploadPreview.classList.contains('effects__preview--none')) {
      effectLevel.classList.add('hidden');
    } else {
      if (effectLevel.classList.contains('hidden')) {
        effectLevel.classList.remove('hidden');
      }
    }
  };

})();
