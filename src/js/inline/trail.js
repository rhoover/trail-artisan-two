(async () => {
  'use strict';

  /////////////
  // this is a different pattern than before, as I needed the all-artisan-json in the "global" space
  // for this page, but not the true global space of javascript
  // this was accomplished with this async pattern, above and right here
  // thanks: https://stackoverflow.com/questions/72389096/how-to-store-the-json-data-from-fetch-api-request-into-a-global-variable-javas
  ///////////////
  const dataFetch = async () => {
    const response = await fetch('/all-artisan-data/all-artisan-data.json');
    const remoteData = await response.json();
    return remoteData;
  };
  let remoteJSON = await dataFetch();

  const trailTabs = {

    init() {

      // show chosen panel as active upon entering page
      let chosenPanel = document.querySelector('[data-target="chosen-tab"]');
      chosenPanel.classList.add('trail-panel-active');

      // show chosen tab as active upon entering page
      let chosenTab = document.querySelector('[data-source="chosen-tab"]');
      chosenTab.classList.add('trail-tabs-item-active');
      

      // refresh page upon returning to reflect additions
      let yourTrailTab = document.querySelector('[data-source="chosen-tab"]');
      yourTrailTab.addEventListener('click', () => {
        window.location.replace(window.location.href);
      });

      // gathering our content to manipulate
      let tabRow = document.querySelector('.trail-tabs-row');
      let trailPanels = document.querySelectorAll('.trail-panel');

      // send info to be changed on click
      tabRow.addEventListener('click', (event) => {
        trailTabs.adjustClasses(event.target, tabRow, trailPanels);
      });

    }, // end init

    adjustClasses(clickedTab, tabRow, trailPanels) {

      // first remove any active classes for each tab from a previous click
      // then add active class
      let tabItems = tabRow.querySelectorAll('.trail-tabs-item');
      tabItems.forEach((tab) => {
        tab.classList.remove('trail-tabs-item-active');
      });
      clickedTab.classList.add('trail-tabs-item-active');

      // first remove any active classes for each panel from a previous click
      // then add active class to appropriate panel now active
      trailPanels.forEach((panel) => {
        if (panel.dataset.target == clickedTab.dataset.source) {
          panel.classList.add('trail-panel-active');
        } else {
          panel.classList.remove('trail-panel-active');
        };
      });
    },
  }; // end trailTabs

  const listChoose = {

    init(remoteJSON) {

      // initialize all the DOM elements
      let artisanChoose = document.querySelector('.trail-list-choose');
      let chooseButtons = document.querySelectorAll('.trail-list-choose-button');
      let listSection = document.querySelector('.trail-lists');

      artisanChoose.addEventListener('click', buttonChoose, true);

      function buttonChoose(event) {

        let chosenButton = event.target;

        // make button active or not active, depending
        chooseButtons.forEach(button => {

          if (button.classList.contains('trail-list-choose-button-active')) {
            button.classList.remove('trail-list-choose-button-active');
          };
        });

        chosenButton.classList.toggle('trail-list-choose-button-active');

        listChoose.initializeListPanel( event.target, listSection, remoteJSON);
      };
    },

    initializeListPanel(clickedButton, listSection, remoteJSON) {

      // each button has it's own artisan data
      let buttonData = clickedButton.dataset.artisan;

      switch (buttonData) {
        case 'brewers':
          listChoose.adjustList(buttonData, listSection, remoteJSON);
        break;
        case 'ciders':
          listChoose.adjustList(buttonData, listSection, remoteJSON);
        break;
        case 'wines':
          listChoose.adjustList(buttonData, listSection, remoteJSON);
        break;
        case 'distillers':
          listChoose.adjustList(buttonData, listSection, remoteJSON);
        break;
        case 'cheeses':
          listChoose.adjustList(buttonData, listSection, remoteJSON);
        break;
        default:
          break;
      };
    },

    adjustList(buttonData, listSection, remoteJSON) {

      let chosenArtisan = [];

      let artisans = remoteJSON;

      // create new  array of the selected artisan type
      for (let i = 0; i < artisans.length; i++) {
        
        if (buttonData == artisans[i].artisanType) {
          chosenArtisan.push(artisans[i]);          
        };
      };

      // sort descending
      chosenArtisan.sort(function(a,b){
        if (a.selector < b.selector)
          return -1
        if (a.selector > b.selector)
          return 1
        return 0
      });

      // clean DOM
      listSection.innerHTML = "";

      listSection.innerHTML = `<small class="trail-list-intro">Click on an artisan to add to your personal trail!</small>`

      // add to DOM
      listSection.innerHTML += `
      <div class="trail-search">
        <label for="searchbox" class="trail-search-label">
          Search By Name Or Town
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="36" height="36" role="img" title="magnifying glass search icon" class="trail-search-svg"><path d="M963.1 833.6L704.8 575.3h-6.1c30.7-61.5 49.2-123 49.2-190.6 0-202.9-166-368.9-368.9-368.9S10 181.8 10 384.7c0 202.9 166 368.9 368.9 368.9 67.6 0 135.3-18.4 190.6-55.3l258.2 258.2c36.9 36.9 92.2 36.9 129.1 0 43.1-30.7 43.1-86 6.3-122.9zM133 384.7c0-135.3 110.7-245.9 245.9-245.9 135.3 0 245.9 110.7 245.9 245.9 0 135.3-110.7 246-245.9 246S133 520 133 384.7z"/></svg>
        </label>
        <input type="search"  id="searchbox" value=""  class="trail-search-input">
      </div>
      `;

      chosenArtisan.forEach(artisan => {
        listSection.innerHTML += `
        <div class="trail-list-item" data-business="${ artisan.selector }">
          <span class="trail-list-item-logo ${ artisan.selector }"></span>
          <p  class="trail-list-item-name">${ artisan.name }</p>
          <p class="trail-list-item-city">${ artisan.city }</p>
          <span class="trail-list-item-check">&#10003;</span>
        </div>
        `;
      });

      listSection.innerHTML += `
      <div class="trail-list-item-moosedog ">
        <div class="trail-list-item-moosedog-logo moosedog"></div>
        <p class="trail-list-item-moosedog-promo">Vermont Artisan Trail is artisanally handcrafted in Stowe, Vermont by:</p>
        <a class="trail-list-item-moosedog-link" href="https://moosedog.io" target="_blank">MooseDog Studios</a>
      </div>  
      `;

      ///////////////////
      // search function has to be in here because it depends on DOM that is created on the fly, specifically the 
      // search input box and the artisan cards
      ////////////////

      let listCards = document.querySelectorAll('.trail-list-item');
      let searchInput = document.getElementById('searchbox');
  
      function liveSearch() {
        let searchQuery = searchInput.value;
  
        for (let i = 0; i < listCards.length; i++) {
          
          // if the text is within the card and matches the search query, remove class, otherwise add class
          listCards[i].classList[listCards[i].innerText.toLowerCase().includes(searchQuery.toLowerCase())
          ?
          'remove'
          :
          'add']('is-hidden');
  
        };
      };
  
      // a little delay
      let typingTimer;
      let typeInterval = 250;
  
      searchInput.addEventListener('keyup', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(liveSearch, typeInterval);
      });
  
      // clearing the input box
      searchInput.addEventListener('search', () => {
        for (let i = 0; i < listCards.length; i++) {
          listCards[i].classList.remove('is-hidden');
        };
      });

    } // end adjustList
  }; // end listChoose

  const trailBuild = {

    init(remoteJSON) {

      let chooseArtisanButton = document.querySelector('.trail-list-choose');

      let displaySection = document.querySelector('[data-target="chosen-tab"]');
      let mapSection = document.querySelector('[data-target="map-tab"]');
      trailBuild.displaySelections(displaySection, mapSection);

      trailBuild.clickingToRemove(remoteJSON, displaySection);

      chooseArtisanButton.addEventListener('click', checkMark, true);

      function checkMark() {

        localforage.getItem('artisanIDB').then(function (idbState) {
          let artisanJsonData = remoteJSON;
          
          // if idbState already has artisan data, make sure the check mark appears
          if (idbState !== null) {
            idbState.forEach((artisanItem) => {
              let forageEls = document.querySelector(`[data-business="${ artisanItem.selector }"]`);
              if (forageEls !== null) {
                forageEls.querySelector('.trail-list-item-check').classList.add('selected');                
              };
            });
          };

          // send all the data along, regardless
          trailBuild.clickingToAdd(artisanJsonData);
        }); // end forage
      }; // end checkMark
    }, // end init

    clickingToAdd(artisanJsonData) {

      let listPanel = document.querySelector('.trail-lists');
  
      listPanel.addEventListener('click', theAddClick, true);

      function theAddClick(event) {
  
        // capture clicking in the searchbox, as it is also inside listPanel
        let clickedSearch = event.target.closest('.trail-search');
  
        // if clicked on a artisan card
        if (!clickedSearch) {
  
          // get the selector of the clicked-on artisan card
          let clickedArtisan = event.target.closest('.trail-list-item').dataset.business;
          
          // use the selector to find the matching object from the json array
          let artisanObject = artisanJsonData.find(artisan => artisan.selector === clickedArtisan);

          // show the checkmark on the clicked card
          event.target.closest('.trail-list-item').querySelector('.trail-list-item-check').classList.add('selected');
    
          // then send off to be saved in the idb
          trailBuild.saveSelection(artisanObject);
        };
      };
    },

    saveSelection(artisanObject) {

      localforage.getItem('artisanIDB').then(function (idbData) {

          if (idbData) {
            idbData.push(artisanObject);
          } else {
            idbData = []
            idbData.push(artisanObject);
          };
          localforage.setItem('artisanIDB', idbData);
          trailBuild.displaySelections(idbData);
        }); // end forage
    }, // end saveSelection

    displaySelections(displaySection, mapSection) {

      // hydrate the chosen-artisans panel upon first entering page
      function chosenFunction() {
        localforage.getItem('artisanIDB').then(idbState => {
          let selectedOutput = '';
  
          if (idbState !== null) {
            idbState.sort( (a, b) => {
              if (a.selector > b.selector) {
                return 1;
              } else {
                return -1;
              }
            });

            idbState.forEach(function(artisan) {
              selectedOutput += `
              <div class="trail-list-item" data-artisan="${artisan.selector}">
              <span class="trail-list-item-logo ${artisan.selector}"></span>
                <p class="trail-list-item-name">${artisan.name}</p>
                <p class="trail-list-item-city">${artisan.city}</p>
                <p class="trail-list-item-remove" data-remove="${artisan.selector}">\&#10005;</p>
              </div>          
              `;
            });
            displaySection.innerHTML = selectedOutput;
            
          } else {
            selectedOutput += `
            <p class="trail-panel-notyet">Nothing to see here as you haven't chosen an artisan to visit :(. <br /><br /><span>Go on, do it!</span></p>
            `;
            displaySection.innerHTML = selectedOutput;
            mapSection.innerHTML = selectedOutput;
            
          };

        }); // end forage
      }; // end chosenfunction
      chosenFunction();
    }, // end displaySelections

    // incoming data from init
    clickingToRemove(remoteJSON, displaySection) {

      displaySection.addEventListener('click', clickDeleteButton, true);

      function clickDeleteButton(event) {

        // get the selector of the clicked-on artisan card in the selected panel
        let deleteMe = event.target.closest('.trail-list-item').dataset.artisan;
  
        // use the selector to find the matching object from the json array
        let deleteMeObject = remoteJSON.find(artisan => artisan.selector === deleteMe);
  
        // get the DOM node to be removed
        let targetCard = event.target.closest('.trail-list-item');
        
        // send obj, json and targeted DOM node to be deleted
        trailBuild.removeSelection(deleteMeObject, targetCard);

      }; // end function
    }, // end clickingToRemove

    removeSelection(deleteMeObject, targetCard) {

      // first, remove artisan card from DOM in the "chosen" panel
      targetCard.classList.add('trail-list-item-removed');
      targetCard.addEventListener('transitionend', removeTargetCard);
      function removeTargetCard() {
        targetCard.remove();
      };
  
      // second, remove the check on the item on the list panel
      // but we have to wait for the chosen artisan list to be populated from the click in the choose row
      let artisanChooseRow = document.querySelector('.trail-list-choose');

      artisanChooseRow.addEventListener('click', removeCheckMark, true);

      function removeCheckMark(event) {

        let buttonClicked = event.target.closest('.trail-list-choose-button');

        if (deleteMeObject.artisanType == buttonClicked.dataset.artisan) {
          let listItem = document.querySelector(`[data-business="${deleteMeObject.selector}"]`);
          let selectedCheck = listItem.querySelector('.trail-list-item-check');
  
          if (selectedCheck.classList.contains('selected')) {
            selectedCheck.classList.remove('selected');          
          };          
        };
        
      };
  
      // third, remove from idb
      localforage.getItem('artisanIDB')
      .then(function (data) {
        let indexOfArtisan = data.findIndex(object => {
          return object.selector === deleteMeObject.selector;
        });
        data.splice(indexOfArtisan, 1);
        localforage.setItem('artisanIDB', data);
      });

      // fourth refresh entire page so map panel reflects deletion
      window.location.replace(window.location.href);

    } // end removeSelection
  };

  trailTabs.init();
  listChoose.init(remoteJSON);
  trailBuild.init(remoteJSON);
})();