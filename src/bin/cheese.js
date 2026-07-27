var nsg = require('node-sprite-generator');

nsg({
    src: ['src/img/artisans-logos/cheese/logo100/*.png'],
    spritePath: 'src/img/sprites/cheese-list-sprite.png',
    stylesheetPath: 'src/sass/sprites/_cheese-list-sprite.scss',
    layout: 'packed',
    layoutOptions: {
      padding: 5
    },
    stylesheet: 'css',
    stylesheetOptions: {
      prefix: '',
      spritePath: '/img/sprites/cheese-list-sprite.png'
    },
    compositor: "jimp"
});
