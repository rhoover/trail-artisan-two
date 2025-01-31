(() => {
  'use strict';

  localforage.config({
    name: 'vtArtisanTrail',
    storeName: 'artisanIDB',
    description: 'IndexedDB Storage of Artisan Trail Choices'
  });

})();