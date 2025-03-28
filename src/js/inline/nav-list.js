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
      // get width of sub-menu element so as to move exactly that amount/number
      let subMenuWidth = listsNavSubItem.offsetWidth;
      // move baby     
      listsNavSubItem.style.transform = `translateX(-${subMenuWidth}px)`;      
    };
  };

})();