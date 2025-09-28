function initMap() {

  async function getArtisans() {
    const response = await fetch('/all-artisan-data/all-artisan-data.json');
    const artisanData = await response.json();
    return artisanData;
  };

  async function handleArtisans() {

    let artisans = await getArtisans();
    let map, marker, count;
    let infoWindow = new google.maps.InfoWindow({});
    let markers = [];

    // initialize each artisan type
    let brewersArray = [];
    let distillersArray = [];
    let winesArray = [];
    let cheesesArray = [];
    let cidersArray = [];
    // initialize the big one
    let bigArray = [];

    // loop through to create the artisan type arrays
    for (let i = 0; i < artisans.length; i++) {
      switch(artisans[i].artisanType) {
        case 'brewers':
          brewersArray.push(artisans[i]);
        break;
        case 'distillers':
          distillersArray.push(artisans[i]);
        break;
        case 'wines':
          winesArray.push(artisans[i]);
        break;
        case 'cheeses':
          cheesesArray.push(artisans[i]);
        break;
        case 'ciders':
          cidersArray.push(artisans[i]);
        break;
      };      
    }; // end for

    // bring each regional array into a state-wide bigArray in the same order as the buttons on the page
    bigArray.push(
      brewersArray,
      cidersArray,
      winesArray,
      distillersArray,
      cheesesArray,
    );

    // sort each array inside bigArray by selector
    bigArray.forEach((currentArray) => {
      currentArray.sort(function(a,b) {
        if (a.selector < b.selector)
          return -1
        if (a.selector > b.selector)
          return 1
        return 0
      });
    });

    // loop through the big array of artisan-type arrays to put together everything google needs
    // to have four maps on one page in the same <section>
    for (let i = 0; i < bigArray.length; i++) {
      // by establishing a different mapTarget on each iteration, we are creating a different map/mapTarget for each <div id="mapX">
      const mapTarget = document.getElementById('map' + i);
      const mapOptions = {
        center: {lat: 44.0407, lng: -72.7093},
        zoom: 7,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.TOP_CENTER
        },
        zoomControl: true,
        streetViewControl: true,
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
      };

      // initialize the custom control
      function createListControl() {
        const controlButton = document.createElement("input");
        controlButton.type = 'button';
        controlButton.value = 'Browse List';
        // Set CSS for the control.
        controlButton.style.backgroundColor = "rgb(250,250,250)";
        controlButton.style.border = "1px solid #7483d0";
        controlButton.style.borderRadius = "0.15rem";
        // controlButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
        controlButton.style.color = "rgb(25,25,25)";
        controlButton.style.cursor = "pointer";
        controlButton.style.fontFamily = "assistantLight, Roboto,Arial,sans-serif";
        controlButton.style.fontSize = "16px";
        controlButton.style.lineHeight = "38px";
        controlButton.style.margin = "8px 0 22px 8px";
        controlButton.style.padding = "3px 10px";
        controlButton.style.textAlign = "center";
        // controlButton.textContent = "&#2190 Browse List";
        controlButton.title = "Click To See A List";

        // event listener for clicking on the custom control, to access the DOM outside the map
        controlButton.addEventListener('click', () => {
          let currentPanel = mapTarget.parentElement;
          currentPanel.classList.toggle('maps-artisans-panel-open');
          if (controlButton.value == 'Browse List') {
            controlButton.value = 'Close List';
          } else {
            controlButton.value = 'Browse List';
          };
        });

        return controlButton;
      };

      // create new map on each trip through
      map = new google.maps.Map(mapTarget, mapOptions);

      // now that each map has been defined, add the custom control to each one
      // Create the DIV to hold the control.
      const centerListDiv = document.createElement("div");
      // Create the control.
      const centerControl = createListControl();

      // Append the control to the DIV.
      centerListDiv.appendChild(centerControl);
      map.controls[google.maps.ControlPosition.LEFT_CENTER].push(centerListDiv);

      // inner for...loop to go through each regional array
      for (let j = 0; j < bigArray[i].length; j++) {

        //create content for infowindow
        let artisanObject = bigArray[i][j];

        function windowContent() {

          var content = document.createElement('div');
          content.setAttribute('class', 'artisan-map-infoslider');

          content.innerHTML = `
              <div class="artisan-map-infoslider-image">
                <img src="${artisanObject.logo100}" alt="${artisanObject.name} Logo" />
            </div>
            <div class="artisan-map-infoslider-details">
              <p class="artisan-map-infoslider-name">${artisanObject.name}</p>
              <p class="artisan-map-infoslider-address">${artisanObject.address}</p>
              <p class="artisan-map-infoslider-address">${artisanObject.city}, VT</p>
              <a class="artisan-map-infoslider-link" href="/artisans/${artisanObject.artisanType}/${artisanObject.selector}">View Artisan Details</a>
              <button class="artisan-map-infoslider-button">Add To Your Trail</button>
            </div>`; //don't delete this back-tick!

            return content;
        }; // end windowContent function

        // create markers for each of the maps
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(
            artisanObject.latitude,
            artisanObject.longitude
          ),
          map:map,
          icon: {url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"},
          title: `Artisan Info: ${artisanObject.name}`
        });
        markers.push(marker);

        // then add listener for click on marker to pop up info window
        let markerCount = [i][j];

        google.maps.event.addListener(marker, 'click',
          (function (marker, markerCount) {
            return function () {

              // infoWindow stuff
              infoWindow.setContent(windowContent(
                artisanObject.name,
                artisanObject.address,
                artisanObject.city,
                artisanObject.selector,
                artisanObject.logo100
              ));
              infoWindow.open(map, marker);

              // add-to-trail stuff
              // grab the save to trail button
              let addToTrailButton = infoWindow.content.querySelector('.artisan-map-infoslider-button');
              addToTrailButton.addEventListener('click', addFunction);

              function addFunction() {
                let IDBState = null;
                localforage.getItem('artisanIDB')
                .then(function(idbData) {

                  if (idbData) {
                    
                    // use the selector to find the matching object from the idb
                    IDBState = idbData.find(artisan => artisan.selector === artisanObject.selector);          
                  };

                  if (IDBState) {

                    infoWindow.setContent(`${artisanObject.name} Is Already Part Of Your Trail!`);

                  } else {
                    localforage.getItem('artisanIDB')
                      .then(function (data) {

                        if (data) {
                          data.push(artisanObject);
                        } else {
                          data = []
                          data.push(artisanObject);
                        };

                        localforage.setItem('artisanIDB', data);

                        infoWindow.setContent(`You've added ${artisanObject.name} To Your Trail!`);
                      }); // end localforage .then
                    }; // end else
                }); // end localforage .then
              };
            }; // end google maps return
          })(marker, markerCount),{passive:true});

        // get the list div above the map div
        let currentList = mapTarget.previousElementSibling;

        // create the list of artisans
        currentList.innerHTML += `
          <div class="maps-artisans-list-item">
            <span class="maps-artisans-list-item-logo ${artisanObject.selector}"></span>
            <p class="maps-artisans-list-item-name">${artisanObject.name}</p>
            <p class="maps-artisans-list-item-city">${artisanObject.city}</p>
          </div>
        `;

      };// end inner(j) for..loop (j)
    }; //end bigArray(i) for loop (i)

    // get all the list items that have been presorted and generated
    let allListItems = document.querySelectorAll('.maps-artisans-list-item');

    // attach a specific marker (also pre-sorted and generated) click event to each specific list item
    for (let i = 0; i < allListItems.length; i++) {

      allListItems[i].addEventListener('click', mapStuff);

      function mapStuff() {

        // triggers the infoWindow for each marker by clikcking in the list
        google.maps.event.trigger(markers[i], 'click');

        // re-centers the map on selected marker, in theory
        map.panTo({lat:markers[i].getPosition().lat(), lng:markers[i].getPosition().lng()});

      }; // end mapStuff
    }; // end for loop
  }; // end handleArtisans

  handleArtisans();

}; // end initMap

initMap();