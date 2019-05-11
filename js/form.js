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
  var effectLevelValue = document.querySelector('.effect-level__value');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
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

  var changePreview = function () {
    var FILE_FORMATS = ['jpeg', 'jpg', 'gif', 'svg', 'png'];
    var file = uploadFile.files[0];
    var fileName = file.name.toLowerCase();
    var isAvaliable = FILE_FORMATS.some(function (format) {
      return fileName.endsWith(format);
    });
    if (isAvaliable) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var preview = uploadPreview.querySelector('img');
        preview.src = reader.result;
        preview.style.width = '100%';
      });
      reader.readAsDataURL(file);
    }
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
    setDefaultEffect();
    uploadFile.value = null;
  };

  var setFilter = function (effectPinLeft) {
    var effectValues = { // мапа по значениям, относительно от фильтра
      'none': '',
      'chrome': 'grayscale(' + effectPinLeft + ')',
      'sepia': 'sepia(' + effectPinLeft + ')',
      'marvin': 'invert(' + effectPinLeft * 100 + '%' + ')',
      'phobos': 'blur(' + effectPinLeft * 5 + 'px' + ')',
      'heat': 'brightness(' + effectPinLeft * 3 + ')'
    };
    uploadPreview.style.filter = effectValues[currentEffectName];
  }

  var setDefaultEffect = function () {
    effectPin.style.left = '20px';
    effectLevelDepth.style.width = effectPin.style.left;
    effectLevelValue.setAttribute('value', 20);
    var effectPinLeft = 0.2;
    setFilter(effectPinLeft);
  };

  var setEffectValue = function () {
    var effectPinLeft = (effectPin.offsetLeft / PIN_MAX_DEEP).toFixed(2); // переводит значение в проценты (от 0 до 1 )
    effectLevelValue.setAttribute('value', effectPinLeft * 100);
    setFilter(effectPinLeft);
  };

  // На нажатие по одному из фильтров
  var effectItemClickHandler = function (item, effectName) {
    item.addEventListener('click', function () {
      uploadPreview.className = 'img-upload__preview';
      var effectClass = 'effects__preview--' + effectName;
      uploadPreview.classList.add(effectClass);
      currentEffectName = effectName;
      setDefaultEffect();
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
    var isLengthValid = hashArr.every(function (hash) {
      return (hash.length < maxHashLength);
    });
    var isBeginValid = hashArr.every(function (hash) {
      return hash[0] === '#';
    });

    var isUnique = hashArr.every(function (hash, index) {
      return hash !== hashArr[index + 1];
    });
    if (hashStr !== '') {
      if (!isLengthValid) {
        hashtagsField.setCustomValidity('Длина хэштэга не должна превышать 20 символов');
      } else if (!isBeginValid) {
        hashtagsField.setCustomValidity('Хештэг должен начинаться с "#"');
      } else if (!isUnique) {
        hashtagsField.setCustomValidity('Хештэги должны быть уникальны');
      } else {
        hashtagsField.setCustomValidity('');
      }
    }

  };

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

  var onEscPress = function (e) {
    if (window.isEscClicked(e.keyCode)) {
      closePreview();
    }
  };

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

  // коллбэк на успешную отправку формы
  var onSuccess = function () {
    window.hideLoader();
    closePreview();
  };

  // коллбэк на неуспешную отправку формы
  var onError = function (message) {
    window.hideLoader();
    var template = document.querySelector('#error-picture');
    var error = template.content.querySelector('.error').cloneNode(true);
    var errorTitle = error.querySelector('.error__title');
    var errorButton = error.querySelector('.error__button');
    errorTitle.textContent = message;
    errorButton.addEventListener('click', function () {
      error.remove();
      window.send(new FormData(uploadForm), onSuccess, onError);
    });
    uploadOverlay.appendChild(error);
  };


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

      if (parseInt(effectPin.style.left, 10) < 0) {
        effectPin.style.left = 0 + 'px';
      }
      setEffectValue();
    };


    var mouseUpHandler = function () {
      effectLevel.removeEventListener('mousemove', mouseMoveHandler);
      effectLevel.removeEventListener('mouseup', mouseUpHandler);
    };
    effectLevel.addEventListener('mousemove', mouseMoveHandler);
    effectLevel.addEventListener('mouseup', mouseUpHandler);
    uploadPreview.addEventListener('mouseout', mouseUpHandler);
  };


  effectPin.addEventListener('mousedown', mouseDownHandler);
  scaleSmaller.addEventListener('click', function () {
    reduceScale();
    changePreviewSize();
  });

  scaleBigger.addEventListener('click', function () {
    increaseScale();
    changePreviewSize();
  });

  uploadFile.addEventListener('change', function () {
    changePreview();
    openPreview();
  });

  // Валидация формы
  submitButton.addEventListener('click', function () {
    validateForm();
  });

  // на отправку формы
  uploadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    window.send(new FormData(uploadForm), onSuccess, onError);
  });
})();
