(() => {
'use strict';

const tabs = {

  init() {

    // turn string in details element to js object to collect geoData and stuff
    let artisanObject = JSON.parse(document.querySelector('#detailData').textContent);
    let lat = artisanObject.latitude;
    let lon = artisanObject.longitude;

    // build formdata to be sent to server for fetching weather and yelp data
    let geoData = new FormData();
    geoData.append('latitude', lat);
    geoData.append('longitude', lon);

    // get  tab row element to send down
    let tabRow = document.querySelector('.detail-tabs-row');

    // get panel elements to send down
    let detailPanels = document.querySelectorAll('.detail-panel');

    // clicking on a tab will bubble up to row, so only one listener is necessary
    // and send to adjust classes of items
    tabRow.addEventListener('click', (event) => {

      tabs.initializePanels(event.target.dataset.source, geoData);

      tabs.adjustClasses(event.target, tabRow, detailPanels);
    });
  }, // end init

  initializePanels(clickedTab, geoData) {

    switch (clickedTab) {
      case 'weather-tab':
        tabs.weatherPanel(geoData);
      break;
      case 'dining-tab':
        tabs.yelpPanels(geoData, 'restaurants');
      break;
      case 'shopping-tab':
        tabs.yelpPanels(geoData, 'shopping');
      break;
      default:
    }
  }, // end initialize panels

  adjustClasses(clickedTab, tabRow, detailPanels) {

    // first remove any active classes for each tab from a previous click
    let tabItems = tabRow.querySelectorAll('.detail-tabs-item');
    tabItems.forEach((tab) => {
      tab.classList.remove('detail-tabs-item-active');
    });

    // then add active class to clicked tab
    clickedTab.classList.add('detail-tabs-item-active');

    detailPanels.forEach((panel) => {

      // remove any active classes for each panel from a previous click
      if (panel.classList.contains('detail-panel-active')) {
        document.startViewTransition ?
        document.startViewTransition(() => panel.classList.remove('detail-panel-active')) :
        panel.classList.remove('detail-panel-active');
      };

      // add active classe to panel
      if (panel.dataset.target == clickedTab.dataset.source) {
        document.startViewTransition ?
        document.startViewTransition(() => panel.classList.add('detail-panel-active')) :
        document.startViewTransition(() => panel.classList.add('detail-panel-active'));
      };
    }); // end forEach
  }, // end adjust classes

  weatherPanel(geoData) {

    // get targets elements and initialize content
    let currentContentTarget = document.querySelector('.detail-panel-weather-current');
    let fivedayContentTarget = document.querySelector('.detail-panel-weather-fiveday');
    let currentContent = "";
    let fivedayContent = "";

    // fetch, manipulate and render OpenWeather data
    // it wasn't until I *stopped* using the headers{} option did the fetch() start to work
    fetch('https://vtbeertrail.com/server/openweather.php', {
      method: 'POST',
      body: geoData
    })
    .then(res => {
      return res.text();
    })
    .then(res => {

      let weatherResults = JSON.parse(res);

      //get next five days data, all of it
      let daily = weatherResults.daily.slice(1, 6);

      //initialize days of week, as .dt returns an integer
      let dayOfWeek = {0:"Sun",1:"Mon",2:"Tue",3:"Wed",4:"Thu",5: "Fri",6: "Sat"};

      //initialize five-day forecast array
      let fiveDayForecast = [];

      // let'er rip to create the five-day forecast array
      for (let i = 0; i < daily.length; i++) {
        let dailyWeatherObj = {};
        let dayNum = new Date(daily[i].dt * 1000).getDay();
        dailyWeatherObj['minTemp'] = Math.round(daily[i].temp.min);
        dailyWeatherObj['maxTemp'] = Math.round(daily[i].temp.max);
        dailyWeatherObj['icon'] = daily[i].weather[0].icon;
        dailyWeatherObj['desc'] = daily[i].weather[0].main;
        dailyWeatherObj['day'] = dayOfWeek[dayNum];
        fiveDayForecast.push(dailyWeatherObj);
      };

      // current weather display from data build
      currentContent = `
        <h5 class="detail-panel-weather-current-header">Current Weather:</h5>
        <img src="/img/openWeather/${weatherResults.current.weather[0].icon}.png" width="50" height="50" alt="Weather Icon">
        <p class="desc">${weatherResults.current.weather[0].description.replace(/\b\w/g, (c) => c.toUpperCase())}</p>
        <p class="current">${Math.round(weatherResults.daily[0].temp.day) + '\u00B0'}</p>
        <p class="min">Min. Temp:<br />${Math.round(weatherResults.daily[0].temp.min) + '\u00B0'}</p>
        <p class="max">Max. Temp:<br />${Math.round(weatherResults.daily[0].temp.max) + '\u00B0'}</p>
        <p class="precip">Precip Chance:<br />${weatherResults.daily[0].pop * 100 + '\u0025'}</p>
      `; // end current content
      currentContentTarget.innerHTML = currentContent;

      // because the five day forcast is an array, to get the data into a template literal
      // I must run a function for each div in the card: days, icons, descriptions, temps
      // each output is called in the literal
      function fiveDays() {
        let days = "";
        fiveDayForecast.forEach((i) => {
          days += `<p>${i.day}</p>`;
        });
        return days;
      };
      function fiveIcons() {
        let icons = "";
        fiveDayForecast.forEach((i) => {
          icons += `<img src="/img/openWeather/${i.icon}.png" width="50" height="50" alt="Weathder Icon">`;
        });
        return icons;
      };
      function fiveDescriptions() {
        let desc = "";
        fiveDayForecast.forEach((i) => {
          desc += `<p>${i.desc}</p>`;
        });
        return desc;
      };
      function fiveTemps() {
        let temps = "";
        fiveDayForecast.forEach((i) => {
          temps += `<p>Low: ${i.minTemp + '\u00B0'}<br />Hi: ${i.maxTemp  + '\u00B0'}</p>`;
        });
        return temps;
      };

      // five-day forecast weather display from data build
      // super simple as all the legwork has been done just above
      fivedayContent = `
        <h5 class="detail-panel-weather-fiveday-header">5 Day Forecast</h5>
        <div class="detail-panel-weather-fiveday-days">${fiveDays()}</div>
        <div class="detail-panel-weather-fiveday-icons">${fiveIcons()}</div>
        <div class="detail-panel-weather-fiveday-desc">${fiveDescriptions()}</div>
        <div class="detail-panel-weather-fiveday-temps">${fiveTemps()}</div>
      `;
      fivedayContentTarget.innerHTML = fivedayContent;
    }); // end .then
  }, // end weather panel

  yelpPanels(geoData, searchTerm) {

    // add this to formdata because I have to for request to yelp api from server
    geoData.append('term', searchTerm)

    // fetch, manipulate and render Yelp data
    // it wasn't until I *stopped* using the headers{} option did the fetch() start to work
    fetch('https://vtbeertrail.com/server/yelp.php', {
      method: 'POST',
      body: geoData
    })
    .then(res => {
      return res.text();
    })
    .then(res => {

      let yelpResults = JSON.parse(res).businesses;

      // where to stuff incoming data into the DOM 
      if (searchTerm === 'restaurants') {
        var yelpDataTarget = document.querySelector('[data-target="dining-tab"]');
      } else { // else it's shopping
        var yelpDataTarget = document.querySelector('[data-target="shopping-tab"]');
      }

      // the response is a single array, each object is a business to display, thus the loop encompassing everything
      let yelpContent = "";
      yelpResults.forEach((yelpItem) => {

        //if we're to show the review stars, must first assign a string to the number rating
        let ratingNumber = yelpItem.rating;
        let ratingString = ""
          switch (ratingNumber) {
            case 5:
              ratingString = "five";
              break;
            case 4.5:
              ratingString = "four-half";
              break;
            case 4:
              ratingString = "four";
              break;
            case 3.5:
              ratingString = "three-half";
              break;
            case 3:
              ratingString = "three";
              break;
            case 2.5:
              ratingString = "two-half";
              break;
            case 2:
              ratingString = "two";
              break;
            case 1.5:
              ratingString = "one-half";
              break;
            case 1:
              ratingString = "one";
              break;
            case 0:
              ratingString = "zero";
              break;
          }; // end switch

          // yelp display from data build
          yelpContent = `
            <div class="detail-panel-yelpcard">
              <img src="${yelpItem.image_url}" class="detail-panel-yelpcard-image" alt="Business Image">
              <div class="detail-panel-yelpcard-meta">
                <p class="detail-panel-yelpcard-meta-name">${yelpItem.name}</p>
                <p class="detail-panel-yelpcard-meta-address">${yelpItem.location.address1}</p>
                <p class="detail-panel-yelpcard-meta-location">${yelpItem.location.city}, ${yelpItem.location.state}  ${yelpItem.location.zip_code}</p>
              </div>
              <div class="detail-panel-yelpcard-yelp">
                <span class="detail-panel-yelpcard-yelp-stars ${ratingString}"></span>
                <p class="detail-panel-yelpcard-yelp-reviews">Reviews: ${yelpItem.review_count}</p>
                <a href="${yelpItem.phone}" class="detail-panel-yelpcard-yelp-phone">${yelpItem.display_phone}</a>
                  <a class="detail-panel-yelpcard-yelp-url" href="${yelpItem.url}" target="_blank" rel="noreferrer noopener">Explore On <img src="/img/yelp_fullcolor.png" alt="Yelp Dot Com Logo" alt="Yelp Logo Icon">
                </a>
              </div>
            </div>
          `;

          yelpDataTarget.innerHTML += yelpContent;
        }); // end .forEach
    }); // end .then
  } // end yelp panels
}; // end detailTabs

const checkMarkCheck = {
  init() {

    // gather up all the things
    let addText = document.querySelector('.detail-action-item-bigtext');
    let checkMe = document.querySelector('.detail-action-item-check');
    let idbState = null;

    // change details text into json
    let artisanObject = JSON.parse(document.querySelector('#detailData').textContent);

    localforage.getItem('artisanIDB')
    .then(function(idb) {

      if (idb) {
        idbState = idb.find(artisan => artisan.selector === artisanObject.selector);
      };

      if (idbState) { // current dispensary *is* in db
        
        checkMe.classList.add('detail-action-item-check-selected');
        addText.textContent = 'Already In Your Trail';
      };
    });
  }
};

const trail = {
  init() {

    // turn string in details element to js object
    let artisanObject = JSON.parse(document.querySelector('#detailData').textContent);

    // grabbing the modals and her parent
    let detailModalOne = document.querySelector('.detail-modal');
    let detailModalTwo = document.querySelector( '.detail-modaltwo');

    // grab add to trail button
    let addMe = document.querySelector('[data-add]');

    // grab check mark on add to trail button
    let checkMe = document.querySelector('.detail-action-item-check');

    // grab add button text
    let addText = document.querySelector('.detail-action-item-bigtext');

    trail.clickingOnSaveToTrail(artisanObject,detailModalOne,detailModalTwo,addMe,checkMe,addText);
  }, // end init

  clickingOnSaveToTrail(artisanObject,detailModalOne,detailModalTwo,addMe,checkMe,addText) {

    addMe.addEventListener('click', addFunction, true);

    // click button to save to trail
    function addFunction() {

      let IdbState = null;

      localforage.getItem('artisanIDB')
      .then(function(idbData) {

        if (idbData) {
          // use the selector to find the matching object from the idb
          IdbState = idbData.find(artisan => artisan.selector === artisanObject.selector);          
        }

        // if it's already in the idb, say so, otherwise send it down to add
        if (IdbState) { // true, it's already in there
          // swing the it's already there stupid modal into action
          detailModalTwo.classList.add('detail-modaltwo-open');
          checkMe.classList.add('detail-action-item-check-selected');
        } else { // false, it needs to be added

          // send object off to be added to idb
          trail.addToTrail(artisanObject);
          
          // swing the congrats modal into action
          detailModalOne.classList.add('detail-modal-open');
          checkMe.classList.add('detail-action-item-check-selected');
          addText.textContent = 'Added To Your Trail';
        };

        trail.modalsBoth(detailModalOne, detailModalTwo);
      }); // end localforage .then
    };
  }, // end clicking on add to trail

  addToTrail(artisanObject) {

    localforage.getItem('artisanIDB')
      .then(function (data) {
        if (data) {
          data.push(artisanObject);
        } else {
          data = [];
          data.push(artisanObject);
        };
        localforage.setItem('artisanIDB', data);
      });
  }, // end add to trail

  modalsBoth(detailModalOne, detailModalTwo) {

    // click to move off screen
    detailModalOne.addEventListener('click', moveOne, true);
    function moveOne(event) {
      let moveMeOne = event.target.closest('.detail-modal');
      moveMeOne.classList.remove('detail-modal-open');
    };

    // click to move off screen
    detailModalTwo.addEventListener('click', moveTwo, true);
    function moveTwo(event) {
      let moveMeTwo = event.target.closest('.detail-modaltwo');
      moveMeTwo.classList.remove('detail-modaltwo-open');      
    };
  }, // end modalsBoth
}; // end detailTrail

tabs.init();
checkMarkCheck.init();
trail.init();
})();