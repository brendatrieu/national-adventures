/* exported data */

var data = {
  view: 'home-page',
  pageNum: 1,
  targetPark: '',
  favorites: [],
  reloaded: false
};

window.addEventListener('beforeunload', () => {
  data.reloaded = false;
  localStorage.setItem('nationalAdventures', JSON.stringify(data));
});

if (localStorage.getItem('nationalAdventures')) {
  data = JSON.parse(localStorage.getItem('nationalAdventures'));
}

window.addEventListener('beforeunload', () => {
  data.reloaded = true;
  sessionStorage.setItem('nationalAdventuresSession', JSON.stringify(data));
});

if (sessionStorage.getItem('nationalAdventuresSession')) {
  data = JSON.parse(sessionStorage.getItem('nationalAdventuresSession'));
}
