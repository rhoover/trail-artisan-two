var nsg = require('node-sprite-generator');

nsg({
    src: [
      'src/img/artisans-logos/brewers/logo100/*.png',
    'src/img/artisans-logos/cheeses/logo100/*.png', 
    'src/img/artisans-logos/ciders/logo100/*.png', 
    'src/img/artisans-logos/distillers/logo100/*.png', 
    'src/img/artisans-logos/wines/logo100/*.png'
  ],
    spritePath: 'src/img/sprites/artisans-list-sprite.png',
    stylesheetPath: 'src/sass/sprites/_artisans-list-sprite.scss',
    layout: 'packed',
    layoutOptions: {
      padding: 5
    },
    stylesheet: 'css',
    stylesheetOptions: {
      prefix: '',
      spritePath: '/img/sprites/artisans-list-sprite.png'
    },
    compositor: "jimp"
});
