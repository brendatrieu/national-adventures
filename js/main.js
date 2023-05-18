const $navHeader = document.querySelector('.nav-header');
const $navLinks = document.querySelector('.nav-links');
const $container = document.querySelector('.container');
const $pageHeader = document.querySelector('.page-header');
const $headerFav = document.querySelector('#header-fav');
const $filterBar = document.querySelector('.filter-bar');
const $filterModal = document.querySelector('#filter-modal');
const $filterForm = document.querySelector('#filter-form');
const $stateDropdown = document.querySelector('#state-dropdown');
const $activityDropdown = document.querySelector('#activity-dropdown');
const $topicDropdown = document.querySelector('#topic-dropdown');
const $stateOptions = document.querySelector('#state-options');
const $activityOptions = document.querySelector('#activity-options');
const $topicOptions = document.querySelector('#topic-options');
const $clearAll = document.querySelector('#clear-filter');
const $homePage = document.querySelector('#home-page');
const $favorites = document.querySelector('#Favorites');
const $noResults = document.querySelector('#no-results');
const $favParks = document.querySelector('#fav-parks');
const $findParks = document.querySelector('.find-parks');
const $indivPark = document.querySelector('#individual-park');
const $indivParkImg = document.querySelector('#indiv-park-img');
const $address = document.querySelector('#address');
const $contactInfo = document.querySelector('#contact-info');
const $directions = document.querySelector('#directions');
const $directionUrl = document.querySelector('#directions-url');
const $googleMaps = document.querySelector('#google-maps');
const $weather = document.querySelector('#weather');
const $thingsToDoHeader = document.querySelector('#things-to-do-header');
const $thingsToDoDiv = document.querySelector('#things-to-do-div');
const $topicsSection = document.querySelector('#topics-section');
const $activitiesSection = document.querySelector('#activities-section');
const $topics = document.querySelector('#topics');
const $activities = document.querySelector('#activities');
const $noFilteredResults = document.querySelector('#no-filtered-results');
const $footer = document.querySelector('footer');
const $pageForm = document.querySelector('.page-num');
const $pageSpan = document.querySelector('#total-pages');
const $footerPages = document.querySelector('#page-num');

// Define a function to create an API url for each case
const createApiUrl = obj => {
  const corsPrefix = 'https://lfz-cors.herokuapp.com/?url=';
  const urlStart = 'http://developer.nps.gov/api/v1/parks?';
  const urlEnd = '&api_key=tZEBxgl9PvWVA6IoZ6geyHDasBEnQ1XwFNc8lbeo';
  const apiObj = {
    parkCode: '',
    stateCode: '',
    limit: '',
    start: '',
    q: ''
  };
  let apiParams = '';
  for (const key in obj) {
    if (Object.hasOwn(apiObj, key) === false) {
      return;
    }
    if (typeof obj[key] === 'object') {
      obj[key].sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
      apiObj[key] = obj[key].join(',');
    } else {
      apiObj[key] = obj[key];
    }
  }
  for (const param in apiObj) {
    if (apiObj[param] !== '') {
      apiParams += `&${param + '=' + apiObj[param]}`;
    }
  }

  return corsPrefix + encodeURIComponent(urlStart + apiParams + urlEnd);
};

