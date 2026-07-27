var nsg = require('node-sprite-generator');

nsg({
    src: ['src/img/artisans-logos/cider/logo100/*.png'],
    spritePath: 'src/img/sprites/ciders-list-sprite.png',
    stylesheetPath: 'src/sass/sprites/_ciders-list-sprite.scss',
    layout: 'packed',
    layoutOptions: {
      padding: 5
    },
    stylesheet: 'css',
    stylesheetOptions: {
      prefix: '',
      spritePath: '/img/sprites/ciders-list-sprite.png'
    },
    compositor: "jimp"
});
