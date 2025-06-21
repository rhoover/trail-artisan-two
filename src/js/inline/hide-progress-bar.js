(() => {
  'use strict';

  let bodyElement = document.body;
  let bodyHeight = bodyElement.offsetHeight;
  let windowHeight = window.innerHeight;

  console.log(bodyHeight, windowHeight);

  if (bodyHeight < windowHeight) {
    bodyElement.style.setProperty('--pseudo-color', 'transparent');
  };

})();