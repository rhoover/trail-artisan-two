var nsg = require('node-sprite-generator');

nsg({
    src: ['src/img/artisans-logos/wine/logo100/*.png'],
    spritePath: 'src/img/sprites/wines-list-sprite.png',
    stylesheetPath: 'src/sass/sprites/_wines-list-sprite.scss',
    layout: 'packed',
    layoutOptions: {
      padding: 5
    },
    stylesheet: 'css',
    stylesheetOptions: {
      prefix: '',
      spritePath: '/img/sprites/wines-list-sprite.png'
    },
    compositor: "jimp"
});
