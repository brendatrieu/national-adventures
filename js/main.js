var $main = document.querySelector('main');
var $footerPages = document.querySelector('#page-num');
var $pageForm = document.querySelector('form');
var $pageSpan = document.querySelector('#total-pages');

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
  $main.appendChild($parkDiv);
};

// Define an XHR request meant for pagination
var xhrPages = new XMLHttpRequest();
xhrPages.open('GET', 'http://developer.nps.gov/api/v1/parks?limit=500&api_key=tZEBxgl9PvWVA6IoZ6geyHDasBEnQ1XwFNc8lbeo');
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
    xhrParkChunks.open('GET', `http://developer.nps.gov/api/v1/parks?limit=10&start=${pageNum - 1}&api_key=tZEBxgl9PvWVA6IoZ6geyHDasBEnQ1XwFNc8lbeo`);
  } else {
    xhrParkChunks.open('GET', `http://developer.nps.gov/api/v1/parks?limit=10&start=${(pageNum * 10) + 1}&api_key=tZEBxgl9PvWVA6IoZ6geyHDasBEnQ1XwFNc8lbeo`);
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

// var loadContacts = () => {
//   for (var i = 0; i < 100; i++) {
//     var $ul = document.createElement('ul');
//     $ul.textContent = xhr.response.data[i].fullName;
//     xhr.response.data[i].contacts.phoneNumbers.forEach(number => {
//       var $li = document.createElement('li');
//       $li.textContent = JSON.stringify(number.type) + ': ' + JSON.stringify(number.phoneNumber);
//       $ul.appendChild($li);
//     });
//     var $liEmail = document.createElement('li');
//     $liEmail.textContent = JSON.stringify(xhr.response.data[i].contacts.emailAddresses[0].emailAddress);
//     $ul.appendChild($liEmail);
//     $printedData.appendChild($ul);
//   }
// };

// var loadAddresses = () => {
//   for (var i = 0; i < 10; i++) {
//     var $ul = document.createElement('ul');
//     $ul.textContent = xhr.response.data[i].fullName;
//     var currAddr = xhr.response.data[i].addresses.filter(address => address.type === 'Physical')[0];
//     console.log('$ul', $ul);
//     var $li = document.createElement('li');
//     $li.textContent = currAddr.line1 + ' ' + currAddr.city + ', ' + currAddr.stateCode + ' ' + currAddr.postalCode;
//     $ul.appendChild($li);
//     $printedData.appendChild($ul);
//   }
// };

// var loadDirections = () => {
//   for (var i = 0; i < 10; i++) {
//     var $ul = document.createElement('ul');
//     $ul.textContent = xhr.response.data[i].fullName;
//     var $li = document.createElement('li');
//     $li.textContent = xhr.response.data[i].directionsUrl;
//     $ul.appendChild($li);
//     $printedData.appendChild($ul);
//   }
// };

// var loadWeather = () => {
//   for (var i = 0; i < 10; i++) {
//     var $ul = document.createElement('ul');
//     $ul.textContent = xhr.response.data[i].fullName;
//     var $li = document.createElement('li');
//     $li.textContent = xhr.response.data[i].weatherInfo;
//     $ul.appendChild($li);
//     $printedData.appendChild($ul);
//   }
// };

// var loadTopics = () => {
//   for (var i = 0; i < 10; i++) {
//     var $ul = document.createElement('ul');
//     $ul.textContent = JSON.stringify(xhr.response.data[i].fullName);
//     for (var j = 0; j < xhr.response.data[i].topics.length; j++) {
//       var $li = document.createElement('li');
//       $li.textContent = JSON.stringify(xhr.response.data[i].topics[j].name);
//       $ul.appendChild($li);
//     }
//     $printedData.appendChild($ul);
//   }
// };

// var loadActivities = () => {
//   for (var i = 0; i < 10; i++) {
//     var $ul = document.createElement('ul');
//     $ul.textContent = xhr.response.data[i].fullName;
//     for (var j = 0; j < xhr.response.data[i].activities.length; j++) {
//       var $li = document.createElement('li');
//       $li.textContent = xhr.response.data[i].activities[j].name;
//       $ul.appendChild($li);
//     }
//     $printedData.appendChild($ul);
//   }
// };

// Event listeners
xhrPages.addEventListener('load', () => {
  renderPageNums(data.view);
});
xhrPages.send();

$pageForm.addEventListener('input', () => {
  pageNum = $pageForm.elements['page-num'].value;
  $main.innerHTML = '';
  renderParkChunks(pageNum);
});