// Define a function to create a high level overview of each park
const renderParkHighLvl = (view, entry) => {
  // Create elements
  const $parkDiv = document.createElement('div');
  const $imgDiv = document.createElement('div');
  const $img = document.createElement('img');
  const $detailsDiv = document.createElement('div');
  const $titleDiv = document.createElement('div');
  const $title = document.createElement('h2');
  const $favIcon = document.createElement('i');
  const $descDiv = document.createElement('div');
  const $desc = document.createElement('p');
  const $buttonDiv = document.createElement('div');
  const $button = document.createElement('button');

  // Assign standard attributes and content
  $parkDiv.className = 'park-high-lvl col-full';
  $imgDiv.className = 'col-two-fifths';
  $img.className = 'img-high-lvl';
  $detailsDiv.className = 'details-high-lvl col-three-fifths';
  $titleDiv.className = 'details-high-lvl-header';
  $title.className = 'high-lvl-title';
  $descDiv.className = 'high-lvl-desc';
  $buttonDiv.className = 'align-right';
  $button.className = 'more-info';
  $button.setAttribute('type', 'button');
  $button.textContent = 'More Info';

  // Assign nonstandard attributes and content
  $parkDiv.setAttribute('id', entry.parkCode);
  $img.setAttribute('src', entry.images[0].url);
  $img.setAttribute('alt', entry.images[0].altText);
  $title.textContent = entry.fullName;
  $desc.textContent = entry.description;
  $favIcon.className = 'fa-regular fa-star';
  if (data.favorites.includes(entry.parkCode)) {
    $favIcon.className = 'fa-solid fa-star';
  }

  // Append elements
  $buttonDiv.appendChild($button);
  $descDiv.appendChild($desc);
  $descDiv.appendChild($buttonDiv);
  $titleDiv.appendChild($title);
  $titleDiv.appendChild($favIcon);
  $detailsDiv.appendChild($titleDiv);
  $detailsDiv.appendChild($descDiv);
  $imgDiv.appendChild($img);
  $parkDiv.appendChild($imgDiv);
  $parkDiv.appendChild($detailsDiv);

  if (view === 'home-page' || view === 'home-filtered') {
    $homePage.appendChild($parkDiv);
  } else if (view === 'Favorites' || view === 'favorites-filtered') {
    $favParks.appendChild($parkDiv);
  }
};

const filterData = response => {
  for (let p = 0; p < response.data.length; p++) {
    let matchCount = 0;
    const matchArr = [];
    const combinedData = [...response.data[p].activities, ...response.data[p].topics];
    for (let t = 0; t < combinedData.length; t++) {
      if (data.inputs.topics.includes(combinedData[t].name) && !matchArr.includes(combinedData[t].name)) {
        matchCount++;
        matchArr.push(combinedData[t].name);
      }
    }
    if (matchCount === data.inputs.topics.length) {
      data.inputs.filteredTopics.push(response.data[p]);
    }
  }
};

