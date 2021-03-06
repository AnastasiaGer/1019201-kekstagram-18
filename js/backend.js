'use strict';

(function () {

  var STATUS_SUCCESS = 200;

  var makeXHR = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_SUCCESS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000;

    return xhr;
  };

  window.backend = {
    load: function (onSuccess, onError, url) {
      var xhr = makeXHR(onSuccess, onError);
      xhr.open('GET', url);
      xhr.send();
    },
    save: function (data, onSuccess, onError, url) {
      var xhr = makeXHR(onSuccess, onError);
      xhr.open('POST', url);
      xhr.send(data);
    }
  };
})();
