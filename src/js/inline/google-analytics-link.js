// Courtesy: https://constantsolutions.dk/2020/06/delay-loading-of-google-analytics-google-tag-manager-script-for-better-pagespeed-score-and-initial-load/
// but modified to reflect Google's new syntax

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    /** init gtm after 3500 milliseconds - this could be adjusted */
    setTimeout(initGTM, 3500);
  });

  document.addEventListener('scroll', initGTMOnEvent);
  document.addEventListener('mousemove', initGTMOnEvent);
  document.addEventListener('touchstart', initGTMOnEvent);

  function initGTMOnEvent(event) {
    initGTM();
    event.currentTarget.removeEventListener(event.type, initGTMOnEvent); // remove the event listener that got triggered
  };

  function initGTM() {
    if (window.gtmDidInit) {
      return false;
    };

    window.gtmDidInit = true; // flag to ensure script does not get added to DOM more than once.

    const script = document.createElement('script');
    script.async = true;
    script.id = 'analytics'
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-L213SBPLTW';
    document.body.appendChild(script);

  };

})();