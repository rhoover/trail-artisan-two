function initMap() {

  let artisanData = document.querySelector('[data-type]')
  let artisanType = artisanData.dataset.type;
  let fileToFetch = '/artisan-types-data/' + artisanType + '.json';

  async function getArtisans() {
    const response = await fetch(fileToFetch);
    const artisanData = await response.json();
    return artisanData;
  };

  async function handleArtisans() {

    let artisans = await getArtisans();

    // initial needed stuff for Google
    let map, marker, i;
    // let infoWindow = new google.maps.InfoWindow({});
    let markers = [];
    const mapTarget = document.querySelector('#map');
    const mapOptions = {
      center: {lat: 44.0407, lng: -72.7093},
      zoom: 8,
      mapTypeControl: true,
      mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      },
      zoomControl: true,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      //styles courtesy: https://snazzymaps.com/style/61/blue-essence
      styles:[
        {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#e0efef"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "hue": "#1900ff"
                },
                {
                    "color": "#c0e8e8"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 100
                },
                {
                    "color": "#667700"
                  },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "lightness": 700
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#7dcdcd"
                }
            ]
        }
      ]
    }; // end mapOptions
      
    map = new google.maps.Map(mapTarget, mapOptions);
    // initialize marker popup thing and variables
    let infowindow = new google.maps.InfoWindow({});

    // loop through all the artisans...
    for(i = 0; i < artisans.length; i++) {

      let artisanObject = artisans[i];

      function windowContent() {
        var content = document.createElement('div');
        content.setAttribute('class', 'artisan-map-infoslider');

        content.innerHTML = `
          <div class="artisan-map-infoslider-image">
            <img src="${artisanObject.logo100}" alt="${artisanObject.selector}-logo" alt="${artisanObject.name} Logo" />
          </div>
          <div class="artisan-map-infoslider-details">
            <p class="artisan-map-infoslider-name">${artisanObject.name}</p>
            <p class="artisan-map-infoslider-address">${artisanObject.address}</p>
            <p class="artisan-map-infoslider-address">${artisanObject.city}", VT</p>
            <a class="artisan-map-infoslider-link" href="/${artisanObject.artisanType}/${artisanObject.selector}">View Artisan Details</a>
          </div>
          ` ; // don't delete this back-tick!
          return content;
      } // end windowContent function

      // to create each marker...
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(artisanObject.latitude, artisanObject.longitude),
        map: map,
        icon: {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"},
        // title: `Artisan Info: ${artisans[i].name}`
        title: `Artisan Info: ${artisanObject.name}`
      });

      // then add listener for click to pop up info window
      google.maps.event.addListener(marker, 'click', (function (marker) {
        return function () {
          infowindow.setContent(windowContent(
            artisanObject.name,
            artisanObject.address,
            artisanObject.city,
            artisanObject.selector,
            artisanObject.logo100
          ));
          infowindow.open(map, marker);
        }
      })(marker), {passive: true});
    }; // end for loop
    
  };

  handleArtisans();
}; // end initMap

initMap();