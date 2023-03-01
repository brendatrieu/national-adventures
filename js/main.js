var $homePage = document.querySelector('#home-page');
var $footerPages = document.querySelector('#page-num');
var $pageForm = document.querySelector('form');
var $pageSpan = document.querySelector('#total-pages');

// Define a function to create an API url for each case
var createApiUrl = obj => {
  var corsPrefix = 'https://lfz-cors.herokuapp.com/?url=';
  var urlStart = 'http://developer.nps.gov/api/v1/parks?';
  var urlEnd = '&api_key=tZEBxgl9PvWVA6IoZ6geyHDasBEnQ1XwFNc8lbeo';
  var apiObj = {
    stateCode: null,
    limit: null,
    start: null,
    query: null
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
var renderParkHighLvl = entry => {
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
  $imgDiv.className = 'img-high-lvl col-two-fifths';
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
  $parkDiv.setAttribute('id', entry.id);
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
  $homePage.appendChild($parkDiv);
};

// Define an XHR request meant for pagination
var xhrPages = new XMLHttpRequest();
xhrPages.open('GET', createApiUrl({ limit: 500 }));
xhrPages.responseType = 'json';

// Define a function to render page numbers based on total parks
var renderPageNums = view => {
  var totalPages = 0;
  if (view === 'default') {
    totalPages = Math.ceil(xhrPages.response.total / 10);
  }
  for (var i = 2; i <= totalPages; i++) {
    var $addtPage = document.createElement('option');
    $addtPage.setAttribute('value', i);
    $addtPage.textContent = i;
    $footerPages.appendChild($addtPage);
  }
  $pageSpan.textContent = ' ' + totalPages;
};

// Define a function to render park segments based on page number
var pageNum = JSON.parse($pageForm.elements['page-num'].value);

var renderParkChunks = pageNum => {
  var xhrParkChunks = new XMLHttpRequest();

  if (pageNum === 1) {
    xhrParkChunks.open('GET', createApiUrl({ limit: 10, start: 0 }));
  } else {
    xhrParkChunks.open('GET', createApiUrl({ limit: 10, start: (pageNum * 10) + 1 }));
  }
  xhrParkChunks.responseType = 'json';
  xhrParkChunks.addEventListener('load', () => {
    for (var i = 0; i < xhrParkChunks.response.data.length; i++) {
      renderParkHighLvl(xhrParkChunks.response.data[i]);
    }
  });
  xhrParkChunks.send();
};

renderParkChunks(pageNum);

// Event listeners
xhrPages.addEventListener('load', () => {
  renderPageNums(data.view);
});
xhrPages.send();

$pageForm.addEventListener('input', () => {
  pageNum = $pageForm.elements['page-num'].value;
  $homePage.innerHTML = '';
  renderParkChunks(pageNum);
});