// Define a function to render park segments based on page number
const renderParkChunks = pageNum => {
  const xhrParkChunks = new XMLHttpRequest();
  let totalPages = 0;
  $homePage.innerHTML = '';
  $favParks.innerHTML = '';
  $footerPages.innerHTML = '';
  $noFilteredResults.classList.add('hidden');
  $footer.classList.remove('hidden');

  if (data.view === 'home-page') {
    xhrParkChunks.open('GET', createApiUrl({ limit: 10, start: ((pageNum - 1) * 10) }));
  } else if (data.view === 'home-filtered') {
    xhrParkChunks.open('GET', createApiUrl({ stateCode: data.inputs.stateCode, limit: 500, start: ((pageNum - 1) * 10) }));
  } else if (data.view === 'Favorites') {
    xhrParkChunks.open('GET', createApiUrl({ parkCode: data.favorites, limit: 10, start: ((pageNum - 1) * 10) }));
  } else if (data.view === 'favorites-filtered') {
    xhrParkChunks.open('GET', createApiUrl({ stateCode: data.inputs.stateCode, parkCode: data.favorites, limit: 10, start: ((pageNum - 1) * 10) }));
  }

  xhrParkChunks.responseType = 'json';

  xhrParkChunks.addEventListener('load', () => {
    const response = xhrParkChunks.response;

    if (data.inputs.filterStatus === true) {
      filterData(response);
    }

    // Determine total pages
    if (data.view === 'home-filtered' || data.view === 'favorites-filtered') {
      if (data.inputs.filteredTopics.length < 1) {
        $noFilteredResults.classList.remove('hidden');
        $footer.classList.add('hidden');
        data.inputs.filterStatus = false;
        return;
      }
      totalPages = Math.ceil(data.inputs.filteredTopics.length / 10);
    } else if (data.view === 'home-page') {
      totalPages = Math.ceil(response.total / 10);
    } else if (data.view === 'Favorites') {
      if (data.favorites.length >= 10) {
        totalPages = Math.ceil(data.favorites.length / 10);
      } else if (!data.favorites.length) {
        $footer.classList.add('hidden');
      } else {
        totalPages = 1;
      }
    }

    // Display parks based on page number/total
    if (data.view === 'home-filtered' || data.view === 'favorites-filtered') {
      let start = 0;
      let end = data.inputs.filteredTopics.length;
      if (data.inputs.filteredTopics.length > 10) {
        start = (pageNum - 1) * 10;
        if (pageNum < totalPages) {
          end = start + 10;
        }
      }
      for (start; start < end; start++) {
        renderParkHighLvl(data.view, data.inputs.filteredTopics[start]);
      }
    } else {
      for (let i = 0; i < response.data.length; i++) {
        renderParkHighLvl(data.view, response.data[i]);
      }
    }

    // Create footer page form options
    for (let tp = 1; tp <= totalPages; tp++) {
      const $addtPage = document.createElement('option');
      $addtPage.setAttribute('value', tp);
      $addtPage.textContent = tp;
      $footerPages.appendChild($addtPage);
    }

    $pageSpan.textContent = ' ' + totalPages;
    $footerPages.value = data.pageNum;
    data.inputs.filterStatus = false;
  });

  xhrParkChunks.send();
};

// Define a function to load the individual park view with corresponding data
const loadIndivPark = () => {
  $topics.innerHTML = '';
  $activities.innerHTML = '';
  $thingsToDoHeader.classList.remove('hidden');
  $thingsToDoDiv.classList.remove('hidden');
  $topicsSection.classList.remove('hidden');
  $activitiesSection.classList.remove('hidden');

  const xhrPark = new XMLHttpRequest();
  xhrPark.open('GET', createApiUrl({ parkCode: data.targetPark }));
  xhrPark.responseType = 'json';
  xhrPark.addEventListener('load', event => {
    const parkResp = xhrPark.response.data[0];
    const parkAddr = parkResp.addresses.filter(address => address.type === 'Physical')[0];
    const parkContacts = parkResp.contacts;

    $pageHeader.textContent = parkResp.fullName;
    $indivParkImg.setAttribute('src', parkResp.images[0].url);
    $indivParkImg.setAttribute('alt', parkResp.images[0].altText);
    $address.textContent = `${parkAddr.line1}
${parkAddr.city}, ${parkAddr.stateCode} ${parkAddr.postalCode}`;
    $contactInfo.textContent = `${parkContacts.phoneNumbers[0].type}: ${parkContacts.phoneNumbers[0].phoneNumber}
Email: ${parkContacts.emailAddresses[0].emailAddress}`;
    $directions.textContent = parkResp.directionsInfo;
    $directionUrl.setAttribute('href', parkResp.directionsUrl);
    $googleMaps.setAttribute('href', `https://maps.google.com/?q=${parkResp.latitude},${parkResp.longitude}`);
    $weather.textContent = parkResp.weatherInfo;

    parkResp.topics.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    parkResp.activities.sort((c, d) => {
      if (c.name < d.name) {
        return -1;
      } else if (c.name > d.name) {
        return 1;
      }
      return 0;
    });

    for (let t = 0; t < parkResp.topics.length; t++) {
      if (data.topics.includes(parkResp.topics[t].name)) {
        const $liTop = document.createElement('li');
        $liTop.textContent = parkResp.topics[t].name;
        $topics.appendChild($liTop);
      }
    }
    for (let a = 0; a < parkResp.activities.length; a++) {
      if (data.activities.includes(parkResp.activities[a].name)) {
        const $liAct = document.createElement('li');
        $liAct.textContent = parkResp.activities[a].name;
        $activities.appendChild($liAct);
      }
    }

    if (!parkResp.topics.length && !parkResp.activities.length) {
      $thingsToDoHeader.classList.add('hidden');
      $thingsToDoDiv.classList.add('hidden');
    } else if (!parkResp.topics.length) {
      $topicsSection.classList.add('hidden');
    } else if (!parkResp.activities.length) {
      $activitiesSection.classList.add('hidden');
    }
  });
  xhrPark.send();
};

