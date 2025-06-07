var nsg = require('node-sprite-generator');

nsg({
    src: ['src/img/artisans-logos/booze/logo100/*.png'],
    spritePath: 'src/img/sprites/distillers-list-sprite.png',
    stylesheetPath: 'src/sass/sprites/_distillers-list-sprite.scss',
    layout: 'packed',
    layoutOptions: {
      padding: 5
    },
    stylesheet: 'css',
    stylesheetOptions: {
      prefix: '',
      spritePath: '/img/sprites/distillers-list-sprite.png'
    },
    compositor: "jimp"
});
