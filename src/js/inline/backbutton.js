(() => {
  'use strict';

  var backButton = document.querySelector('.back-button');

  // history.length is always 1 or 2 when landing on site for first time
  if (history.length > 2) {
    backButton.classList.add('back-button-active');
  };

  backButton.onclick = function () {
    history.back();
  };

})();