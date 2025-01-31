(() => {
  'use strict';

  const topNavElement = document.querySelector('.nav');
  // nav item containing sub-list
  const listsNavItem = document.querySelector('[data-accordian]');
  // sub-list
  const listsNavSubItem = document.querySelector('.nav-item-content');
  // icon toggler
  const NavItemIcon = document.querySelector('.nav-item-icon');

  listsNavItem.addEventListener('click', toggleClass);

  function toggleClass() {
    // dealing with visibility
    listsNavSubItem.classList.toggle('nav-item-content-active');
    // rotate the plus icon
    NavItemIcon.classList.toggle('nav-item-icon-toggled');

    // has the style been applied?
    let styleExists = listsNavSubItem.hasAttribute('style');

    if (styleExists) {
      listsNavSubItem.removeAttribute('style');
    } else {
      // get width of nav element so as to move sub-list exactly that amount/number
      let topNavElementWidth = topNavElement.offsetWidth;
      listsNavSubItem.style.transform = `translateX(${topNavElementWidth}px)`;      
    };
  };

})();