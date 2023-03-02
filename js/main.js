var $navHeader = document.querySelector('.nav-header');
var $container = document.querySelector('.container');
var $pageHeader = document.querySelector('.page-header');
var $headerFav = document.querySelector('#header-fav');
var $filterBar = document.querySelector('.filter-bar');
var $homePage = document.querySelector('#home-page');
var $favorites = document.querySelector('#favorites');
var $indivPark = document.querySelector('#individual-park');
var $indivParkImg = document.querySelector('#indiv-park-img');
var $address = document.querySelector('#address');
var $contactInfo = document.querySelector('#contact-info');
var $directions = document.querySelector('#directions');
var $directionUrl = document.querySelector('#directions-url');
var $googleMaps = document.querySelector('#google-maps');
var $weather = document.querySelector('#weather');
var $topics = document.querySelector('#topics');
var $activities = document.querySelector('#activities');
var $footer = document.querySelector('footer');
var $pageForm = document.querySelector('.page-num');
var $pageSpan = document.querySelector('#total-pages');
var $footerPages = document.querySelector('#page-num');

// Define a function to create an API url for each case
var createApiUrl = obj => {
  var corsPrefix = 'https://lfz-cors.herokuapp.com/?url=';
  var urlStart = 'http://developer.nps.gov/api/v1/parks?';
  var urlEnd = '&api_key=tZEBxgl9PvWVA6IoZ6geyHDasBEnQ1XwFNc8lbeo';
  var apiObj = {
    stateCode: null,
    limit: null,
    start: null,
    q: null
  };
  var apiParams = '';

  for (var key in obj) {
    if (Object.hasOwn(apiObj, key) === false) {
      return;
    }
    apiObj[key] = obj[key];
  }

  for (var param in apiObj) {
    if (apiObj[param] !== null) {
      apiParams += `&${param + '=' + JSON.stringify(apiObj[param])}`;
    }
  }

  return corsPrefix + encodeURIComponent(urlStart + apiParams + urlEnd);
};

// Define a function to create a high level overview of each park
var renderParkHighLvl = (view, entry) => {
  // Create elements
  var $parkDiv = document.createElement('div');
  var $imgDiv = document.createElement('div');
  var $img = document.createElement('img');
  var $detailsDiv = document.createElement('div');
  var $titleDiv = document.createElement('div');
  var $title = document.createElement('h2');
  var $favIcon = document.createElement('i');
  var $descDiv = document.createElement('div');
  var $desc = document.createElement('p');
  var $buttonDiv = document.createElement('div');
  var $button = document.createElement('button');

  // Assign standard attributes and content
  $parkDiv.className = 'park-high-lvl col-full';
  $imgDiv.className = 'col-two-fifths';
  $img.className = 'img-high-lvl';
  $detailsDiv.className = 'details-high-lvl col-three-fifths';
  $titleDiv.className = 'details-high-lvl-header';
  $title.className = 'high-lvl-title';
  $favIcon.className = 'fa-regular fa-star';
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

  if (view === 'home-page') {
    $homePage.appendChild($parkDiv);
  } else if (view === 'favorites') {
    $favorites.appendChild($parkDiv);
  }

};

// Define an XHR request meant for pagination
var xhrPages = new XMLHttpRequest();
xhrPages.open('GET', createApiUrl({ limit: 500 }));
xhrPages.responseType = 'json';

// Define a function to render page numbers based on total parks
var renderPageNums = view => {
  $footerPages.innerHTML = '';
  var totalPages = 0;
  if (view === 'home-page') {
    totalPages = Math.ceil(xhrPages.response.total / 10);
  }
  for (var i = 1; i <= totalPages; i++) {
    var $addtPage = document.createElement('option');
    $addtPage.setAttribute('value', i);
    $addtPage.textContent = i;
    $footerPages.appendChild($addtPage);
  }
  $pageSpan.textContent = ' ' + totalPages;
  $footerPages.value = data.pageNum;
};

