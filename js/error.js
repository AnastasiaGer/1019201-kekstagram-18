'use strict';

(function () {
  var mainElement = document.querySelector('main');
  var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
  var uploadPopapElement = document.querySelector('.img-upload__overlay');
  var uploadErrorElement = errorMessageTemplate.cloneNode(true);

  var closeRequestError = function () {
    uploadErrorElement.remove();
    document.removeEventListener('keydown', onDocumentBodyKeydown);
    document.removeEventListener('click', onBtnCloseOnRequestErrorClick);
    document.removeEventListener('click', onDocumentBodyClick);
  };

  var onDocumentBodyClick = function () {
    closeRequestError();
  };

  var onDocumentBodyKeydown = function (evt) {
    window.utils.performCallbackIfKeydownEsc(evt, closeRequestError);
  };
  var SAVE_URL = 'https://js.dump.academy/kekstagram';
  var onBtnCloseOnRequestErrorClick = function () {
    if (window.backend.save(new FormData(window.form.formElement), window.success.onSuccess, window.error.onRequestError, SAVE_URL)) {
      closeRequestError();
    }
    window.form.formElement.reset();
  };

  var onRequestError = function () {
    window.utils.hideElement(uploadPopapElement);
    mainElement.appendChild(uploadErrorElement);

    uploadErrorElement.querySelector('.error__button').addEventListener('click', onBtnCloseOnRequestErrorClick);
    document.body.addEventListener('click', onDocumentBodyClick);
    document.addEventListener('keydown', onDocumentBodyKeydown);
  };

  window.error = {
    onRequestError: onRequestError
  };

})();
