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

  var effectNames = [
    'none',
    'chrome',
    'sepia',
    'marvin',
    'phobos',
    'heat'
  ];

  var openPreview = function () {
    uploadOverlay.classList.remove('hidden');
  };

  var closePreview = function () {
    uploadOverlay.classList.add('hidden');
  };

  var setEffectValue = function () {
    var effectPinLeft = (effectPin.offsetLeft / PIN_MAX_DEEP).toFixed(2);
    var effectValues = {
      'none': '',
      'chrome': 'grayscale(' + effectPinLeft + ')',
      'sepia': 'sepia(' + effectPinLeft + ')',
      'marvin': 'invert(' + effectPinLeft * 100 + '%' + ')',
      'phobos': 'blur(' + effectPinLeft * 5 + 'px' + ')',
      'heat': 'brightness(' + effectPinLeft * 3 + ')'
    };
    uploadPreview.style.filter = effectValues[currentEffectName];
  };

  var effectItemClickHandler = function (item, effectName) {
    item.addEventListener('click', function () {
      uploadPreview.className = 'img-upload__preview';
      var effectClass = 'effects__preview--' + effectName;
      uploadPreview.classList.add(effectClass);
      currentEffectName = effectName;
      setEffectValue();
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

  uploadFile.addEventListener('change', function () {
    openPreview();
  });

  uploadCancel.addEventListener('click', function () {
    closePreview();
  });


  submitButton.addEventListener('click', function () {
    validateForm();
  });


  var mouseDownHandler = function (downEvt) {
    var startX = downEvt.clientX;
    var mouseMoveHandler = function (moveEvt) {
      var shifted = moveEvt.clientX - startX;
      startX = moveEvt.clientX;
      effectPin.style.left = effectPin.offsetLeft + shifted + 'px';
      effectLevelDepth.style.width = effectPin.style.left;
      if (parseInt(effectPin.style.left , 10) > PIN_MAX_DEEP) {
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

})();
