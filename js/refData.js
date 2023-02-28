// This page is solely used for reference during the time of planning.

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
