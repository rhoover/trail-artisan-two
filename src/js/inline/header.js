(() => {
  'use strict';

  const header = document.querySelector('header');
  const mainElement = document.querySelector('main');
  const mainElementPosition = mainElement.offsetTop;

  window.addEventListener('scroll', () => {
    var scrollPos = window.scrollY;
    if (scrollPos >= mainElementPosition) {
      header.style.backgroundColor = 'rgba(240,240,240,0.75)';
    } else {
      header.removeAttribute('style');
    }

  });


})();