'use strict';
(function () {
  var HashtagData = {
    START_POSITION: 0,
    MAX_COUNT: 5,
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
    VALID_POSITION: 1
  };

  var Message = {
    HASHTAG_START: 'Хэш-тег начинается с символа #',
    HASHTAG_MIN_SYMBOL: 'Хеш-тег не может состоять только из одной решётки',
    HASHTAG_MAX_LENGTH: 'Максимальная длина одного хэш-тега ',
    HASHTAG_VALUE_INCLUSIVE: ' имволов, включая решётку',
    HASHTAG_NO_REPEAT: 'Один и тот же хэш-тег не может быть использован дважды',
    HASHTAG_MAX_NUMBER: 'Хэштегов может быть максимум ',
    HASHTAG_SEPARATOR: 'Хэш-теги разделяются пробелами'
  };

  var CommentData = {
    MAX_LENGTH: 140,
    MAX_LENGTH_MESSAGE: 'Максимальная длина - 140 символов'
  };

  // Загрузка изображения и показ формы редактирования
  var uploadPopapElement = document.querySelector('.img-upload__overlay');
  var uploadInputElement = document.querySelector('#upload-file');
  var btnCloseUploadElement = uploadPopapElement.querySelector('.img-upload__cancel');
  var textareaElement = uploadPopapElement.querySelector('.text__description');
  var inputHashtagElement = uploadPopapElement.querySelector('.text__hashtags');
  var formElement = document.querySelector('.img-upload__form');

  var submitButtonElement = document.querySelector('#upload-submit');

  var closeUploadOverlay = function () {
    window.utils.hideElement(uploadPopapElement);
    btnCloseUploadElement.removeEventListener('click', closeUploadOverlay);
    document.removeEventListener('keydown', onOverlayKeydownEsc);
    textareaElement.removeEventListener('input', onCommentInput);
    formElement.reset();
  };

  var onOverlayKeydownEsc = function (evt) {
    window.utils.isKeydownEsc(evt, closeUploadOverlay);
  };

  var onUploadInputChange = function () {
    window.utils.showElement(uploadPopapElement);
    btnCloseUploadElement.addEventListener('click', closeUploadOverlay);
    document.addEventListener('keydown', onOverlayKeydownEsc);
    textareaElement.addEventListener('input', onCommentInput);
    window.makeDeafultFilter();
  };

  var onInputFocus = function () {
    document.removeEventListener('keydown', onOverlayKeydownEsc);
  };

  var onInputBlur = function () {
    document.addEventListener('keydown', onOverlayKeydownEsc);
  };

  uploadInputElement.addEventListener('change', onUploadInputChange);
  inputHashtagElement.addEventListener('focus', onInputFocus);
  inputHashtagElement.addEventListener('blur', onInputBlur);
  textareaElement.addEventListener('focus', onInputFocus);
  textareaElement.addEventListener('blur', onInputBlur);

  // Валидация строки с хэш-тегами

  var validateHashtag = function (hashtag) {
    if (hashtag[HashtagData.START_POSITION] !== '#') {
      inputHashtagElement.setCustomValidity(Message.HASHTAG_START);
      return false;
    } else if (hashtag.length < HashtagData.MIN_LENGTH) {
      inputHashtagElement.setCustomValidity(Message.HASHTAG_MIN_SYMBOL);
      return false;
    } else if (hashtag.length > HashtagData.MAX_LENGTH) {
      inputHashtagElement.setCustomValidity(Message.HASHTAG_MAX_LENGTH + HashtagData.MAX_LENGTH + Message.HASHTAG_VALUE_INCLUSIVE);
      return false;
    } else if (hashtag.indexOf('#', HashtagData.VALID_POSITION) > 0) {
      inputHashtagElement.setCustomValidity(Message.HASHTAG_SEPARATOR);
      return false;
    }
    return true;
  };

  // Валидация строки с комментариями

  var checkMaxLength = function () {
    var string = textareaElement.value;
    if (string.length > CommentData.MAX_LENGTH) {
      textareaElement.setCustomValidity(CommentData.MAX_LENGTH_MESSAGE);
      return false;
    }
    return true;
  };

  var onSubmitButtonClick = function (evt) {
    if (inputHashtagElement.value !== '') {
      var hashtagArray = inputHashtagElement.value.toLowerCase().split(' ');
      for (var i = 0; i < hashtagArray.length; i++) {
        var isHashtagValid = validateHashtag(hashtagArray[i]);
        if (!isHashtagValid) {
          break;
        }
        var positionNextHashtag = i + 1;
        if (hashtagArray.indexOf(hashtagArray[i], positionNextHashtag) > 0) {
          inputHashtagElement.setCustomValidity(Message.HASHTAG_NO_REPEAT);
          break;
        }
      }
      if (hashtagArray.length > HashtagData.MAX_COUNT) {
        inputHashtagElement.setCustomValidity(Message.HASHTAG_MAX_NUMBER + HashtagData.MAX_COUNT);
      }
    }

    if (!inputHashtagElement.validationMessage) {
      evt.preventDefault();
    }

    if (textareaElement.value !== '') {
      var commentArray = textareaElement.value.toLowerCase().split(' ');
      for (var j = 0; j < commentArray.length; j++) {
        var isCommentValid = checkMaxLength(commentArray[j]);
        if (!isCommentValid) {
          break;
        }
      }
      if (commentArray.length > CommentData.MAX_LENGTH) {
        textareaElement.setCustomValidity(CommentData.MAX_LENGTH_MESSAGE);
      }
    }

    if (!textareaElement.validationMessage) {
      evt.preventDefault();
    }
  };

  var onHashtagInput = function () {
    inputHashtagElement.setCustomValidity('');
  };

  var onCommentInput = function () {
    textareaElement.setCustomValidity('');
  };

  var onSuccess = function () {
    window.utils.hideElement(uploadPopapElement);
    closeUploadOverlay();
  };

  formElement.addEventListener('submit', function (evt) {
    if (onSubmitButtonClick.checkValidity()) {
      window.backend.sendData(new FormData(formElement), onSuccess, window.setup.onRequestError, window.backend.URL_POST);
      evt.preventDefault();
    }
  });

  submitButtonElement.addEventListener('click', onSubmitButtonClick);
  inputHashtagElement.addEventListener('input', onHashtagInput);
  textareaElement.addEventListener('input', onCommentInput);
})();
