
function initMap() {
    
  let map;
  let marker;

  let artisanCoords = document.querySelector('[data-lat][data-lon]');
  let artisanLat = Number(artisanCoords.dataset.lat);
  let artisanLon = Number(artisanCoords.dataset.lon);
  let artisanName = artisanCoords.dataset.name;
    

  //initial needed stuff for Google
  const mapTarget = document.getElementById('map');
  const mapOptions = {
    center: new google.maps.LatLng(artisanLat, artisanLon),
    zoom: 12,
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
  }
  map = new google.maps.Map(mapTarget, mapOptions);

  marker = new google.maps.Marker({
    position: new google.maps.LatLng(artisanLat, artisanLon),
    map: map,
    icon: {url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"},
    title: `Artisan Info: ${artisanName}`
  });
  
  let contentString =
    `<div class="artisan-map-infoslider">
        <div class="artisan-map-infoslider-image">
            <img src="/img/artisans-logos/{{ artisan.artisanType }}/logo100/{{artisan.selector}}.png" alt="{{ artisan.name }}Logo"/>
        </div>
        <div class="artisan-map-infoslider-details">
            <p class="artisan-map-infoslider-name">{{ artisan.name }}</p>
            <p class="artisan-map-infoslider-address">{{ artisan.address }}</p>
            <p class="artisan-map-infoslider-address">{{ artisan.city }}, VT</p>
        </div>
    </div>`

  let infowindow = new google.maps.InfoWindow({
    content: contentString,
  });

  // open infowindow on page load
  infowindow.open({
    anchor: marker,
    map,
    shouldFocus: false,
  });

  // open infowindow on click
  marker.addListener('click', () => {
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
  });
}; //end mapInit