const loadFilters = () => {
  if (data.view === 'home-filtered' || data.view === 'favorites-filtered') {
    if (data.inputs.stateCode) {
      for (const st of data.inputs.stateCode) {
        $filterForm.elements[st].checked = true;
      }
    }
    if (data.inputs.topics) {
      for (const top of data.inputs.topics) {
        const checkedId = top.split('').filter(char => char !== ' ').join('');
        if (document.getElementById(checkedId)) {
          document.getElementById(checkedId).checked = true;
        }
      }
    }
  }
};

// Define a view-swapping function
const viewSwap = () => {
  if (data.firstLoad && !data.reloaded) {
    data.pageNum = 1;
    data.view = 'home-page';
    data.inputs = {};
  }

  if (data.view === 'home-filtered' && !Object.keys(data.inputs)) {
    data.view = 'home-page';
  }
  if (data.view === 'favorites-filtered' && !Object.keys(data.inputs)) {
    data.view = 'Favorites';
  }

  switch (data.view) {
    case 'home-page':
    case 'home-filtered':
      $pageForm.reset();
      renderParkChunks(data.pageNum);
      $indivPark.classList.add('hidden');
      $homePage.classList.remove('hidden');
      $filterBar.classList.remove('hidden');
      $filterModal.classList.add('hidden');
      $favorites.classList.add('hidden');
      $footer.classList.remove('hidden');
      $pageHeader.textContent = 'National Parks';
      $headerFav.classList.add('hidden');
      $noFilteredResults.classList.add('hidden');
      break;
    case 'individual-park':
      data.pageNum = 1;
      $indivPark.classList.remove('hidden');
      $homePage.classList.add('hidden');
      $favorites.classList.add('hidden');
      $filterBar.classList.add('hidden');
      $filterModal.classList.add('hidden');
      $footer.classList.add('hidden');
      $noFilteredResults.classList.add('hidden');
      $headerFav.className = 'fa-regular fa-star';
      if (data.favorites.includes(data.targetPark)) {
        $headerFav.className = 'fa-solid fa-star';
      }
      loadIndivPark();
      $topics.scrollTo(0, 0);
      $activities.scrollTo(0, 0);
      break;
    case 'Favorites':
    case 'favorites-filtered':
      $pageForm.reset();
      $homePage.classList.add('hidden');
      $indivPark.classList.add('hidden');
      $favorites.classList.remove('hidden');
      $filterBar.classList.remove('hidden');
      $filterModal.classList.add('hidden');
      $pageHeader.textContent = 'Favorites';
      $headerFav.classList.add('hidden');
      $noFilteredResults.classList.add('hidden');
      if (data.favorites.length < 1) {
        $favParks.className = 'hidden';
        $noResults.classList.remove('hidden');
        $footer.classList.add('hidden');
      }
      if (data.favorites.length > 0) {
        $noResults.classList.add('hidden');
        $favParks.className = '';
        renderParkChunks(data.pageNum);
        $footer.classList.remove('hidden');
      }
      break;
  }
  if (data.firstLoad) {
    data.firstLoad = false;
  }
  window.scrollTo(0, 0);
};

