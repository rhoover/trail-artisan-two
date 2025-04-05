(() => {
  'use strict';

  var backButton = document.querySelector('.back-button');

  // history.length is always 1 or 2 when landing on site for first time
  // it will be 2 if landing on site for the first time from URL in a new tab
  if (document.referrer == '' && history.length == 2) {
    return;
  // it will be 1 if site was landed upon for the first time from a link somewhere else
  } else if (history.length == 1) {
    return;
  // when both the above are false, show the back button
  } else {
    backButton.classList.add('back-button-active');
  };

  backButton.onclick = function () {
    history.back();
  };

})();