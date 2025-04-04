(() => {
  'use strict';

  customElements.define('buttons-row', class extends HTMLElement {

    constructor() {
      super();

      // initialize the things
      // this.buttonRow = this.querySelector('.detail-tabs-row');
      this.buttonRow = document.querySelector('buttons-row');
      this.lat = this.buttonRow.getAttribute('artisan-latitude');
      this.lon = this.buttonRow.getAttribute('artisan-longitude');
      this.buttonRowItems = this.buttonRow.querySelectorAll('.detail-tabs-item');
    }; // end constructor() 
  
     // deal with any kind of 'on...' event
     // referenced below
    handleEvent(event) {
      this[`on${event.type}`](event);
    }; // end handleEvent()
  
    connectedCallback() {
      this.addEventListener('click', this);
      
      // create data about what was clicked
      this.addEventListener('click', (event) => {
        const sourceButtonClicked = {
          sourceData: event.target.getAttribute('source-button'),
          latitude: this.lat,
          longitude: this.lon
        };

        // communicate with panels web component
        this.dispatchEvent(new CustomEvent('toggle-panels', {
          detail: sourceButtonClicked,
          bubbles: true,
          composed: true
        }));
      });
    }; // end connectedCallback()
  
     // different 'on...' events, let's go with 'onclick' as the most common
    onclick(event) {
      // ignore currently active tab
      if (event.target.matches('.detail-tabs-item-active')) return;
  
      this.toggleButtonClasses(event.target);
    }; // end onclick()

    // self explanatory
    toggleButtonClasses (buttonClicked) {
  
      this.buttonRowItems.forEach((button) => {
        if (button.classList.contains('detail-tabs-item-active')) {
          button.classList.remove('detail-tabs-item-active');
        };
      }); // end forEach

      // then add new active class to clicked tab
      buttonClicked.classList.add('detail-tabs-item-active');
  
    }; // end toggleButtonRowItems
  }); // end customElements.define('buttons-row')

  customElements.define('panels-row', class extends HTMLElement {

    constructor() {
      super();
      this.panels = this.querySelectorAll('.detail-panel');
    }; // end constructor() 
  
 
    connectedCallback() {
      this.addEventListener('click', this);

      // have to listen on the whole document to pick up this custom event
      document.addEventListener('toggle-panels', (event) => {

        // build formdata to be sent to server for fetching weather and yelp data
        let geoData = new FormData();
        geoData.append('latitude', event.detail.latitude);
        geoData.append('longitude', event.detail.longitude);

        // send appropriate data for appropriate panel
        switch (event.detail.sourceData) {
          case 'weather':
            this.weatherPanelInit(geoData);
          break;
          case 'dining':
            this.yelpPanelsInit(geoData, 'restaurants');
          break;
          case 'shopping':
            this.yelpPanelsInit(geoData, 'shopping');
          break;
          default:
        };

        // self-explanatory
        this.togglePanelClasses(event.detail);
      });
    }; // end connectedCallback()

    // self-explanatory
    togglePanelClasses (targetPanelData) {
      this.panels.forEach((panel) =>{
        if (panel.classList.contains('detail-panel-active')) {
          panel.classList.remove('detail-panel-active');
        };

        if (panel.getAttribute('target-panel') === targetPanelData.sourceData) {
          panel.classList.add('detail-panel-active');
        };
      }); // end forEach

    }; // end togglePanelClasses

    weatherPanelInit (dataForServer) {

      // fetch OpenWeather data
      // it wasn't until I *stopped* using the headers{} option did the fetch() start to work
      fetch('https://vtbeertrail.com/server/openweather.php', {
        method: 'POST',
        body: dataForServer
      })
      .then(res => {
        return res.text();
      })
      .then(res => {

        let weatherResults = JSON.parse(res);

        this.weatherPanelRender(weatherResults);
      }); // end .then(res)
    }; // end weatherPanelInit()

    weatherPanelRender (weatherResults) {

      let currentContentTarget = this.querySelector('.detail-panel-weather-current');
      let fivedayContentTarget = this.querySelector('.detail-panel-weather-fiveday');
      let currentContent = "";
      let fivedayContent = "";

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

      // current weather render from data build
      currentContent = `
        <h5 class="detail-panel-weather-current-header">Current Weather:</h5>
        <img src="/img/openWeather/${weatherResults.current.weather[0].icon}.png" width="50" height="50">
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
          icons += `<img src="/img/openWeather/${i.icon}.png" width="50" height="50">`;
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
          temps += `<p>Low: ${i.minTemp + '\u00B0'} Hi: ${i.maxTemp  + '\u00B0'}</p>`;
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

    }; // end weatherPanelRender()

    yelpPanelsInit (dataForServer, searchTerm) {

      // add searchterm to formdata because I have to for request to yelp api from server
      dataForServer.append('term', searchTerm);

      // fetch Yelp data
      // it wasn't until I *stopped* using the headers{} option did the fetch() start to work
      fetch('https://vtbeertrail.com/server/yelp.php', {
        method: 'POST',
        body: dataForServer
      })
      .then(res => {
        return res.text();
      })
      .then(res => {
  
        let yelpResults = JSON.parse(res).businesses;

        this.yelpPanelsRender(yelpResults, searchTerm);
      });
    }; // end yelpPanelsInit

    yelpPanelsRender (yelpResults, searchTerm) {
      
      // where to stuff incoming data into the DOM 
      if (searchTerm === 'restaurants') {
        var yelpDataTarget = this.querySelector('[target-panel="dining"]');
      } else { // else it's shopping
        var yelpDataTarget = this.querySelector('[target-panel="shopping"]');
      };

      // initialize
      let yelpContent = "";

      // the response is a single array, each object is a business to display, thus the loop encompassing everything
      yelpResults.forEach((yelpItem) => {

        //if we're to show the review stars, must first assign a string to the number rating
        // yelp is now doing ratings like "3.25", so I'm just taking the low whole number
        let ratingNumber = yelpItem.rating;
        let ratingString = "";
        switch (true) {
          case ratingNumber >= 5:
            ratingString = "five";    
            break;
          case ratingNumber >= 4:
            ratingString = "four";
            break;
          case ratingNumber >= 3:
            ratingString = "three";
            break;
          case ratingNumber >= 2:
            ratingString = "two";
            break;
          case ratingNumber >= 1:
            ratingString = "one";
            break;
          case ratingNumber >= 0:
            ratingString = "zero";
            break;
        };

        // yelp render from data build
        yelpContent = `
          <div class="detail-panel-yelpcard">
            <img src="${yelpItem.image_url}" class="detail-panel-yelpcard-image">
            <div class="detail-panel-yelpcard-meta">
              <p class="detail-panel-yelpcard-meta-name">${yelpItem.name}</p>
              <p class="detail-panel-yelpcard-meta-address">${yelpItem.location.address1}</p>
              <p class="detail-panel-yelpcard-meta-location">${yelpItem.location.city}, ${yelpItem.location.state}  ${yelpItem.location.zip_code}</p>
            </div>
            <div class="detail-panel-yelpcard-yelp">
              <span class="detail-panel-yelpcard-yelp-stars ${ratingString}"></span>
              <p class="detail-panel-yelpcard-yelp-reviews">Reviews: ${yelpItem.review_count}</p>
              <a href="${yelpItem.phone}" class="detail-panel-yelpcard-yelp-phone">${yelpItem.display_phone}</a>
                <a class="detail-panel-yelpcard-yelp-url" href="" target="_blank" rel="noreferrer noopener">Explore On <img src="/img/yelp_fullcolor.png" alt="Yelp Dot Com Page">
              </a>
            </div>
          </div>
        `;

        yelpDataTarget.innerHTML += yelpContent;
      }); // end .forEach
    }; // end yelpPanelsRender()
  }); // end customElements.define('panels-row')

  const detailCheckMarkCheck = {
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
  
        if (idbState) { // current artisan *is* in db
          checkMe.classList.add('detail-action-item-check-selected');
          addText.textContent = 'Already In Your Trail';
        };
      });
    }
  };
  
  const detailTrail = {
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
  
      detailTrail.clickingOnSaveToTrail(artisanObject,detailModalOne,detailModalTwo,addMe,checkMe,addText);
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
            detailTrail.addToTrail(artisanObject);
            
            // swing the congrats modal into action
            detailModalOne.classList.add('detail-modal-open');
            checkMe.classList.add('detail-action-item-check-selected');
            addText.textContent = 'Added To Your Trail';
          };
  
          detailTrail.modalsBoth(detailModalOne, detailModalTwo);
        }); // end localforage .then
      };
    }, // end clicking on add to trail
  
    addToTrail(artisanObject) {
  
      localforage.getItem('artisanIDB')
        .then(function (data) {
          if (data) {
            data.push(artisanObject);
          } else {
            data = []
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

  detailCheckMarkCheck.init();
  detailTrail.init();


})();