(() => {
  'use strict';

  let searchInput = document.getElementById('searchbox');
  let resultsList = document.querySelector('.home-search-results')
  let searchQuery, response, artisanData;

  window.addEventListener('beforeunload', (event) => {
    searchInput.value = '';
  });


  async function fetchAndSearch() {
    try {
      response = await fetch('/all-artisan-data/all-artisan-data.json');
      artisanData = await response.json();

      ['focus', 'blur', 'keyup', 'input'].forEach(event => searchInput.addEventListener(event, doSomething));

      function doSomething(e) {
        let happening = e.type;

        switch (happening) {
          case 'focus':
          resultsList.classList.add('home-search-results-active');
            
          break;
          case 'blur':
            resultsList.classList.remove('home-search-results-active');
            setTimeout(() => {
              searchInput.value = '';
              resultsList.innerHTML = '';              
            }, 1000);
            
          break;
          case 'keyup':
            searchQuery = searchInput.value.toLowerCase();
            resultsList.innerHTML = '';

            // https://stackoverflow.com/questions/69917128/how-to-search-a-json-file-from-a-search-bar-in-html
            for (let i = 0; i < artisanData.length; i++) {
              let obj = artisanData[i];

              // send the results to the displayResults function to display them
              if (obj.name.toLowerCase().includes(searchQuery) || obj.city.toLowerCase().includes(searchQuery)) {
                displayResults(obj);
              };
            };
            
          break;
          case 'input':
            if (searchInput.value.length == 0) {
            resultsList.innerHTML = '';          
            };
            
          break;
        
          default:
          break;
        }; //end switch
      }; // end doSomething()
      
    } catch (error) {
      console.log(error);
    }; // end fetchAndSearch

    function displayResults(results) {
      let link = document.createElement('a');
      link.setAttribute('href', `/${results.artisanType}/${results.selector}/`);
      link.className = `home-search-results-link`;
      link.innerHTML = `${results.name} - ${results.city}`;
      resultsList.appendChild(link);
    };
  }; // end displayResults()

  fetchAndSearch();

})();