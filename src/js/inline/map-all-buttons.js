(() => {
  'use strict';
  
  const buttonBehavior = {
  
    init() {
      let artisanChoose = document.querySelector('.map-choose');
      let chooseButtons = document.querySelectorAll('.map-choose-button');
      let mapSection = document.querySelector('.maps-artisans');
      let mapElements = mapSection.querySelectorAll('.maps-artisans-map');
      let panelElements = mapSection.querySelectorAll('.maps-artisans-panel');
      
      artisanChoose.addEventListener('click', toggleButtonClasses);
      function toggleButtonClasses(event) {
  
        let activeButton = event.target;
  
        chooseButtons.forEach(button => {
  
          if (button.classList.contains('map-choose-button-active')) {
            button.classList.remove('map-choose-button-active');
          };
        });
  
        activeButton.classList.toggle('map-choose-button-active');
        
        buttonBehavior.initializeTargetMap( event.target, mapElements, panelElements);
      };
    },
  
    initializeTargetMap(clickedButton, mapElements, panelElements) {
      let buttonData = clickedButton.dataset;
  
      let businessType = buttonData.artisan;
  
      switch (businessType) {
        case 'brewers':
          buttonBehavior.adjustClasses(mapElements[0], mapElements, panelElements[0], panelElements);
        break;
        case 'ciders':
          buttonBehavior.adjustClasses(mapElements[1], mapElements, panelElements[1], panelElements);
        break;
        case 'wines':
          buttonBehavior.adjustClasses(mapElements[2], mapElements, panelElements[2], panelElements);
        break;
        case 'distillers':
          buttonBehavior.adjustClasses(mapElements[3], mapElements, panelElements[3], panelElements);
        break;
        case 'cheeses':
          buttonBehavior.adjustClasses(mapElements[4], mapElements, panelElements[4], panelElements);
        break;
        default:
          break;
      };
    },
  
    adjustClasses(mapElement, mapElements, panelElement, panelElements) {
  
      panelElements.forEach(panelItem => {
  
        // remove active class if it exists
        if (panelItem.classList.contains('maps-artisans-panel-active')) {
          panelItem.classList.remove('maps-artisans-panel-active');        
        };
  
        // remove open class if it exists
        if (panelItem.classList.contains('maps-artisans-panel-open')) {
          panelItem.classList.remove('maps-artisans-panel-open');        
        }
      });
  
      mapElements.forEach(mapItem => {
  
        // remove active class if it exists
        if (mapItem.classList.contains('maps-artisans-map-active')) {
          mapItem.classList.remove('maps-artisans-map-active');        
        }
      });
  
      // add active class to proscribed map div element
      mapElement.classList.add('maps-artisans-map-active');
      panelElement.classList.add('maps-artisans-panel-active');
    }
  
  } // end buttonBehavior
  buttonBehavior.init();
  })(); // END BUTTON BEHAVIOR
  