// Define a function to render park segments based on page number
var renderParkChunks = pageNum => {
  var xhrParkChunks = new XMLHttpRequest();
  $homePage.innerHTML = '';
  if (pageNum === 1) {
    xhrParkChunks.open('GET', createApiUrl({ limit: 10, start: 0 }));
  } else {
    xhrParkChunks.open('GET', createApiUrl({ limit: 10, start: (pageNum * 10) + 1 }));
  }
  xhrParkChunks.responseType = 'json';
  xhrParkChunks.addEventListener('load', () => {
    for (var i = 0; i < xhrParkChunks.response.data.length; i++) {
      renderParkHighLvl(data.view, xhrParkChunks.response.data[i]);
    }
  });
  xhrParkChunks.send();
};

// Define a function to load the individual park view with corresponding data
var loadIndivPark = () => {
  var xhrPark = new XMLHttpRequest();
  xhrPark.open('GET', createApiUrl({ q: JSON.stringify(data.targetPark) }));
  xhrPark.responseType = 'json';
  xhrPark.addEventListener('load', event => {
    var parkResp = xhrPark.response.data[0];
    var parkAddr = parkResp.addresses.filter(address => address.type === 'Physical')[0];
    var parkContacts = parkResp.contacts;

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

    parkResp.activities.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    for (var t = 0; t < parkResp.topics.length; t++) {
      var $liTop = document.createElement('li');
      $liTop.textContent = parkResp.topics[t].name;
      $topics.appendChild($liTop);
    }

    for (var a = 0; a < parkResp.activities.length; a++) {
      var $liAct = document.createElement('li');
      $liAct.textContent = parkResp.activities[a].name;
      $activities.appendChild($liAct);
    }
  });
  xhrPark.send();
};

// Define a view-swapping function
var viewSwap = () => {
  if (data.reloaded === false) {
    data.pageNum = 1;
    data.view = 'home-page';
  }
  switch (data.view) {
    case 'home-page':
      $pageForm.reset();
      renderParkChunks(data.pageNum);
      $indivPark.classList.add('hidden');
      $homePage.classList.remove('hidden');
      $filterBar.classList.remove('hidden');
      $footer.classList.remove('hidden');
      $pageHeader.textContent = 'National Parks';
      $headerFav.classList.add('hidden');
      break;
    case 'individual-park':
      data.pageNum = 1;
      $indivPark.classList.remove('hidden');
      $homePage.classList.add('hidden');
      $filterBar.classList.add('hidden');
      $footer.classList.add('hidden');
      $headerFav.classList.remove('hidden');
      loadIndivPark();
      $topics.scrollTo(0, 0);
      $activities.scrollTo(0, 0);
      break;
  }
  window.scrollTo(0, 0);
};

// Define a function to favorite/unfavorite parks
var favToggle = event => {
  var targetIndex = 0;
  if (event.target.matches('.fa-regular')) {
    event.target.className = 'fa-solid fa-star';
    if (data.view === 'individual-park') {
      return data.favorites.push(data.targetPark);
    }
    return data.favorites.push(event.target.closest('.park-high-lvl').getAttribute('id'));
  }
  event.target.className = 'fa-regular fa-star';
  if (data.view === 'individual-park') {
    targetIndex = data.favorites.indexOf(data.targetPark);
    return data.favorites.splice(targetIndex, 1);
  }
  targetIndex = data.favorites.indexOf(event.target.closest('.park-high-lvl').getAttribute('id'));
  return data.favorites.splice(targetIndex, 1);
};

// Event listeners
xhrPages.addEventListener('load', () => {
  renderPageNums(data.view);
});
xhrPages.send();

$pageForm.addEventListener('input', () => {
  data.pageNum = $pageForm.elements['page-num'].value;
  $homePage.innerHTML = '';
  renderParkChunks(data.pageNum);
});

$navHeader.addEventListener('click', () => {
  data.view = 'home-page';
  data.pageNum = 1;
  renderPageNums(data.view);
  viewSwap();
});

$homePage.addEventListener('click', event => {
  if (event.target.className === 'more-info') {
    data.targetPark = event.target.closest('.park-high-lvl').getAttribute('id');
    data.view = 'individual-park';
    viewSwap();
  }
});

$container.addEventListener('click', event => {
  if (event.target.matches('.fa-star')) {
    favToggle(event);
  }
});

document.addEventListener('DOMContentLoaded', viewSwap());