// Define a function to favorite/unfavorite parks
const favToggle = event => {
  let targetIndex = 0;

  if (event.target.matches('.fa-regular')) {
    event.target.className = 'fa-solid fa-star';
    if (data.view === 'individual-park') {
      return data.favorites.push(data.targetPark);
    }
    return data.favorites.push(event.target.closest('.park-high-lvl').getAttribute('id'));
  }

  if (event.target.matches('.fa-solid')) {
    event.target.className = 'fa-regular fa-star';
    if (data.view === 'individual-park') {
      targetIndex = data.favorites.indexOf(data.targetPark);
      return data.favorites.splice(targetIndex, 1);
    }
    targetIndex = data.favorites.indexOf(event.target.closest('.park-high-lvl').getAttribute('id'));
    data.favorites.splice(targetIndex, 1);
    if (data.view === 'favorites-filtered') {
      data.inputs.filteredTopics = data.inputs.filteredTopics.filter(park => park.parkCode !== event.target.closest('.park-high-lvl').getAttribute('id'));
      viewSwap();
    }
    if (data.view === 'Favorites') {
      viewSwap();
    }
  }
};

// Define a function to add state options to the dropdown menu
const filterDropdowns = () => {
  // Load states
  data.states.forEach(state => {
    const $label = document.createElement('label');
    const $input = document.createElement('input');

    $input.setAttribute('type', 'checkbox');
    $input.setAttribute('name', 'state');
    $input.setAttribute('value', state.abbreviation);
    $input.setAttribute('id', state.abbreviation);
    $label.appendChild($input);
    $label.insertAdjacentText('beforeend', '' + state.name);
    $stateOptions.appendChild($label);
  });

  // Load activities
  const xhrAct = new XMLHttpRequest();
  const activitiesList = [];
  xhrAct.open('GET', 'https://developer.nps.gov/api/v1/activities/parks?api_key=tZEBxgl9PvWVA6IoZ6geyHDasBEnQ1XwFNc8lbeo');
  xhrAct.responseType = 'json';
  xhrAct.addEventListener('load', () => {
    for (let a = 0; a < xhrAct.response.data.length; a++) {
      activitiesList.push(xhrAct.response.data[a].name);
      activitiesList.sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
    }
    activitiesList.forEach(act => {
      data.activities.push(act);
      const $label = document.createElement('label');
      const $input = document.createElement('input');
      const actId = act.split('').filter(char => char !== ' ').join('');

      $input.setAttribute('type', 'checkbox');
      $input.setAttribute('name', 'activity');
      $input.setAttribute('value', act);
      $input.setAttribute('id', actId);

      $label.appendChild($input);
      $label.insertAdjacentText('beforeend', '' + act);
      $activityOptions.appendChild($label);
    });
    loadFilters();
  });
  xhrAct.send();

  // Load topics
  const xhrTop = new XMLHttpRequest();
  const topicsList = [];
  xhrTop.open('GET', 'https://developer.nps.gov/api/v1/topics?limit=100&api_key=tZEBxgl9PvWVA6IoZ6geyHDasBEnQ1XwFNc8lbeo');
  xhrTop.responseType = 'json';
  xhrTop.addEventListener('load', () => {
    for (let t = 0; t < xhrTop.response.data.length; t++) {
      topicsList.push(xhrTop.response.data[t].name);
      topicsList.sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
    }
    topicsList.forEach(top => {
      data.topics.push(top);
      const $label = document.createElement('label');
      const $input = document.createElement('input');
      const topId = top.split('').filter(char => char !== ' ').join('');

      $input.setAttribute('type', 'checkbox');
      $input.setAttribute('name', 'topic');
      $input.setAttribute('value', top);
      $input.setAttribute('id', topId);

      $label.appendChild($input);
      $label.insertAdjacentText('beforeend', '' + top);
      $topicOptions.appendChild($label);
    });
    loadFilters();
  });
  xhrTop.send();
};

filterDropdowns();

