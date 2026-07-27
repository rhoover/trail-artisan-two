(() => {
'use strict';

const shareButton = document.querySelector(".detail-thirdparty-share");
const pageURL = document.querySelector("link[rel=canonical]");
const pageTitle = document.title;

  if (navigator.share) {
    shareButton.style.display = 'block';
    
    shareButton.addEventListener('click', shareStuff);
    function shareStuff() {
      navigator.share({
        title: pageTitle,
        url: pageURL.href
      })
    };
  };

})();