// Define a filter modal toggle function
const toggleFilterBar = () => {
  if ($filterModal.matches('.hidden')) {
    $filterModal.classList.remove('hidden');
  } else {
    $filterModal.classList.add('hidden');
  }
};

const toggleFilterOptions = option => {
  if (!option.nextElementSibling.className) {
    option.nextElementSibling.className = 'hidden';
    option.style.backgroundColor = 'white';
    option.style.borderBottom = '1px solid #dda15e';
    option.style.borderRadius = '0.3rem';
  } else {
    option.nextElementSibling.className = '';
    option.style.borderBottom = 'none';
    option.style.borderRadius = '0.3rem 0.3rem 0 0';
    option.style.backgroundColor = '#fcf6ed';
  }
};

const filterFormCollapse = () => {
  if (!$stateOptions.className) {
    toggleFilterOptions($stateDropdown);
  }
  if (!$topicOptions.className) {
    toggleFilterOptions($topicDropdown);
  }
  if (!$activityOptions.className) {
    toggleFilterOptions($activityDropdown);
  }
};

const filterClear = event => {
  event.preventDefault();
  for (let e = 0; e < $filterForm.elements.length; e++) {
    if ($filterForm.elements[e].tagName === 'INPUT' && $filterForm.elements[e].checked) {
      $filterForm.elements[e].checked = false;
    }
  }
  data.inputs = {};
};

const filterFormSearch = () => {
  toggleFilterBar();
  event.preventDefault();
  const inputs = {
    stateCode: [],
    topics: [],
    filteredTopics: [],
    filterStatus: true
  };

  for (let e = 0; e < $filterForm.elements.length; e++) {
    if ($filterForm.elements[e].tagName === 'INPUT' && $filterForm.elements[e].checked) {
      switch ($filterForm.elements[e].name) {
        case 'state':
          inputs.stateCode.push($filterForm.elements[e].value);
          break;
        case 'topic':
        case 'activity':
          inputs.topics.push($filterForm.elements[e].value);
          break;
      }
    }
  }

  filterFormCollapse();

  if (data.view === 'home-page') {
    data.view = 'home-filtered';
  } else if (data.view === 'Favorites') {
    data.view = 'favorites-filtered';
  }
  data.inputs = inputs;
  data.pageNum = 1;
  renderParkChunks(data.pageNum);
};

// ----- Event listeners -----
document.addEventListener('DOMContentLoaded', () => {
  data.firstLoad = true;
  viewSwap();
});

$navHeader.addEventListener('click', () => {
  data.view = 'home-page';
  data.pageNum = 1;
  data.inputs = {};
  $filterForm.reset();
  filterFormCollapse();
  viewSwap();
});

$navLinks.addEventListener('click', event => {
  data.view = event.target.textContent;
  data.pageNum = 1;
  data.inputs = {};
  $filterForm.reset();
  filterFormCollapse();
  viewSwap();
});

$container.addEventListener('click', event => {
  if (event.target.className === 'more-info') {
    data.targetPark = event.target.closest('.park-high-lvl').getAttribute('id');
    data.view = 'individual-park';
    viewSwap();
  }
  if (event.target.matches('.fa-star')) {
    favToggle(event);
  }
});

$filterBar.addEventListener('click', toggleFilterBar);

$filterForm.addEventListener('click', event => {
  if (event.target.matches('.filter-field')) {
    toggleFilterOptions(event.target);
  }
  if (event.target.matches('.fa-caret-down')) {
    toggleFilterOptions(event.target.closest('.filter-field'));
  }
});

$clearAll.addEventListener('click', filterClear);

$filterForm.addEventListener('submit', filterFormSearch);

$findParks.addEventListener('click', () => {
  data.view = 'home-page';
  viewSwap();
});

$pageForm.addEventListener('input', () => {
  data.pageNum = $pageForm.elements['page-num'].value;
  $homePage.innerHTML = '';
  renderParkChunks(data.pageNum);
});
